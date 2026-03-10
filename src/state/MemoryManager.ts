// =============================================================================
// FILE: MemoryManager.ts
// PURPOSE: Per-AI-player memory — relationships, known roles, events, voting
// LOCATION: src/state/MemoryManager.ts
// =============================================================================

import type {
  PlayerMemory,
  Relationship,
  KnownRole,
  NightResult,
  EventWitnessed,
  VoteRecord,
  GossipHint,
  InteractionRecord,
} from "../types/memory.types";
import type { ChatEvent } from "../types/chat.types";
import {
  applyDecay,
  calculateDirectWeight,
  calculateIndirectWeight,
  combineScore,
} from "../utils/weightCalculator";
import configData from "../data/config.json";

// TODO: Add memory pruning for very old records (performance, Phase 4)
// TODO: Decide if decay should apply to known_roles with confidence < 1.0

// ---------------------------------------------------------------------------
// Internal store
// ---------------------------------------------------------------------------

let memories: Map<string, PlayerMemory> = new Map();

const DECAY_FACTOR: number = (configData as Record<string, unknown>).decay_factor as number; // 0.70

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createEmptyRelationship(): Relationship {
  return {
    trust: 0,
    suspicion: 0,
    interaction_count: 0,
    last_interaction_day: 0,
    history: [],
  };
}

function ensureRelationship(
  mem: PlayerMemory,
  targetId: string,
): Relationship {
  if (!mem.relationships[targetId]) {
    mem.relationships[targetId] = createEmptyRelationship();
  }
  return mem.relationships[targetId];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Create empty PlayerMemory for a player */
export function initMemory(playerId: string, allPlayerIds: string[]): void {
  const mem: PlayerMemory = {
    player_id: playerId,
    current_day: 1,
    relationships: {},
    known_roles: {},
    night_results: [],
    gossip_hints: [],
    events_witnessed: [],
    voting_history: [],
    is_zombie: false,
    memory_state: "active",
  };

  // Pre-create relationship slots for all other players
  for (const id of allPlayerIds) {
    if (id !== playerId) {
      mem.relationships[id] = createEmptyRelationship();
    }
  }

  memories.set(playerId, mem);
}

/** Read a player's memory (throws if not initialized) */
export function getMemory(playerId: string): PlayerMemory {
  const m = memories.get(playerId);
  if (!m) throw new Error(`Memory not found for player: ${playerId}`);
  return m;
}

/** Process a batch of ChatEvents into relationship weights for a player */
export function updateRelationships(
  playerId: string,
  events: ChatEvent[],
): void {
  const mem = getMemory(playerId);
  if (mem.memory_state === "frozen") return;

  for (const event of events) {
    // Skip events by this player (they don't update their own relationships)
    if (event.speaker === playerId) continue;

    // Direct interaction: speaker → target
    if (event.target === playerId || event.speaker !== playerId) {
      const rel = ensureRelationship(mem, event.speaker);
      const directW = calculateDirectWeight(event.weight);

      const record: InteractionRecord = {
        day: event.day,
        action: event.action,
        weight: directW,
        source: "direct",
      };

      if (event.action === "accuse" || event.action === "disagree") {
        rel.suspicion += directW;
      } else if (event.action === "defend" || event.action === "agree") {
        rel.trust += directW;
      }

      rel.interaction_count += 1;
      rel.last_interaction_day = event.day;
      rel.history.push(record);
    }

    // Indirect interactions
    for (const indirect of event.indirect_targets) {
      if (indirect.player_id === playerId) continue;
      const rel = ensureRelationship(mem, indirect.player_id);
      const indirectW = calculateIndirectWeight(
        event.weight,
        indirect.weight_modifier,
      );

      const record: InteractionRecord = {
        day: event.day,
        action: event.action,
        weight: indirectW,
        source: "indirect",
      };

      if (indirect.relationship === "indirect_accuse") {
        rel.suspicion += indirectW;
      } else {
        rel.trust += indirectW;
      }

      rel.interaction_count += 1;
      rel.last_interaction_day = event.day;
      rel.history.push(record);
    }
  }

  mem.current_day = events.length > 0 ? events[events.length - 1].day : mem.current_day;
}

/** Apply time decay to all relationship weights (called on day transition) */
export function applyDayDecay(playerId: string): void {
  const mem = getMemory(playerId);
  if (mem.memory_state === "frozen") return;

  for (const rel of Object.values(mem.relationships)) {
    rel.trust = applyDecay(rel.trust, DECAY_FACTOR);
    rel.suspicion = applyDecay(rel.suspicion, DECAY_FACTOR);
  }

  mem.current_day += 1;
}

/** Store an investigation or action result from the night phase */
export function addNightResult(playerId: string, result: NightResult): void {
  const mem = getMemory(playerId);
  if (mem.memory_state === "frozen") return;
  mem.night_results.push(result);
}

/** Store a confirmed or suspected role for a target */
export function addKnownRole(
  playerId: string,
  targetId: string,
  knownRole: KnownRole,
): void {
  const mem = getMemory(playerId);
  if (mem.memory_state === "frozen") return;
  mem.known_roles[targetId] = knownRole;
}

/** Store a witnessed event (Night Echo / Last Wish / Full Moon) */
export function addEventWitnessed(
  playerId: string,
  event: EventWitnessed,
): void {
  const mem = getMemory(playerId);
  if (mem.memory_state === "frozen") return;
  mem.events_witnessed.push(event);
}

/** Store a voting record */
export function addVoteRecord(playerId: string, vote: VoteRecord): void {
  const mem = getMemory(playerId);
  if (mem.memory_state === "frozen") return;
  mem.voting_history.push(vote);
}

/** Store a gossip hint */
export function addGossipHint(playerId: string, hint: GossipHint): void {
  const mem = getMemory(playerId);
  if (mem.memory_state === "frozen") return;
  mem.gossip_hints.push(hint);
}

/** Freeze memory for zombie victims — no further updates */
export function freezeMemory(playerId: string, day: number): void {
  const mem = getMemory(playerId);
  mem.is_zombie = true;
  mem.zombie_since_day = day;
  mem.memory_state = "frozen";
}

/** Get combined trust + suspicion score for a target */
export function getRelationshipScore(
  playerId: string,
  targetId: string,
): number {
  const mem = getMemory(playerId);
  const rel = mem.relationships[targetId];
  if (!rel) return 0;
  return combineScore(rel.trust, rel.suspicion);
}

/** Clear all memory data for new game */
export function reset(): void {
  memories.clear();
}
