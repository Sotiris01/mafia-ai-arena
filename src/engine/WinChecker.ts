// =============================================================================
// FILE: WinChecker.ts
// PURPOSE: Win condition checks — 6 conditions in priority order
// LOCATION: src/engine/WinChecker.ts
// =============================================================================

// TODO(APPROACH): Checks win conditions after every lynch and night resolution.
// Priority order (checked top to bottom, first match wins):
//   1. Jester win     — Jester was lynched (immediate)
//   2. Executioner win — Executioner's target was lynched
//   3. Town win        — All Mafia dead (Mafia-aligned count = 0)
//   4. Mafia win       — Mafia ≥ Town alive (Mafia count ≥ Town + Neutral)
//   5. Zombie win      — All alive players are zombies (no living non-zombies)
//   6. Survivor co-win — Survivor is alive when any other win triggers → co-winner
//
// Neutral counting: Jester, Survivor, Executioner, Zombie count as "Town"
// for Mafia-vs-Town balance (they're not Mafia-aligned).
//
// Collaborating files:
// - src/types/game.types.ts           — WinResult interface
// - src/types/player.types.ts         — PlayerRole, Alignment
// - src/state/GameState.ts            — reads alive_players, sets game_over
// - src/state/PlayerState.ts          — reads player alignments + zombie status
// - src/engine/PhaseManager.ts        — calls checkWinConditions() after events
// - src/engine/ResolutionEngine.ts    — calls after night resolution
// - app/game/result.tsx               — displays WinResult on game over screen
// - src/hooks/useGameLoop.ts          — handles game end transition

// TODO(HIGH): Implement checkWinConditions() — returns WinResult | null
// TODO(HIGH): Implement checkJesterWin(lynchedPlayerId) — was Jester lynched?
// TODO(HIGH): Implement checkExecutionerWin(lynchedPlayerId) — was Executioner's target lynched?
// TODO(HIGH): Implement checkTownWin() — all Mafia dead?
// TODO(HIGH): Implement checkMafiaWin() — Mafia ≥ Town+Neutral alive?
// TODO: Implement checkZombieWin() — all alive players are zombies?
// TODO: Implement getSurvivorCoWinners() — alive Survivor player_ids
// TODO: Implement countByAlignment() — helper to count alive players per faction

// TODO(REVIEW): Edge case: Jester lynched + Mafia would also win same turn → Jester wins
// TODO(REVIEW): Edge case: Executioner target lynched + Town would win → Executioner wins
