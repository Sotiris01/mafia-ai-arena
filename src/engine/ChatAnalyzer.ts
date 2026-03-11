// =============================================================================
// FILE: ChatAnalyzer.ts
// PURPOSE: Semantic message analysis — converts raw chat text into
//          structured ChatEvent objects for chat_events.json
// LOCATION: src/engine/ChatAnalyzer.ts
// =============================================================================

// Analysis steps:
//   1. Receive raw message text + speaker_id
//   2. Classify action type (accuse/defend/agree/disagree/claim/question/deflect)
//   3. Identify target player_id
//   4. Assign weight based on statement intensity
//   5. Detect indirect targets (A defends B who accused C)
//   6. Detect role claims ("I'm the Sheriff")
//   7. Produce ChatEvent → send to ChatState
//
// For AI-generated messages, the action type is already known
// from MessageGenerator. For human messages, need keyword-based analysis.

import type {
  ActionType,
  ChatEvent,
  IndirectTarget,
  RoleClaim,
} from "../types/chat.types";
import type { Role } from "../types/player.types";
import * as PlayerState from "../state/PlayerState";
import * as ChatState from "../state/ChatState";
import * as MemoryManager from "../state/MemoryManager";
import * as GameState from "../state/GameState";

// ---------------------------------------------------------------------------
// Keyword maps
// ---------------------------------------------------------------------------

const ACTION_KEYWORDS: Record<ActionType, string[]> = {
  accuse: [
    "sus", "suspicious", "mafia", "guilty", "vote", "lynch",
    "kill", "eliminate",
  ],
  defend: [
    "innocent", "trust", "town", "clear", "safe", "vouch",
  ],
  agree: [
    "agree", "right", "exactly", "yes", "correct", "true",
  ],
  disagree: [
    "disagree", "wrong", "no", "incorrect", "nonsense",
  ],
  claim: [
    "i am", "i'm", "role", "claim", "reveal",
  ],
  question: [
    "why", "who", "what", "how", "explain", "?",
  ],
  deflect: [
    "instead", "what about", "focus on", "redirect", "look at",
  ],
};

const ROLE_KEYWORDS: Record<string, Role> = {
  sheriff: "Sheriff",
  doctor: "Doctor",
  lookout: "Lookout",
  gossip: "Gossip",
  bodyguard: "Bodyguard",
  tracker: "Tracker",
  mayor: "Mayor",
  citizen: "Citizen",
  godfather: "Godfather",
  jester: "Jester",
  survivor: "Survivor",
};

/** Weight per action type */
const ACTION_WEIGHTS: Record<ActionType, number> = {
  accuse: 1.0,
  defend: 0.8,
  agree: 0.4,
  disagree: 0.5,
  claim: 0.9,
  question: 0.3,
  deflect: 0.6,
};

// ---------------------------------------------------------------------------
// Message counter
// ---------------------------------------------------------------------------

let nextMessageId = 1;

export function resetMessageCounter(): void {
  nextMessageId = 1;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Analyze a human player's raw text and produce a ChatEvent.
 * The event is stored in ChatState and used to update AI memory.
 */
export function analyzeHumanMessage(
  text: string,
  speakerId: string,
): ChatEvent {
  const day = GameState.getState().day;
  const action = classifyAction(text);
  const targetId = identifyTarget(text);
  const weight = assignWeight(text, action);

  const event: ChatEvent = {
    message_id: nextMessageId++,
    speaker: speakerId,
    action,
    target: targetId,
    weight,
    day,
    raw_text: text,
    indirect_targets: detectIndirectTargets(speakerId, targetId, action),
    claim: detectRoleClaim(text, speakerId, day),
  };

  ChatState.addChatEvent(event);

  // Update AI memories with this human message
  updateAIMemories(event);

  return event;
}

/**
 * Analyze an AI-generated message where the action type and target
 * are already known from MessageGenerator. Builds the full ChatEvent.
 */
export function analyzeAIMessage(
  text: string,
  speakerId: string,
  action: ActionType,
  targetId: string,
): ChatEvent {
  const day = GameState.getState().day;
  const weight = assignWeight(text, action);

  const event: ChatEvent = {
    message_id: nextMessageId++,
    speaker: speakerId,
    action,
    target: targetId,
    weight,
    day,
    raw_text: text,
    indirect_targets: detectIndirectTargets(speakerId, targetId, action),
    claim: detectRoleClaim(text, speakerId, day),
  };

  ChatState.addChatEvent(event);

  // Update AI memories (all AI players observe this message)
  updateAIMemories(event);

  return event;
}

// ---------------------------------------------------------------------------
// Action classification
// ---------------------------------------------------------------------------

/** Classify raw text into an ActionType via keyword matching */
export function classifyAction(text: string): ActionType {
  const lower = text.toLowerCase();

  let bestAction: ActionType = "question";
  let bestCount = 0;

  for (const [action, keywords] of Object.entries(ACTION_KEYWORDS)) {
    const count = keywords.filter((kw) => lower.includes(kw)).length;
    if (count > bestCount) {
      bestCount = count;
      bestAction = action as ActionType;
    }
  }

  return bestAction;
}

// ---------------------------------------------------------------------------
// Target identification
// ---------------------------------------------------------------------------

/** Find a target player_id by matching player names in the text */
export function identifyTarget(text: string): string {
  const lower = text.toLowerCase();
  const alivePlayers = PlayerState.getAllAlivePlayers();

  for (const player of alivePlayers) {
    if (lower.includes(player.player_name.toLowerCase())) {
      return player.player_id;
    }
  }

  // TODO(Phase 6): Use AI provider's analyzeMessage for better target matching
  return "";
}

// ---------------------------------------------------------------------------
// Weight assignment
// ---------------------------------------------------------------------------

/** Assign a weight based on action type and text intensity cues */
export function assignWeight(text: string, action: ActionType): number {
  let weight = ACTION_WEIGHTS[action];

  const lower = text.toLowerCase();

  // Intensity boost: exclamation marks, caps, strong words
  if (text.includes("!")) weight *= 1.2;
  if (text === text.toUpperCase() && text.length > 3) weight *= 1.3;
  if (lower.includes("definitely")) weight *= 1.1;
  if (lower.includes("maybe")) weight *= 0.7;

  // Clamp to [0.1, 1.5]
  return Math.min(Math.max(weight, 0.1), 1.5);
}

// ---------------------------------------------------------------------------
// Indirect target detection
// ---------------------------------------------------------------------------

/**
 * Detect indirect relationships:
 * If A defends B, and B recently accused C, then A indirectly accuses C.
 * If A accuses B, and B defended C, then A indirectly accuses C.
 */
export function detectIndirectTargets(
  speakerId: string,
  targetId: string,
  action: ActionType,
): IndirectTarget[] {
  if (!targetId) return [];

  const day = GameState.getState().day;
  const dayEvents = ChatState.getEventsByDay(day);
  const indirects: IndirectTarget[] = [];

  // Only accuse and defend produce indirect effects
  if (action !== "accuse" && action !== "defend") return [];

  for (const event of dayEvents) {
    if (event.speaker !== targetId) continue;

    // A accuses B who defended C → A indirectly accuses C
    if (action === "accuse" && event.action === "defend" && event.target) {
      indirects.push({
        player_id: event.target,
        relationship: "indirect_accuse",
        weight_modifier: 0.4,
      });
    }

    // A defends B who accused C → A indirectly defends C's accuser (B)
    // Actually: A defends B who accused C → A indirectly defends the accused (C is getting attacked)
    // More accurately: defending an accuser implies agreeing with attack
    if (action === "defend" && event.action === "accuse" && event.target) {
      indirects.push({
        player_id: event.target,
        relationship: "indirect_accuse",
        weight_modifier: 0.3,
      });
    }
  }

  return indirects;
}

// ---------------------------------------------------------------------------
// Role claim detection
// ---------------------------------------------------------------------------

/** Detect if the text contains a role claim */
export function detectRoleClaim(
  text: string,
  speakerId: string,
  day: number,
): RoleClaim | undefined {
  const lower = text.toLowerCase();

  for (const [keyword, role] of Object.entries(ROLE_KEYWORDS)) {
    if (lower.includes(keyword)) {
      // Check for claim patterns: "I am the Sheriff", "I'm Doctor"
      const claimPatterns = [
        `i am ${keyword}`,
        `i'm ${keyword}`,
        `i am the ${keyword}`,
        `i'm the ${keyword}`,
        `i am a ${keyword}`,
        `claim ${keyword}`,
      ];

      if (claimPatterns.some((p) => lower.includes(p))) {
        return {
          claimed_role: role,
          day_claimed: day,
          believed_by: [],
        };
      }
    }
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// Memory update helper
// ---------------------------------------------------------------------------

/**
 * After a ChatEvent is created, update all alive AI players' memories
 * with the new event so they can react to it.
 */
function updateAIMemories(event: ChatEvent): void {
  const aliveIds = GameState.getState().alive_player_ids;

  for (const playerId of aliveIds) {
    // Skip human and the speaker (speaker doesn't update own memory from own message)
    if (playerId === "human" || playerId === event.speaker) continue;

    try {
      MemoryManager.updateRelationships(playerId, [event]);
    } catch {
      // Memory not initialized for this player — skip
    }
  }
}
