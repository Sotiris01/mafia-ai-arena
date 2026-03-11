// =============================================================================
// FILE: MessageGenerator.ts
// PURPOSE: AI message creation — 6 message types, uses AITextProvider
//          for actual text generation (template or LLM)
// LOCATION: src/ai/MessageGenerator.ts
// =============================================================================

// Decision Layer module that decides WHAT to say, then delegates to the
// Text Layer (AITextProvider) for HOW to say it.
//
// 6 message types (ActionType):
//   accuse, defend, agree, disagree, claim, deflect
//   (+ "question" as a 7th for neutral/filler)
//
// Collaborating files:
// - src/types/chat.types.ts              — Message, ActionType, ChatEvent
// - src/types/personality.types.ts       — persuasion_power, deception_skill
// - src/ai/PerceptionFilter.ts           — filters memory before message selection
// - src/ai/providers/AIProviderFactory.ts — get current AITextProvider
// - src/ai/providers/AITextProvider.ts    — generateMessage() interface
// - src/state/PlayerState.ts             — player data + personality
// - src/state/ChatState.ts               — recent events for context
// - src/state/GameState.ts               — current day
// - src/engine/AIEngine.ts               — calls generateMessage() after shouldSpeak()

import type { ActionType, ChatEvent, Message } from "../types/chat.types";
import type { PlayerPersonality } from "../types/personality.types";
import type { PlayerRole } from "../types/player.types";
import type { MessageContext } from "./providers/AITextProvider";
import type { FilteredMemory } from "./PerceptionFilter";
import { getFilteredMemory } from "./PerceptionFilter";
import { getProvider } from "./providers/AIProviderFactory";
import * as PlayerState from "../state/PlayerState";
import * as ChatState from "../state/ChatState";
import * as GameState from "../state/GameState";
import { randomElement, rollProbability } from "../utils/probability";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a complete Message for an AI player.
 * This is the main entry point called by AIEngine after shouldSpeak() = true.
 *
 * Flow:
 *   1. Filter memory through PerceptionFilter
 *   2. Select message type (accuse, defend, etc.)
 *   3. Select target player
 *   4. Determine intensity from personality + situation
 *   5. Build MessageContext and call AITextProvider.generateMessage()
 *   6. Return a full Message object ready for ChatState
 */
export async function generateMessage(playerId: string): Promise<Message> {
  const player = PlayerState.getPlayer(playerId);
  const personality = PlayerState.getPersonality(playerId);
  const filtered = getFilteredMemory(playerId);
  const day = GameState.getState().day;

  const messageType = selectMessageType(playerId, player, personality, filtered);
  const target = selectTarget(playerId, messageType, player, filtered);
  const intensity = getIntensity(personality, messageType, filtered);

  const targetName = target
    ? PlayerState.getPlayer(target).player_name
    : "";

  const context: MessageContext = {
    action: messageType,
    personality: personality.type,
    intensity,
    targetName,
    // TODO(Phase 6): Add roleName, reason, evidence for LLM prompts
  };

  const provider = getProvider();
  const text = await provider.generateMessage(context);

  const messageId = `msg_${Date.now()}_${playerId}`;

  return {
    id: messageId,
    sender_id: playerId,
    sender_name: player.player_name,
    text,
    timestamp: Date.now(),
    channel: "public",
    is_human: false,
  };
}

// ---------------------------------------------------------------------------
// Message type selection
// ---------------------------------------------------------------------------

/**
 * Choose what type of message the AI should produce based on:
 * - Whether they were accused (→ defend or deflect)
 * - Whether they have suspicions (→ accuse)
 * - Whether they agree with recent events (→ agree/disagree)
 * - Role-claim logic
 * - Personality tendencies
 */
export function selectMessageType(
  playerId: string,
  player: PlayerRole,
  personality: PlayerPersonality,
  filtered: FilteredMemory,
): ActionType {
  const day = GameState.getState().day;
  const recentEvents = ChatState.getEventsByDay(day);

  // Priority 1: If directly accused recently → defend or deflect
  if (wasRecentlyAccused(playerId, recentEvents)) {
    return shouldDefendSelf(personality)
      ? "defend"
      : "deflect";
  }

  // Priority 2: Mafia players — special logic to avoid accusing allies
  if (player.alignment === "Mafia") {
    return selectMafiaMessageType(playerId, player, personality, filtered, recentEvents);
  }

  // Priority 3: Should claim role?
  if (shouldClaimRole(playerId, player, personality, recentEvents)) {
    return "claim";
  }

  // Priority 4: Has strong suspicion → accuse
  const mostSuspicious = getMostSuspicious(filtered);
  if (mostSuspicious && mostSuspicious.suspicion > 0.5) {
    return "accuse";
  }

  // Priority 5: Recent accusation by someone → agree or disagree
  const recentAccusation = recentEvents.find((e) => e.action === "accuse");
  if (recentAccusation) {
    // Agree if the AI also suspects that target
    const targetRel = filtered.relationships[recentAccusation.target];
    if (targetRel && targetRel.suspicion > targetRel.trust) {
      return "agree";
    }
    if (targetRel && targetRel.trust > targetRel.suspicion) {
      return "disagree";
    }
  }

  // Default: question (neutral filler)
  return "question";
}

// ---------------------------------------------------------------------------
// Target selection
// ---------------------------------------------------------------------------

/**
 * Pick a target player for the chosen message type.
 * - accuse: most suspicious player
 * - defend: most trusted ally, or self
 * - agree/disagree: the target from the last relevant event
 * - deflect: random alive player
 * - claim/question: no target (empty string)
 */
export function selectTarget(
  playerId: string,
  messageType: ActionType,
  player: PlayerRole,
  filtered: FilteredMemory,
): string {
  const aliveIds = GameState.getState().alive_player_ids.filter(
    (id) => id !== playerId && id !== "human",
  );

  switch (messageType) {
    case "accuse": {
      const target = getMostSuspicious(filtered);
      // Mafia: never accuse allies
      if (target && player.alignment === "Mafia") {
        const targetPlayer = PlayerState.getPlayer(target.id);
        if (targetPlayer.alignment === "Mafia") {
          // Pick a Town player instead
          const townTargets = aliveIds.filter((id) => {
            const p = PlayerState.getPlayer(id);
            return p.alignment !== "Mafia";
          });
          return townTargets.length > 0 ? randomElement(townTargets) : "";
        }
      }

      // Diversity: 30% chance to pick a different suspect from the top-3
      // so different AIs don't all accuse the exact same player.
      if (target && rollProbability(0.3)) {
        const alternatives = aliveIds.filter((id) => id !== target.id);
        if (alternatives.length > 0) {
          return randomElement(alternatives);
        }
      }

      return target?.id ?? (aliveIds.length > 0 ? randomElement(aliveIds) : "");
    }

    case "defend": {
      // Defend self or most trusted ally
      const mostTrusted = getMostTrusted(filtered);
      return mostTrusted?.id ?? playerId;
    }

    case "agree":
    case "disagree": {
      // Target from the most recent accusation
      const day = GameState.getState().day;
      const events = ChatState.getEventsByDay(day);
      const recent = events.filter((e) => e.action === "accuse");
      if (recent.length > 0) {
        return recent[recent.length - 1].target;
      }
      return aliveIds.length > 0 ? randomElement(aliveIds) : "";
    }

    case "deflect": {
      return aliveIds.length > 0 ? randomElement(aliveIds) : "";
    }

    case "question": {
      // Pick a random alive player to ask about
      return aliveIds.length > 0 ? randomElement(aliveIds) : "";
    }

    case "claim": {
      // Claims are self-referential — no external target needed,
      // but provide a random player for template context
      return aliveIds.length > 0 ? randomElement(aliveIds) : "";
    }

    default:
      return aliveIds.length > 0 ? randomElement(aliveIds) : "";
  }
}

// ---------------------------------------------------------------------------
// Intensity
// ---------------------------------------------------------------------------

/**
 * Determine intensity (high/medium/low) based on personality and situation.
 * - High aggression + strong feelings → high
 * - Moderate aggression → medium
 * - Shy / low aggression → low
 */
export function getIntensity(
  personality: PlayerPersonality,
  messageType: ActionType,
  filtered: FilteredMemory,
): "high" | "medium" | "low" {
  // Defensive messages are higher intensity when contradictions exist
  if (
    (messageType === "defend" || messageType === "deflect") &&
    filtered.contradictions.length > 0
  ) {
    return "high";
  }

  // Use aggression stat as primary driver
  if (personality.aggression >= 0.7) return "high";
  if (personality.aggression >= 0.4) return "medium";
  return "low";
}

// ---------------------------------------------------------------------------
// Helper: Mafia-specific message type
// ---------------------------------------------------------------------------

function selectMafiaMessageType(
  playerId: string,
  player: PlayerRole,
  personality: PlayerPersonality,
  filtered: FilteredMemory,
  recentEvents: ChatEvent[],
): ActionType {
  // Mafia should accuse Town players to blend in
  const townTargets = GameState.getState().alive_player_ids.filter((id) => {
    if (id === playerId) return false;
    const p = PlayerState.getPlayer(id);
    return p.alignment === "Town";
  });

  // Godfather is more proactive — accuse early
  if (player.role === "Godfather" && townTargets.length > 0) {
    return rollProbability(0.5) ? "accuse" : "question";
  }

  // Other Mafia: blend in — agree with Town accusations against Town
  const townAccusations = recentEvents.filter(
    (e) => e.action === "accuse" && !isMafiaPlayer(e.speaker),
  );
  if (townAccusations.length > 0 && rollProbability(personality.deception_skill)) {
    return "agree";
  }

  // Default: question or deflect
  return rollProbability(0.5) ? "question" : "deflect";
}

function isMafiaPlayer(playerId: string): boolean {
  try {
    return PlayerState.getPlayer(playerId).alignment === "Mafia";
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Helper: accusation / defense checks
// ---------------------------------------------------------------------------

function wasRecentlyAccused(
  playerId: string,
  events: ChatEvent[],
): boolean {
  // Check last 5 events for accusations against this player
  const recent = events.slice(-5);
  return recent.some((e) => e.action === "accuse" && e.target === playerId);
}

function shouldDefendSelf(personality: PlayerPersonality): boolean {
  // High consistency → defend (stick to story)
  // High aggression → deflect (redirect)
  return personality.consistency >= personality.aggression;
}

/**
 * Should the AI claim a role?
 * - Investigative roles (Sheriff) claim when they have evidence
 * - Mayor claims when pressured
 * - Jester might fake-claim to draw attention
 */
function shouldClaimRole(
  playerId: string,
  player: PlayerRole,
  personality: PlayerPersonality,
  recentEvents: ChatEvent[],
): boolean {
  // Don't claim on day 1 (too early)
  const day = GameState.getState().day;
  if (day <= 1) return false;

  // Sheriff with evidence → claim with moderate probability
  if (player.role === "Sheriff") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const memory = require("../state/MemoryManager") as typeof import("../state/MemoryManager");
      const mem = memory.getMemory(playerId);
      if (Object.keys(mem.known_roles).length > 0) {
        return rollProbability(0.3 * personality.leadership);
      }
    } catch {
      // Memory not available
    }
    return false;
  }

  // Mayor under pressure → reveal
  if (
    player.role === "Mayor" &&
    !player.is_revealed_mayor &&
    wasRecentlyAccused(playerId, recentEvents)
  ) {
    return rollProbability(0.4);
  }

  // Jester wants attention → fake claim
  if (player.role === "Jester") {
    return rollProbability(0.2);
  }

  return false;
}

// ---------------------------------------------------------------------------
// Helper: relationship scoring
// ---------------------------------------------------------------------------

interface ScoredPlayer {
  id: string;
  suspicion: number;
  trust: number;
}

function getMostSuspicious(filtered: FilteredMemory): ScoredPlayer | null {
  let best: ScoredPlayer | null = null;
  for (const [id, rel] of Object.entries(filtered.relationships)) {
    const score: ScoredPlayer = { id, suspicion: rel.suspicion, trust: rel.trust };
    if (!best || score.suspicion > best.suspicion) {
      best = score;
    }
  }
  return best;
}

function getMostTrusted(filtered: FilteredMemory): ScoredPlayer | null {
  let best: ScoredPlayer | null = null;
  for (const [id, rel] of Object.entries(filtered.relationships)) {
    const score: ScoredPlayer = { id, suspicion: rel.suspicion, trust: rel.trust };
    if (!best || score.trust > best.trust) {
      best = score;
    }
  }
  return best;
}

// TODO(REVIEW): Mafia players need special logic — avoid accusing Mafia allies ✓ (done above)
// TODO(LOW): Add message memory — avoid repeating similar messages
//            Track last N messages per player and reject duplicates.
// TODO(Phase 6): Implement buildPromptContext for LLM-based providers
//                (include memory, relationships, game state in prompt).
