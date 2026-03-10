// =============================================================================
// FILE: game.types.ts
// PURPOSE: Game state types — Phase, SubPhase, GameState, Vote, BalanceScore,
//          WinResult, GameConfig
// LOCATION: src/types/game.types.ts
// =============================================================================

import type { Alignment } from "./player.types";

export type Phase = "day" | "night";

export type SubPhase =
  | "morning_report"
  | "discussion"
  | "midday_events"
  | "trial"
  | "voting"
  | "lynch_resolution"
  | "mafia_chat"
  | "night_actions"
  | "night_resolution";

export interface Vote {
  voter_id: string;
  target_id: string;
  weight: number;
  day: number;
}

export interface BalanceScore {
  score: number;
  town_alive: number;
  mafia_alive: number;
  neutral_alive: number;
  total_alive: number;
  expected_ratio: number;
}

export interface FullMoonState {
  is_active: boolean;
  stage: 0 | 1 | 2;
  balance_score: number;
  activations_remaining: number;
  buffed_faction: Alignment | null;
}

export interface WinResult {
  winner: Alignment | "Jester" | "Executioner" | "Zombie";
  co_winners: string[];
  reason: string;
}

/** Bilingual text used across data JSONs (roles, events, templates, gossip) */
export interface LocalizedText {
  en: string;
  gr: string;
}

// --- GameConfig sub-interfaces (match src/data/config.json structure) ---

export interface TimerConfig {
  discussion_seconds: number;
  trial_seconds: number;
  voting_seconds: number;
  night_action_seconds: number;
  human_window_seconds: number;
  morning_report_seconds: number;
  midday_event_delay_min_seconds: number;
  midday_event_delay_max_seconds: number;
}

export interface DiscussionSizeConfig {
  min_players: number;
  max_players: number;
  min_messages: number;
  max_messages: number;
}

export interface PerceptionDepthFilter {
  weight_threshold: number;
  scope: string;
}

export interface AIConfig {
  speak_cooldown_messages: number;
  max_messages_per_discussion: Record<string, DiscussionSizeConfig>;
  indirect_weight_accuse: number;
  indirect_weight_defend: number;
  role_modifiers: Record<string, number>;
  cooldown_modifiers: Record<string, number>;
  trigger_modifiers: Record<string, number>;
  perception_depth_filters: Record<string, PerceptionDepthFilter>;
}

export interface ScalingConfig {
  core_min_players: number;
  important_min_players: number;
  advanced_min_players: number;
  expanded_min_players: number;
}

export interface GameConfig {
  total_players: { min: number; max: number };
  decay_factor: number;
  last_wish_probability: number;
  night_echo_max_per_night: number;
  full_moon_probability: number;
  full_moon_max_per_game: number;
  full_moon_min_night: number;
  balance_thresholds: { stage_1: number; stage_2: number };
  timers: TimerConfig;
  ai: AIConfig;
  scaling: ScalingConfig;
  win_check_order_after_lynch: string[];
  win_check_order_after_night: string[];
  night_resolution_order: Record<string, string>;
}

export interface GameState {
  phase: Phase;
  sub_phase: SubPhase;
  day: number;
  alive_player_ids: string[];
  dead_player_ids: string[];
  full_moon: FullMoonState;
  zombie_player_ids: string[];
  is_game_over: boolean;
  win_result: WinResult | null;
  // TODO: Extend with additional fields as needed in Phase 2 (src/state/GameState.ts)
}
