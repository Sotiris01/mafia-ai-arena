// =============================================================================
// FILE: WinChecker.ts
// PURPOSE: Win condition checks — 6 conditions in priority order
// LOCATION: src/engine/WinChecker.ts
// =============================================================================

// Priority order (checked top to bottom, first match wins):
//   1. Jester win     — Jester was lynched (immediate)
//   2. Executioner win — Executioner's target was lynched
//   3. Town win        — All Mafia dead (Mafia-aligned count = 0)
//   4. Mafia win       — Mafia ≥ Town alive (Mafia count ≥ non-Mafia)
//   5. Zombie win      — All alive players are zombies
//   6. Survivor co-win — Survivor is alive when any other win triggers

import type { WinResult } from "../types/game.types";
import type { Alignment } from "../types/player.types";
import * as GameState from "../state/GameState";
import * as PlayerState from "../state/PlayerState";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CheckTrigger = "lynch" | "night";

export interface AlignmentCounts {
  town: number;
  mafia: number;
  neutral: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check all win conditions in priority order.
 * @param trigger — "lynch" or "night" (determines check order from config)
 * @param lynchedPlayerId — the player who was just lynched (if any)
 * @returns WinResult if a faction has won, null if game continues
 */
export function checkWinConditions(
  trigger: CheckTrigger,
  lynchedPlayerId?: string,
): WinResult | null {
  // TODO(Phase 5): Jester win — check if lynchedPlayerId is Jester
  // TODO(Phase 5): Executioner win — check if lynchedPlayerId is Executioner's target

  // Town win: all Mafia eliminated
  const townWin = checkTownWin();
  if (townWin) {
    townWin.co_winners = getSurvivorCoWinners();
    return townWin;
  }

  // Mafia win: Mafia ≥ non-Mafia alive
  const mafiaWin = checkMafiaWin();
  if (mafiaWin) {
    mafiaWin.co_winners = getSurvivorCoWinners();
    return mafiaWin;
  }

  // TODO(Phase 5): Zombie win — all alive players are zombies

  return null;
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

/** Town wins when no Mafia-aligned players remain alive */
export function checkTownWin(): WinResult | null {
  const counts = countByAlignment();
  if (counts.mafia === 0 && counts.total > 0) {
    return {
      winner: "Town",
      co_winners: [],
      reason: "All Mafia members have been eliminated",
    };
  }
  return null;
}

/** Mafia wins when they equal or outnumber all non-Mafia alive players */
export function checkMafiaWin(): WinResult | null {
  const counts = countByAlignment();
  const nonMafia = counts.town + counts.neutral;
  if (counts.mafia > 0 && counts.mafia >= nonMafia) {
    return {
      winner: "Mafia",
      co_winners: [],
      reason: "Mafia has achieved majority control",
    };
  }
  return null;
}

// TODO(Phase 5): Implement checkJesterWin(lynchedPlayerId)
// TODO(Phase 5): Implement checkExecutionerWin(lynchedPlayerId)
// TODO(Phase 5): Implement checkZombieWin()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count alive players by alignment */
export function countByAlignment(): AlignmentCounts {
  const alive = PlayerState.getAllAlivePlayers();
  let town = 0;
  let mafia = 0;
  let neutral = 0;

  for (const p of alive) {
    switch (p.alignment) {
      case "Town":
        town++;
        break;
      case "Mafia":
        mafia++;
        break;
      case "Neutral":
        neutral++;
        break;
    }
  }

  return { town, mafia, neutral, total: town + mafia + neutral };
}

/** Find alive Survivor players for co-win credit */
export function getSurvivorCoWinners(): string[] {
  return PlayerState.getAllAlivePlayers()
    .filter((p) => p.role === "Survivor")
    .map((p) => p.player_id);
}
