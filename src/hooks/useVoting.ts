// =============================================================================
// FILE: useVoting.ts
// PURPOSE: Voting phase hook — Mayor ×2, Zombie restriction, vote collection
// LOCATION: src/hooks/useVoting.ts
// =============================================================================

// Manages the Voting sub-phase:
//   1. Human casts vote (or abstains)
//   2. AI votes collected via AIEngine.runVoteTurn()
//   3. Tally with Mayor ×2 weight
//   4. Lynch resolution or acquittal
//
// Special rules:
//   - Mayor ×2 vote weight (after reveal)
//   - Zombie players cannot vote
//   - Tie → no lynch
//   - Win check after lynch delegated to PhaseManager.handleLynch()

import { useState, useCallback } from "react";
import type { Vote, WinResult } from "../types/game.types";
import type { PlayerRole } from "../types/player.types";
import { runVoteTurn } from "../engine/AIEngine";
import { handleLynch } from "../engine/PhaseManager";
import * as GameState from "../state/GameState";
import * as PlayerState from "../state/PlayerState";
import * as MemoryManager from "../state/MemoryManager";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VoteTally {
  targetId: string;
  targetName: string;
  totalWeight: number;
}

export interface LynchResult {
  /** Player who was lynched, or null for acquittal/tie */
  lynchedPlayer: PlayerRole | null;
  /** Vote tallies sorted by weight descending */
  tallies: VoteTally[];
  /** Win result if lynch triggered game end */
  winResult: WinResult | null;
}

export interface UseVotingReturn {
  /** All votes cast so far this round */
  votes: Vote[];
  /** Whether AI votes have been collected */
  aiVotesCollected: boolean;
  /** Whether the human has voted */
  hasHumanVoted: boolean;
  /** Lynch result after tally (null until resolved) */
  result: LynchResult | null;
  /** Cast the human player's vote */
  castVote: (targetId: string) => void;
  /** Human explicitly abstains */
  abstain: () => void;
  /** Collect AI votes and resolve the round */
  resolveVoting: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useVoting(): UseVotingReturn {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [aiVotesCollected, setAiVotesCollected] = useState(false);
  const [hasHumanVoted, setHasHumanVoted] = useState(false);
  const [result, setResult] = useState<LynchResult | null>(null);

  /**
   * Cast the human player's vote for a target.
   */
  const castVote = useCallback((targetId: string) => {
    if (hasHumanVoted) return;

    const humanPlayer = PlayerState.getHumanPlayer();

    // Zombie check
    if (humanPlayer.is_zombie) return;

    const day = GameState.getState().day;
    const weight = humanPlayer.is_revealed_mayor ? 2 : 1;

    const vote: Vote = {
      voter_id: "human",
      target_id: targetId,
      weight,
      day,
    };

    setVotes((prev) => [...prev, vote]);
    setHasHumanVoted(true);
  }, [hasHumanVoted]);

  /**
   * Human explicitly abstains from voting.
   */
  const abstain = useCallback(() => {
    if (hasHumanVoted) return;
    setHasHumanVoted(true);
  }, [hasHumanVoted]);

  /**
   * Collect AI votes, merge with human vote, tally, and resolve.
   */
  const resolveVoting = useCallback(() => {
    if (aiVotesCollected) return;

    // Collect AI votes
    const aiResult = runVoteTurn();
    const allVotes = [...votes, ...aiResult.votes];

    setVotes(allVotes);
    setAiVotesCollected(true);

    // Tally votes
    const tallies = tallyVotes(allVotes);

    // Record votes in AI memory
    recordVoteHistory(allVotes);

    // Determine lynch target
    const lynchTarget = determineLynchTarget(tallies);

    if (lynchTarget) {
      const lynchedPlayer = PlayerState.getPlayer(lynchTarget.targetId);
      const winResult = handleLynch(lynchTarget.targetId);

      // TODO(Phase 5): Trigger LastWishEngine after lynch (40% chance)
      // TODO(Phase 5): Check Jester/Executioner win via WinChecker

      setResult({
        lynchedPlayer,
        tallies,
        winResult,
      });
    } else {
      // No lynch — tie or no votes
      setResult({
        lynchedPlayer: null,
        tallies,
        winResult: null,
      });
    }
  }, [votes, aiVotesCollected]);

  return {
    votes,
    aiVotesCollected,
    hasHumanVoted,
    result,
    castVote,
    abstain,
    resolveVoting,
  };
}

// ---------------------------------------------------------------------------
// Tally logic
// ---------------------------------------------------------------------------

/** Count weighted votes per target, sorted by weight descending */
export function tallyVotes(votes: Vote[]): VoteTally[] {
  const counts = new Map<string, number>();

  for (const vote of votes) {
    const current = counts.get(vote.target_id) ?? 0;
    counts.set(vote.target_id, current + vote.weight);
  }

  const tallies: VoteTally[] = [];
  for (const [targetId, totalWeight] of counts) {
    try {
      const player = PlayerState.getPlayer(targetId);
      tallies.push({
        targetId,
        targetName: player.player_name,
        totalWeight,
      });
    } catch {
      // Player not found — skip
    }
  }

  tallies.sort((a, b) => b.totalWeight - a.totalWeight);
  return tallies;
}

/** Determine who gets lynched. Returns null on tie or no votes. */
function determineLynchTarget(tallies: VoteTally[]): VoteTally | null {
  if (tallies.length === 0) return null;

  const top = tallies[0];

  // Check for tie — if top two have equal weight, no lynch
  if (tallies.length >= 2 && tallies[1].totalWeight === top.totalWeight) {
    return null;
  }

  return top;
}

/** Record each player's vote in their memory for AI tracking */
function recordVoteHistory(allVotes: Vote[]): void {
  const aliveIds = GameState.getState().alive_player_ids;

  for (const playerId of aliveIds) {
    if (playerId === "human") continue;

    // Find this player's own vote
    const ownVote = allVotes.find((v) => v.voter_id === playerId);
    if (ownVote) {
      try {
        MemoryManager.addVoteRecord(playerId, {
          day: ownVote.day,
          voted_for: ownVote.target_id,
          lynch_result: "", // Filled by caller after resolution
        });
      } catch {
        // Memory not initialized — skip
      }
    }
  }
}
