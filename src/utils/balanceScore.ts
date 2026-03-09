// =============================================================================
// FILE: balanceScore.ts
// PURPOSE: Balance score calculation helpers for Full Moon staging
// LOCATION: src/utils/balanceScore.ts
// =============================================================================

// TODO(APPROACH): Lower-level math helpers for balance calculation.
// The main formula lives in BalanceCalculator.ts (engine), but these
// helpers handle the math primitives.
//
// Formula:
//   balance_score = (town_alive / total_alive) - expected_ratio
//   where town_alive = Town + Neutral aligned players
//
// Stage mapping:
//   |score| < 0.05  → Stage 0 (balanced)
//   |score| ≥ 0.05  → Stage 1 (info buff)
//   |score| ≥ 0.15  → Stage 2 (full buff)
//
// Collaborating files:
// - src/engine/BalanceCalculator.ts   — consumes these helpers
// - src/engine/FullMoonEngine.ts      — reads stage from balance score
// - src/data/fullMoonConfig.json      — thresholds (0.05, 0.15)
// - src/types/game.types.ts           — BalanceScore interface

// TODO(HIGH): Implement calculateRatio(townAlive, totalAlive) — number
// TODO: Implement getImbalance(ratio, expectedRatio) — absolute difference
// TODO: Implement mapToStage(imbalance, thresholds) — return 0, 1, or 2
// TODO: Implement getLosingFaction(score) — "Town" or "Mafia" based on sign

// TODO(LOW): Add balance history tracking for trend analysis
