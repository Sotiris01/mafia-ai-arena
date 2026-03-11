// =============================================================================
// FILE: SpeakProbability.ts
// PURPOSE: Speak chance calculator — personality × role × trigger × cooldown
// LOCATION: src/ai/SpeakProbability.ts
// =============================================================================

// Determines whether an AI player should speak in the current discussion
// round. This is the DECISION LAYER (always if-else, never replaced by LLM).
//
// Formula:
//   final_chance = speak_probability_base
//                  × role_modifier
//                  × trigger_modifier
//                  × cooldown_modifier
//
// Collaborating files:
// - src/types/personality.types.ts    — speak_probability_base, aggression, emotional_reactivity
// - src/types/player.types.ts         — PlayerRole for role_modifier
// - src/state/PlayerState.ts          — reads player personality + role
// - src/state/ChatState.ts            — reads recent messages for trigger detection + cooldown
// - src/engine/AIEngine.ts            — calls shouldSpeak() during discussion
// - src/data/config.json              — speak_cooldown_messages, role_modifiers, cooldown/trigger modifiers
// - src/utils/probability.ts          — random roll against final_chance

import type { PlayerRole } from "../types/player.types";
import type { PlayerPersonality } from "../types/personality.types";
import type { ChatEvent } from "../types/chat.types";
import type { AIConfig } from "../types/game.types";
import * as PlayerState from "../state/PlayerState";
import * as ChatState from "../state/ChatState";
import * as GameState from "../state/GameState";
import { rollProbability, clamp } from "../utils/probability";
import configData from "../data/config.json";

const aiConfig = (configData as Record<string, unknown>).ai as AIConfig;

// ---------------------------------------------------------------------------
// Context for trigger evaluation
// ---------------------------------------------------------------------------

export interface SpeakContext {
  /** Total messages sent so far in this discussion round */
  messageCount: number;
  // TODO(Phase 4 Step 4): Add isTrialPhase flag for different speak rates
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Decide whether an AI player should speak right now.
 * Rolls probability against the combined modifier chain.
 */
export function shouldSpeak(
  playerId: string,
  context: SpeakContext,
): boolean {
  const personality = PlayerState.getPersonality(playerId);
  const player = PlayerState.getPlayer(playerId);
  const day = GameState.getState().day;

  const base = calculateBaseChance(personality, day);
  const roleMod = getRoleModifier(player);
  const triggerMod = getTriggerModifier(playerId, day);
  const cooldownMod = getCooldownModifier(playerId, context.messageCount);

  const finalChance = clamp(base * roleMod * triggerMod * cooldownMod, 0, 1);

  return rollProbability(finalChance);
}

/**
 * Return the computed speak probability without rolling.
 * Useful for testing and debugging.
 */
export function getChance(
  playerId: string,
  context: SpeakContext,
): number {
  const personality = PlayerState.getPersonality(playerId);
  const player = PlayerState.getPlayer(playerId);
  const day = GameState.getState().day;

  const base = calculateBaseChance(personality, day);
  const roleMod = getRoleModifier(player);
  const triggerMod = getTriggerModifier(playerId, day);
  const cooldownMod = getCooldownModifier(playerId, context.messageCount);

  return clamp(base * roleMod * triggerMod * cooldownMod, 0, 1);
}

// ---------------------------------------------------------------------------
// Base chance
// ---------------------------------------------------------------------------

/**
 * Start from the personality's speak_probability_base.
 * Day 1 boost: everyone talks more on the first day (+20%).
 */
function calculateBaseChance(
  personality: PlayerPersonality,
  day: number,
): number {
  let base = personality.speak_probability_base;
  if (day === 1) {
    base *= 1.2; // Day 1 boost — players are more talkative early on
  }
  return base;
}

// ---------------------------------------------------------------------------
// Role modifier
// ---------------------------------------------------------------------------

/**
 * Mafia players speak slightly more to blend in with Town.
 * Special roles (Sheriff, Mayor, Jester) have config-driven modifiers.
 */
function getRoleModifier(player: PlayerRole): number {
  const modifiers = aiConfig.role_modifiers;

  // Check for specific role modifier first
  const roleKey = player.role.replace(" ", "_");
  if (roleKey in modifiers) {
    // Special case: Mayor has pre/post reveal variants
    if (player.role === "Mayor") {
      return player.is_revealed_mayor
        ? (modifiers["Mayor_post_reveal"] ?? 1.0)
        : (modifiers["Mayor_pre_reveal"] ?? 1.0);
    }
    return modifiers[roleKey] ?? 1.0;
  }

  // Fall back to alignment-based modifier
  if (player.alignment === "Mafia") {
    return modifiers["mafia_general"] ?? 1.0;
  }
  return modifiers["town_general"] ?? 1.0;
}

// ---------------------------------------------------------------------------
// Trigger modifier
// ---------------------------------------------------------------------------

/**
 * Boost speak chance when the player has a reason to talk:
 * - Was directly accused → very high boost
 * - Has evidence to share → high boost
 * - Ally was attacked or defended → moderate boost
 * - Saw something relevant → small boost
 *
 * Uses the highest applicable trigger (not cumulative).
 */
function getTriggerModifier(
  playerId: string,
  day: number,
): number {
  const triggers = aiConfig.trigger_modifiers;
  const recentEvents = ChatState.getEventsByDay(day);

  // Check triggers from highest priority to lowest
  // Trigger value is ADDED to base 1.0

  if (wasDirectlyAccused(playerId, recentEvents)) {
    return 1.0 + (triggers["directly_accused"] ?? 0.95);
  }

  if (hasEvidenceToShare(playerId)) {
    return 1.0 + (triggers["has_evidence"] ?? 0.85);
  }

  if (wasAllyInvolved(playerId, recentEvents)) {
    return 1.0 + (triggers["ally_defended_or_attacked"] ?? 0.40);
  }

  // TODO(Phase 5): Check night_echo_mentions_self_or_ally
  // TODO(Phase 5): Check lover_partner_accused
  // TODO(Phase 5): Check mayor_revealed

  // No trigger — neutral modifier
  return 1.0;
}

/** Check if this player was accused in recent events */
function wasDirectlyAccused(
  playerId: string,
  events: ChatEvent[],
): boolean {
  return events.some(
    (e) => e.action === "accuse" && e.target === playerId,
  );
}

/** Check if the player has known roles to share (investigation results) */
function hasEvidenceToShare(playerId: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const memory = require("../state/MemoryManager") as typeof import("../state/MemoryManager");
    const mem = memory.getMemory(playerId);
    return Object.keys(mem.known_roles).length > 0;
  } catch {
    return false;
  }
}

/** Check if an ally (same alignment) was accused or defended */
function wasAllyInvolved(
  playerId: string,
  events: ChatEvent[],
): boolean {
  const player = PlayerState.getPlayer(playerId);
  const allies = PlayerState.getPlayersByAlignment(player.alignment)
    .filter((p) => p.player_id !== playerId)
    .map((p) => p.player_id);

  return events.some(
    (e) =>
      (e.action === "accuse" || e.action === "defend") &&
      allies.includes(e.target),
  );
}

// ---------------------------------------------------------------------------
// Cooldown modifier
// ---------------------------------------------------------------------------

/**
 * Reduce speak chance if the player spoke recently.
 * Uses config-driven brackets:
 *   - Spoke in last 2 messages → 0.2 (very unlikely to speak again)
 *   - Spoke in last 5 messages → 0.6
 *   - Otherwise → 1.0 (no penalty)
 */
function getCooldownModifier(
  playerId: string,
  totalMessageCount: number,
): number {
  const cooldowns = aiConfig.cooldown_modifiers;
  const recentMessages = ChatState.getRecentMessages("public", totalMessageCount);

  // Find how many messages ago this player last spoke
  let messagesSinceLast = Infinity;
  for (let i = recentMessages.length - 1; i >= 0; i--) {
    if (recentMessages[i].sender_id === playerId) {
      messagesSinceLast = recentMessages.length - 1 - i;
      break;
    }
  }

  if (messagesSinceLast <= 2) {
    return cooldowns["last_2_messages"] ?? 0.2;
  }
  if (messagesSinceLast <= 5) {
    return cooldowns["last_5_messages"] ?? 0.6;
  }
  return cooldowns["otherwise"] ?? 1.0;
}

// TODO(REVIEW): Should emotional_reactivity affect trigger_modifier?
//               High reactivity → bigger boost when accused.
// TODO(LOW): Add time-based component — players who haven't spoken in
//            a while get a gradual probability boost.
