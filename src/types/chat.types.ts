// =============================================================================
// FILE: chat.types.ts
// PURPOSE: Chat system types — ChatEvent, Message, ActionType,
//          IndirectTarget, RoleClaim
// LOCATION: src/types/chat.types.ts
// =============================================================================

import type { Role } from "./player.types";

export type ActionType =
  | "accuse"
  | "defend"
  | "agree"
  | "disagree"
  | "claim"
  | "question"
  | "deflect";

export type Channel = "public" | "mafia";

export interface IndirectTarget {
  player_id: string;
  relationship: "indirect_accuse" | "indirect_defend";
  weight_modifier: number;
}

export interface RoleClaim {
  claimed_role: Role;
  day_claimed: number;
  believed_by: string[];
}

export interface ChatEvent {
  message_id: number;
  speaker: string;
  action: ActionType;
  target: string;
  weight: number;
  day: number;
  raw_text: string;
  indirect_targets: IndirectTarget[];
  claim?: RoleClaim;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  timestamp: number;
  channel: Channel;
  is_human: boolean;
}
