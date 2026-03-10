// =============================================================================
// FILE: BalanceCalculator.ts
// PURPOSE: Balance score calculation for Full Moon staging
//          balance_score = (town_alive / total_alive) - expected_ratio
// LOCATION: src/engine/BalanceCalculator.ts
// =============================================================================

import type { BalanceScore } from "../types/game.types";
import type { Alignment } from "../types/player.types";
import type { FullMoonStage } from "../types/event.types";
import * as GameState from "../state/GameState";
import * as PlayerState from "../state/PlayerState";
import {
  calculateRatio,
  getImbalance,
  mapToStage,
  getLosingFaction,
} from "../utils/balanceScore";

// Default expected town ratio (Town+Neutral / total).
// Not in config.json — derived from typical role distributions (~60% non-Mafia).
const EXPECTED_TOWN_RATIO = 0.6;

// ---------------------------------------------------------------------------
// Faction counting
// ---------------------------------------------------------------------------

interface FactionCounts {
  town: number;
  mafia: number;
  neutral: number;
}

/** Count alive players per alignment */
export function countByFaction(): FactionCounts {
  const aliveIds = GameState.getState().alive_player_ids;
  let town = 0;
  let mafia = 0;
  let neutral = 0;

  for (const id of aliveIds) {
    const alignment = PlayerState.getPlayer(id).alignment;
    if (alignment === "Town") town++;
    else if (alignment === "Mafia") mafia++;
    else neutral++;
  }

  return { town, mafia, neutral };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compute balance score from current game state.
 * Neutral roles count as "non-Mafia" (lumped with Town for ratio).
 *
 * Positive score → Town/Neutral side is winning → buff Mafia
 * Negative score → Mafia side is winning → buff Town
 */
export function calculateBalance(): BalanceScore {
  const { town, mafia, neutral } = countByFaction();
  const nonMafia = town + neutral;
  const total = nonMafia + mafia;
  const ratio = calculateRatio(nonMafia, total);
  const score = total === 0 ? 0 : ratio - EXPECTED_TOWN_RATIO;

  return {
    score,
    town_alive: town,
    mafia_alive: mafia,
    neutral_alive: neutral,
    total_alive: total,
    expected_ratio: EXPECTED_TOWN_RATIO,
  };
}

/** Map a balance score to Full Moon stage (0 / 1 / 2) */
export function getStage(score: number): FullMoonStage {
  const config = GameState.getConfig();
  return mapToStage(
    getImbalance(score, 0),
    config.balance_thresholds,
  );
}

/** Which faction should be buffed (the losing side) */
export function getLosing(score: number): Alignment {
  return getLosingFaction(score);
}

// TODO(Phase 5): Add balance trend tracking (compare to previous day's score)
// TODO(Phase 5): Handle edge case — all Neutrals converted to Zombie alignment
