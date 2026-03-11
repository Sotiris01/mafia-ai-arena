// =============================================================================
// FILE: PerceptionFilter.ts
// PURPOSE: 3-level perception filter — Superficial/Smart/Deep
//          Controls what information an AI can access from memory
// LOCATION: src/ai/PerceptionFilter.ts
// =============================================================================

// Filters memory data based on PerceptionDepth (1/2/3).
// Not all AI players "see" the same things — smarter personalities
// detect more complex relationship patterns.
//
// Level 1 — Superficial (Aggressive, Shy):
//   - Direct relationships only (trust, suspicion from direct interactions)
//   - No indirect relationship detection
//   - Takes claims at face value
//   - Simple memory: who accused whom, who defended whom
//
// Level 2 — Smart (Cautious, Charismatic, Logical):
//   - Direct + indirect relationships (A defends B who accused C)
//   - Detects contradictions in claims
//   - Tracks voting patterns for consistency
//   - Can identify suspicious behavior patterns
//
// Level 3 — Deep (Paranoid):
//   - Full deduction chain analysis
//   - Cross-references claims with night results
//   - Detects orchestrated voting (Mafia coordination)
//   - Connects Night Echo events to player behavior
//   - Higher false-positive rate (sees patterns that don't exist)
//
// Collaborating files:
// - src/types/personality.types.ts    — PerceptionDepth (1/2/3)
// - src/types/memory.types.ts         — PlayerMemory, Relationship
// - src/types/chat.types.ts           — ChatEvent, IndirectTarget
// - src/state/MemoryManager.ts        — source memory data to filter
// - src/state/ChatState.ts            — chat history for pattern detection
// - src/ai/VoteDecision.ts            — calls getFilteredMemory(playerId)
// - src/ai/MessageGenerator.ts        — calls to determine AI awareness
// - src/ai/SpeakProbability.ts        — trigger detection depends on perception
// - src/engine/AIEngine.ts            — applies filter before any AI decision

import type { PerceptionDepth } from "../types/personality.types";
import type {
  PlayerMemory,
  Relationship,
  InteractionRecord,
} from "../types/memory.types";
import type { ChatEvent } from "../types/chat.types";
import * as MemoryManager from "../state/MemoryManager";
import * as PlayerState from "../state/PlayerState";
import * as ChatState from "../state/ChatState";
import * as GameState from "../state/GameState";
import configData from "../data/config.json";
import type { AIConfig, PerceptionDepthFilter } from "../types/game.types";

const aiConfig = (configData as Record<string, unknown>).ai as AIConfig;

// ---------------------------------------------------------------------------
// Filtered memory — a snapshot of what a player "perceives"
// ---------------------------------------------------------------------------

export interface FilteredMemory {
  /** Player's own id */
  playerId: string;
  /** Relationships this player is aware of (filtered by depth) */
  relationships: Record<string, Relationship>;
  /** Known roles this player has discovered or heard about */
  knownRoles: PlayerMemory["known_roles"];
  /** Recent chat events visible to this player */
  recentEvents: ChatEvent[];
  /** Contradictions detected (Level 2+) */
  contradictions: Contradiction[];
  /** Coordinated voting patterns detected (Level 3) */
  coordinatedVoters: string[][];
}

export interface Contradiction {
  playerId: string;
  description: string;
  day: number;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return a filtered view of a player's memory, limited by their
 * PerceptionDepth. Higher depth = more insight.
 */
export function getFilteredMemory(playerId: string): FilteredMemory {
  const personality = PlayerState.getPersonality(playerId);
  const depth = personality.perception_depth;
  const memory = MemoryManager.getMemory(playerId);
  const day = GameState.getState().day;

  const depthConfig = getDepthConfig(depth);

  // Start with base filtered memory
  const filtered: FilteredMemory = {
    playerId,
    relationships: filterRelationships(memory, depth, depthConfig, day),
    knownRoles: filterKnownRoles(memory, depth),
    recentEvents: filterEvents(depth, day),
    contradictions: [],
    coordinatedVoters: [],
  };

  // Level 2+: detect contradictions in claims vs behavior
  if (depth >= 2) {
    filtered.contradictions = detectContradictions(playerId, day);
  }

  // Level 3: detect coordinated voting patterns
  // TODO(Phase 5): Implement detectCoordination using VoteRecord data
  //                once voting history is populated by the vote flow.

  return filtered;
}

// ---------------------------------------------------------------------------
// Relationship filtering
// ---------------------------------------------------------------------------

function filterRelationships(
  memory: PlayerMemory,
  depth: PerceptionDepth,
  depthConfig: PerceptionDepthFilter,
  currentDay: number,
): Record<string, Relationship> {
  const result: Record<string, Relationship> = {};

  for (const [targetId, rel] of Object.entries(memory.relationships)) {
    // Level 1: current day only, high-weight interactions
    if (depth === 1) {
      const filtered = filterHistoryByDay(rel, currentDay, depthConfig.weight_threshold);
      if (filtered.interaction_count > 0) {
        result[targetId] = filtered;
      }
    }
    // Level 2: all days with decay applied, moderate threshold
    else if (depth === 2) {
      const filtered = filterHistoryByWeight(rel, depthConfig.weight_threshold);
      if (filtered.interaction_count > 0) {
        result[targetId] = filtered;
      }
    }
    // Level 3: full memory — all interactions + indirect
    else {
      result[targetId] = { ...rel, history: [...rel.history] };
    }
  }

  return result;
}

/** Level 1: only keep interactions from the current day above threshold */
function filterHistoryByDay(
  rel: Relationship,
  currentDay: number,
  threshold: number,
): Relationship {
  const filtered = rel.history.filter(
    (r) => r.day === currentDay && Math.abs(r.weight) >= threshold && r.source === "direct",
  );
  return rebuildRelationship(filtered, rel.last_interaction_day);
}

/** Level 2: keep all interactions above threshold (any day, direct only) */
function filterHistoryByWeight(
  rel: Relationship,
  threshold: number,
): Relationship {
  const filtered = rel.history.filter(
    (r) => Math.abs(r.weight) >= threshold,
  );
  return rebuildRelationship(filtered, rel.last_interaction_day);
}

/** Reconstruct trust/suspicion from a filtered set of interaction records */
function rebuildRelationship(
  history: InteractionRecord[],
  lastDay: number,
): Relationship {
  let trust = 0;
  let suspicion = 0;
  for (const record of history) {
    if (record.action === "accuse" || record.action === "disagree") {
      suspicion += record.weight;
    } else if (record.action === "defend" || record.action === "agree") {
      trust += record.weight;
    }
  }
  return {
    trust,
    suspicion,
    interaction_count: history.length,
    last_interaction_day: lastDay,
    history,
  };
}

// ---------------------------------------------------------------------------
// Known roles filtering
// ---------------------------------------------------------------------------

function filterKnownRoles(
  memory: PlayerMemory,
  depth: PerceptionDepth,
): PlayerMemory["known_roles"] {
  if (depth === 1) {
    // Level 1: only investigation results (hard evidence)
    const result: PlayerMemory["known_roles"] = {};
    for (const [id, known] of Object.entries(memory.known_roles)) {
      if (known.source === "investigation" || known.source === "consigliere") {
        result[id] = known;
      }
    }
    return result;
  }
  // Level 2+: all known roles including claims and deductions
  return { ...memory.known_roles };
}

// ---------------------------------------------------------------------------
// Event filtering
// ---------------------------------------------------------------------------

function filterEvents(
  depth: PerceptionDepth,
  currentDay: number,
): ChatEvent[] {
  if (depth === 1) {
    // Level 1: only current day events
    return ChatState.getEventsByDay(currentDay);
  }
  if (depth === 2) {
    // Level 2: last 2 days of events
    return [
      ...ChatState.getEventsByDay(currentDay - 1),
      ...ChatState.getEventsByDay(currentDay),
    ];
  }
  // Level 3: all events
  return ChatState.getAllEvents();
}

// ---------------------------------------------------------------------------
// Contradiction detection (Level 2+)
// ---------------------------------------------------------------------------

/**
 * Detect contradictions between role claims and observed behavior.
 * E.g., a player claims Sheriff but has never shared investigation results.
 * TODO(Phase 5): Expand with night result cross-referencing once
 *                ResolutionEngine populates night results.
 */
function detectContradictions(
  playerId: string,
  currentDay: number,
): Contradiction[] {
  const contradictions: Contradiction[] = [];
  const memory = MemoryManager.getMemory(playerId);
  const allEvents = ChatState.getEventsByDay(currentDay);

  // Check: player claimed a role but their actions contradict it
  for (const [targetId, known] of Object.entries(memory.known_roles)) {
    if (known.source !== "claim") continue;

    // Town role claim but frequently defending Mafia suspects
    const targetEvents = allEvents.filter((e) => e.speaker === targetId);
    const defenseOfAccused = targetEvents.filter(
      (e) => e.action === "defend" && isAccused(e.target, allEvents),
    );

    if (defenseOfAccused.length >= 2) {
      contradictions.push({
        playerId: targetId,
        description: `Claims ${known.role} but repeatedly defends accused players`,
        day: currentDay,
      });
    }
  }

  return contradictions;
}

/** Check if a player has been accused in the given events */
function isAccused(targetId: string, events: ChatEvent[]): boolean {
  return events.some((e) => e.action === "accuse" && e.target === targetId);
}

// ---------------------------------------------------------------------------
// Config helper
// ---------------------------------------------------------------------------

function getDepthConfig(depth: PerceptionDepth): PerceptionDepthFilter {
  const key = `level_${depth}` as keyof typeof aiConfig.perception_depth_filters;
  return aiConfig.perception_depth_filters[key];
}

// TODO(REVIEW): Level 3 false positives — Paranoid players should sometimes
//               see patterns that don't exist. Consider adding a random
//               "phantom contradiction" with ~15% probability.
// TODO(LOW): Consider dynamic perception level changes based on game events
//            (e.g., Full Moon might temporarily boost perception).
