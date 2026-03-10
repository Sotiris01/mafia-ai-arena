// =============================================================================
// FILE: balanceScore.ts
// PURPOSE: Balance score calculation helpers for Full Moon staging
// LOCATION: src/utils/balanceScore.ts
// =============================================================================

import type { FullMoonStage } from "../types/event.types";
import type { Alignment } from "../types/player.types";

/** town_alive / total_alive (returns 0 if no players alive) */
export function calculateRatio(townAlive: number, totalAlive: number): number {
  if (totalAlive === 0) return 0;
  return townAlive / totalAlive;
}

/** |ratio - expectedRatio| */
export function getImbalance(ratio: number, expectedRatio: number): number {
  return Math.abs(ratio - expectedRatio);
}

/**
 * Map imbalance to Full Moon stage:
 *   |score| < stage_1  → Stage 0 (balanced)
 *   |score| ≥ stage_1  → Stage 1 (info buff)
 *   |score| ≥ stage_2  → Stage 2 (full buff)
 */
export function mapToStage(
  imbalance: number,
  thresholds: { stage_1: number; stage_2: number }
): FullMoonStage {
  if (imbalance >= thresholds.stage_2) return 2;
  if (imbalance >= thresholds.stage_1) return 1;
  return 0;
}

/**
 * Determine which faction is losing based on balance score direction.
 *   positive score → Town overpowers → Mafia is losing
 *   negative score → Mafia overpowers → Town is losing
 */
export function getLosingFaction(score: number): Alignment {
  return score > 0 ? "Mafia" : "Town";
}

// TODO(LOW): Add balance history tracking for trend analysis
