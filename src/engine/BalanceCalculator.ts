// =============================================================================
// FILE: BalanceCalculator.ts
// PURPOSE: Balance score calculation for Full Moon staging
//          balance_score = (town_alive / total_alive) - expected_ratio
// LOCATION: src/engine/BalanceCalculator.ts
// =============================================================================

// TODO(APPROACH): Pure calculation module. Computes balance_score that
// determines Full Moon staging. Neutral roles (Survivor, Jester,
// Executioner, Zombie) count as "non-Mafia" for balance purposes.
//
// Formula:
//   town_count = alive Town + alive Neutral
//   mafia_count = alive Mafia
//   total = town_count + mafia_count
//   expected_ratio = config.expected_town_ratio (default 0.6)
//   balance_score = (town_count / total) - expected_ratio
//
// Interpretation:
//   Positive score → Town is winning (buff Mafia)
//   Negative score → Mafia is winning (buff Town)
//   |score| < 0.05 → balanced (Stage 0)
//   |score| ≥ 0.05 → imbalanced (Stage 1)
//   |score| ≥ 0.15 → heavily imbalanced (Stage 2)
//
// Collaborating files:
// - src/types/game.types.ts           — BalanceScore interface
// - src/types/player.types.ts         — Alignment for faction counting
// - src/state/GameState.ts            — reads alive_players
// - src/state/PlayerState.ts          — reads player alignments
// - src/engine/FullMoonEngine.ts      — consumes balance_score for stage determination
// - src/data/fullMoonConfig.json      — thresholds (stage_1: 0.05, stage_2: 0.15)
// - src/data/config.json              — expected_town_ratio
// - src/utils/balanceScore.ts         — lower-level math helpers

// TODO(HIGH): Implement calculateBalance() — return BalanceScore
// TODO: Implement countByFaction() — count alive players per alignment
// TODO: Implement getLosingFaction(score) — return which faction is behind
// TODO: Implement getStage(score) — map score to Full Moon stage (0/1/2)

// TODO(REVIEW): How to handle case where all Neutrals are dead? Adjust ratio?
// TODO(LOW): Add balance trend tracking (is it getting better or worse?)
