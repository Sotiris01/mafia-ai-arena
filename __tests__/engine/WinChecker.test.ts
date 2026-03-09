// =============================================================================
// FILE: WinChecker.test.ts
// PURPOSE: Tests for 6 win conditions in priority order
// LOCATION: __tests__/engine/WinChecker.test.ts
// =============================================================================

// TODO(APPROACH): Test all 6 win conditions in priority:
//   1. Jester — lynched by town → wins immediately
//   2. Executioner — target lynched → wins immediately
//   3. Town — all Mafia eliminated + no Zombie majority
//   4. Mafia — Mafia ≥ Town alive
//   5. Zombie — Zombies ≥ remaining alive
//   6. Survivor — survived to end → wins with any faction
//
// Collaborating files:
// - src/engine/WinChecker.ts           — module under test
// - src/types/game.types.ts            — WinResult
// - src/state/PlayerState.ts           — player alive/dead status
// - src/state/GameState.ts             — game state

// TODO: describe("WinChecker")
// TODO: Test Jester win — lynched → immediate win
// TODO: Test Executioner win — target lynched → immediate win
// TODO: Test Town win — all Mafia dead, Zombies < majority
// TODO: Test Mafia win — Mafia ≥ Town alive
// TODO: Test Zombie win — Zombies ≥ remaining
// TODO: Test Survivor win — survives to end with any faction
// TODO: Test priority — Jester win overrides Town win
// TODO: Test no win — game continues
// TODO(LOW): Test Lovers death link causing cascade win change
