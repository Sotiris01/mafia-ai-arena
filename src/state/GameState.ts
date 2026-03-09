// =============================================================================
// FILE: GameState.ts
// PURPOSE: Manages game_state.json — phase, day number, balance, Full Moon,
//          zombie tracking, alive players, game-wide settings
// LOCATION: src/state/GameState.ts
// =============================================================================

// TODO(APPROACH): Singleton-style state manager that reads/writes game_state.json
// via AsyncStorage or Expo FileSystem. Every engine module reads from here.
// GameState is the central hub — it's updated by PhaseManager on transitions,
// by FullMoonEngine on activation, and by ResolutionEngine on deaths.
//
// State shape matches GameConfig + runtime fields:
//   - current_phase: Phase
//   - current_sub_phase: SubPhase
//   - day_number: number
//   - alive_players: string[]          — player_ids
//   - dead_players: string[]
//   - full_moon: FullMoonState
//   - zombie_players: string[]
//   - config: GameConfig               — loaded from src/data/config.json
//   - is_game_over: boolean
//   - win_result: WinResult | null
//
// Collaborating files:
// - src/types/game.types.ts           — Phase, SubPhase, FullMoonState, WinResult, GameConfig
// - src/data/config.json              — static config loaded on init
// - src/engine/PhaseManager.ts        — updates phase/sub_phase on transitions
// - src/engine/ResolutionEngine.ts    — updates alive/dead/zombie after night resolution
// - src/engine/FullMoonEngine.ts      — updates full_moon state
// - src/engine/WinChecker.ts          — reads alive_players, sets win_result
// - src/engine/BalanceCalculator.ts   — reads alive counts for balance_score
// - src/hooks/useGameLoop.ts          — subscribes to game state for UI updates

// TODO(HIGH): Implement init() — load config.json, create initial game state
// TODO(HIGH): Implement getState() — read current game_state.json
// TODO(HIGH): Implement updatePhase(phase, subPhase) — called by PhaseManager
// TODO: Implement markPlayerDead(playerId) — move from alive to dead
// TODO: Implement markPlayerZombie(playerId) — add to zombie_players
// TODO: Implement updateFullMoon(state) — update Full Moon tracking
// TODO: Implement setGameOver(result) — set is_game_over + win_result
// TODO: Implement reset() — clear state for new game

// TODO(LOW): Consider adding state change listeners for reactive UI updates
// TODO(REVIEW): AsyncStorage vs Expo FileSystem — decide persistence strategy
