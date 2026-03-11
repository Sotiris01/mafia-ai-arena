// =============================================================================
// FILE: event.types.ts
// PURPOSE: Event system types — NightEchoEvent, LastWish, FullMoon,
//          EventTiming, NightEchoEventId
// LOCATION: src/types/event.types.ts
// =============================================================================

import type { Role } from "./player.types";

export type EventTiming = "morning" | "midday";

export type NightEchoEventId =
  | "E01" | "E02" | "E03" | "E04" | "E05" | "E06" | "E07"
  | "E08" | "E09" | "E10" | "E11" | "E12" | "E13" | "E14";

export interface NightEchoEvent {
  id: NightEchoEventId;
  name: string;
  timing: EventTiming;
  probability: number | Record<string, number>;
  suspicion_weight: number;
  linked_roles: Role[];
  trigger_condition: string;
  description_template: string;
}

// --- Last Wish ---

export type LastWishActionType =
  | "reveal_evidence"
  | "force_public_vote"
  | "expose_alignment"
  | "curse";

/** Config entry from src/data/lastWishActions.json */
export interface LastWishActionConfig {
  type: LastWishActionType;
  weight: number;
  description: string;
  effect: string;
  target_selection: string;
}

/** Runtime Last Wish instance created when a lynch triggers it */
export interface LastWish {
  action: LastWishActionType;
  target_id?: string;
  day: number;
  lynched_player_id: string;
}

// --- Full Moon ---

export type FullMoonStage = 0 | 1 | 2;

// --- Event Queue ---

export interface PendingEvent {
  event: NightEchoEvent | LastWish;
  timing: EventTiming;
  night: number;
  delivered: boolean;
}

// --- Data file shapes ---

/** Top-level shape of src/data/nightEchoEvents.json */
export interface NightEchoEventsData {
  events: NightEchoEvent[];
}

/** Top-level shape of src/data/lastWishActions.json */
export interface LastWishData {
  trigger_probability: number;
  timing: string;
  actions: LastWishActionConfig[];
}
