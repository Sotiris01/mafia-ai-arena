// =============================================================================
// FILE: memory.types.ts
// PURPOSE: Memory system types — PlayerMemory, Relationship, KnownRole,
//          EventWitnessed, NightResult, VoteRecord, GossipHint
// LOCATION: src/types/memory.types.ts
// =============================================================================

import type { ActionType } from "./chat.types";
import type { Role, NightActionType } from "./player.types";
import type { NightEchoEventId, EventTiming } from "./event.types";

export interface InteractionRecord {
  day: number;
  action: ActionType;
  weight: number;
  source: "direct" | "indirect";
}

// Weights decay over time (r=0.85 per day via weightCalculator)
export interface Relationship {
  trust: number;
  suspicion: number;
  interaction_count: number;
  last_interaction_day: number;
  history: InteractionRecord[];
}

export interface KnownRole {
  role: Role;
  confidence: number;
  source: "investigation" | "claim" | "deduction" | "consigliere" | "janitor";
}

export interface NightResult {
  night: number;
  action_performed: NightActionType;
  target_id: string;
  result: string;
}

export interface EventWitnessed {
  day: number;
  type: NightEchoEventId | "last_wish" | "full_moon";
  target?: string;
  timing: EventTiming;
  suspicion_weight: number;
}

export interface VoteRecord {
  day: number;
  voted_for: string;
  lynch_result: string;
}

export interface GossipHint {
  day: number;
  hint_text: string;
  target_id: string;
  confidence: number;
}

// Zombie victims have frozen memory (no updates)
export interface PlayerMemory {
  player_id: string;
  current_day: number;
  relationships: Record<string, Relationship>;
  known_roles: Record<string, KnownRole>;
  night_results: NightResult[];
  gossip_hints: GossipHint[];
  events_witnessed: EventWitnessed[];
  voting_history: VoteRecord[];
  is_zombie: boolean;
  zombie_since_day?: number;
  memory_state: "active" | "frozen";
}
