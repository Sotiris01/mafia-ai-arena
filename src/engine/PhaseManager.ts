// =============================================================================
// FILE: PhaseManager.ts
// PURPOSE: Day/Night/Morning transitions + sub-phase sequencing + timer control
// LOCATION: src/engine/PhaseManager.ts
// =============================================================================

// Manages the transition sequence:
//   Morning Report → Discussion → Mid-Day Events → Trial → Voting →
//   Lynch Resolution → Mafia Chat → Night Actions → Night Resolution → ↩
//
// After each lynch and night resolution, calls WinChecker to see if game ends.
// Reads timer values from config.json for phase durations.

import type { Phase, SubPhase, WinResult, TimerConfig } from "../types/game.types";
import * as GameState from "../state/GameState";
import * as PlayerState from "../state/PlayerState";
import * as MemoryManager from "../state/MemoryManager";
import { checkWinConditions } from "./WinChecker";

// ---------------------------------------------------------------------------
// Sub-phase sequences
// ---------------------------------------------------------------------------

/** Day sub-phase order — the full day cycle */
const DAY_SEQUENCE: SubPhase[] = [
  "morning_report",
  "discussion",
  "midday_events",
  "trial",
  "voting",
  "lynch_resolution",
];

/** Night sub-phase order */
const NIGHT_SEQUENCE: SubPhase[] = [
  "mafia_chat",
  "night_actions",
  "night_resolution",
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Advance to the next sub-phase in the current day/night sequence.
 * Returns the new SubPhase, or null if the game ended (win condition met).
 *
 * Handles automatic transitions:
 * - After lynch_resolution: check win → if no win, transition to night
 * - After night_resolution: check win → if no win, advance day + morning
 */
export function advanceSubPhase(): SubPhase | null {
  const state = GameState.getState();
  if (state.is_game_over) return null;

  const currentPhase = state.phase;
  const currentSubPhase = state.sub_phase;

  if (currentPhase === "day") {
    return advanceDaySubPhase(currentSubPhase);
  } else {
    return advanceNightSubPhase(currentSubPhase);
  }
}

/**
 * Transition from night to a new day.
 * Applies memory decay for all alive AI players.
 */
export function transitionToDay(): SubPhase {
  GameState.advanceDay();

  // Apply memory decay for all alive AI players
  const aliveIds = GameState.getState().alive_player_ids;
  for (const playerId of aliveIds) {
    if (playerId === "human") continue;
    try {
      MemoryManager.applyDayDecay(playerId);
    } catch {
      // Memory not initialized — skip
    }
  }

  GameState.updatePhase("day", "morning_report");
  return "morning_report";
}

/**
 * Transition from day to night.
 * Called after lynch_resolution (and win check passes).
 */
export function transitionToNight(): SubPhase {
  GameState.updatePhase("night", "mafia_chat");
  // TODO(Phase 5): Trigger NightEchoEngine.selectEvents() here
  return "mafia_chat";
}

/**
 * Get the timer duration in seconds for a given sub-phase.
 */
export function getTimerDuration(subPhase: SubPhase): number {
  const config = GameState.getConfig();
  const timers = config.timers as TimerConfig;

  switch (subPhase) {
    case "morning_report":
      return timers.morning_report_seconds;
    case "discussion":
      return timers.discussion_seconds;
    case "midday_events":
      return 0; // Auto-advance, delay handled by event engine
    case "trial":
      return timers.trial_seconds;
    case "voting":
      return timers.voting_seconds;
    case "lynch_resolution":
      return 0; // Auto-advance after resolution
    case "mafia_chat":
      return timers.discussion_seconds; // Reuse discussion timer
    case "night_actions":
      return timers.night_action_seconds;
    case "night_resolution":
      return 0; // Auto-advance after resolution
    default:
      return 30; // Fallback
  }
}

/**
 * Check if the current sub-phase requires human input before advancing.
 * Used by the game loop to decide whether to auto-advance or wait.
 */
export function isHumanActionRequired(subPhase: SubPhase): boolean {
  switch (subPhase) {
    case "discussion":
    case "voting":
    case "night_actions":
      return true;
    default:
      return false;
  }
}

/**
 * Get the current day number.
 */
export function getDayNumber(): number {
  return GameState.getState().day;
}

/**
 * Handle a lynch: mark the player dead and check win conditions.
 * Returns WinResult if the game ends, null otherwise.
 */
export function handleLynch(lynchedPlayerId: string): WinResult | null {
  GameState.markPlayerDead(lynchedPlayerId);
  PlayerState.updatePlayerStatus(lynchedPlayerId, { is_alive: false });

  const winResult = checkWinConditions("lynch", lynchedPlayerId);
  if (winResult) {
    GameState.setGameOver(winResult);
    return winResult;
  }

  return null;
}

// TODO(Phase 5): handleNightDeath(playerId) — mark dead + check win
// TODO(Phase 5): Full cycle with NightEcho, FullMoon, LastWish engines

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Advance within the day sub-phase sequence */
function advanceDaySubPhase(current: SubPhase): SubPhase | null {
  const idx = DAY_SEQUENCE.indexOf(current);

  // If lynch_resolution is done, check win then go to night
  if (current === "lynch_resolution") {
    // Win check already done via handleLynch — just transition to night
    return transitionToNight();
  }

  // Move to next day sub-phase
  if (idx >= 0 && idx < DAY_SEQUENCE.length - 1) {
    const next = DAY_SEQUENCE[idx + 1];
    GameState.updatePhase("day", next);
    return next;
  }

  // Shouldn't reach here — fallback to discussion
  GameState.updatePhase("day", "discussion");
  return "discussion";
}

/** Advance within the night sub-phase sequence */
function advanceNightSubPhase(current: SubPhase): SubPhase | null {
  const idx = NIGHT_SEQUENCE.indexOf(current);

  // After night_resolution, check win then go to next day
  if (current === "night_resolution") {
    const winResult = checkWinConditions("night");
    if (winResult) {
      GameState.setGameOver(winResult);
      return null;
    }

    return transitionToDay();
  }

  // Move to next night sub-phase
  if (idx >= 0 && idx < NIGHT_SEQUENCE.length - 1) {
    const next = NIGHT_SEQUENCE[idx + 1];
    GameState.updatePhase("night", next);
    return next;
  }

  // Fallback
  GameState.updatePhase("night", "night_actions");
  return "night_actions";
}
