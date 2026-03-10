// =============================================================================
// FILE: GameState.ts
// PURPOSE: Manages game_state.json — phase, day number, balance, Full Moon,
//          zombie tracking, alive players, game-wide settings
// LOCATION: src/state/GameState.ts
// =============================================================================

import type {
  Phase,
  SubPhase,
  FullMoonState,
  WinResult,
  GameConfig,
  GameState as GameStateType,
} from "../types/game.types";
import type { Alignment } from "../types/player.types";
import configData from "../data/config.json";

// TODO: Add state change listeners for reactive UI updates (Phase 5 — useGameLoop)

const DEFAULT_FULL_MOON: FullMoonState = {
  is_active: false,
  stage: 0,
  balance_score: 0,
  activations_remaining: 3,
  buffed_faction: null,
};

function createInitialState(playerIds: string[]): GameStateType {
  return {
    phase: "day",
    sub_phase: "discussion",
    day: 1,
    alive_player_ids: [...playerIds],
    dead_player_ids: [],
    full_moon: { ...DEFAULT_FULL_MOON },
    zombie_player_ids: [],
    is_game_over: false,
    win_result: null,
  };
}

let state: GameStateType | null = null;
let config: GameConfig | null = null;

/** Load config.json and create initial game state */
export function init(playerIds: string[]): void {
  config = configData as unknown as GameConfig;
  state = createInitialState(playerIds);
}

/** Read current game state (throws if not initialized) */
export function getState(): GameStateType {
  if (!state) throw new Error("GameState not initialized — call init() first");
  return state;
}

/** Read loaded config (throws if not initialized) */
export function getConfig(): GameConfig {
  if (!config) throw new Error("GameState not initialized — call init() first");
  return config;
}

/** Called by PhaseManager on transitions */
export function updatePhase(phase: Phase, subPhase: SubPhase): void {
  const s = getState();
  s.phase = phase;
  s.sub_phase = subPhase;
}

/** Advance day counter (called at start of each new day) */
export function advanceDay(): void {
  getState().day += 1;
}

/** Move player from alive to dead list */
export function markPlayerDead(playerId: string): void {
  const s = getState();
  s.alive_player_ids = s.alive_player_ids.filter((id) => id !== playerId);
  if (!s.dead_player_ids.includes(playerId)) {
    s.dead_player_ids.push(playerId);
  }
}

/** Add player to zombie tracking list */
export function markPlayerZombie(playerId: string): void {
  const s = getState();
  if (!s.zombie_player_ids.includes(playerId)) {
    s.zombie_player_ids.push(playerId);
  }
}

/** Update Full Moon tracking state */
export function updateFullMoon(fullMoon: Partial<FullMoonState>): void {
  const s = getState();
  s.full_moon = { ...s.full_moon, ...fullMoon };
}

/** Set game over with win result */
export function setGameOver(result: WinResult): void {
  const s = getState();
  s.is_game_over = true;
  s.win_result = result;
}

/** Clear state for new game */
export function reset(): void {
  state = null;
  config = null;
}

/** Check if a specific player is alive */
export function isPlayerAlive(playerId: string): boolean {
  return getState().alive_player_ids.includes(playerId);
}

/** Get count of alive players by alignment (needs PlayerState in Phase 3) */
// TODO: Move alignment-aware counting to engine/BalanceCalculator.ts (Phase 3)
export function getAliveCount(): number {
  return getState().alive_player_ids.length;
}
