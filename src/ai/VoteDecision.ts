// =============================================================================
// FILE: VoteDecision.ts
// PURPOSE: AI voting logic — 8-step process with role overrides
// LOCATION: src/ai/VoteDecision.ts
// =============================================================================

// 8-Step Vote Process:
//   1. Gather all relationships from memory
//   2. Apply PerceptionFilter (depth 1/2/3)
//   3. Calculate suspicion scores per alive player
//   4. Apply role-specific overrides (Mafia/Jester/Executioner/Godfather)
//   5. Apply personality modifiers (bandwagon, threshold, voting_style)
//   6. Consider recent chat events (accusations carry weight)
//   7. Compare top suspect against vote_threshold
//   8. Return vote target or "abstain"

import type { PlayerRole } from "../types/player.types";
import type { PlayerPersonality, VotingStyle } from "../types/personality.types";
import type { Vote } from "../types/game.types";
import { getFilteredMemory, type FilteredMemory } from "./PerceptionFilter";
import * as PlayerState from "../state/PlayerState";
import * as GameState from "../state/GameState";
import * as ChatState from "../state/ChatState";
import { combineScore } from "../utils/weightCalculator";
import { clamp, rollProbability, randomElement } from "../utils/probability";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VoteContext {
  /** Current votes already cast this round (for bandwagon) */
  currentVotes: Vote[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * 8-step decision process. Returns target player_id or null (abstain).
 * Zombies cannot vote — caller must check before invoking.
 */
export function decideVote(
  playerId: string,
  context: VoteContext,
): string | null {
  const player = PlayerState.getPlayer(playerId);
  const personality = PlayerState.getPersonality(playerId);

  // Step 1-2: Gather filtered memory
  const memory = getFilteredMemory(playerId);

  // Step 3: Calculate base suspicion scores for every alive player
  const aliveIds = GameState.getState().alive_player_ids.filter(
    (id) => id !== playerId,
  );
  const scores = calculateSuspicionScores(memory, aliveIds);

  // Step 4: Role-specific overrides
  applyRoleOverrides(scores, player, memory);

  // Step 5: Personality modifiers (bandwagon)
  applyBandwagonEffect(scores, context.currentVotes, personality);

  // Step 5b: Day 1 cold-start randomness — when scores are clustered,
  // inject personality-weighted noise so different AIs vote differently.
  const day = GameState.getState().day;
  if (day === 1) {
    applyDay1Noise(scores, personality);
  }

  // Step 6: Chat event boost (recent accusations)
  applyChatEventBoost(scores, playerId);

  // Step 7-8: Pick top suspect or abstain
  const topTarget = getTopTarget(scores);
  if (!topTarget) return null;

  if (shouldAbstain(topTarget.score, personality.vote_threshold)) {
    return null;
  }

  return topTarget.id;
}

/**
 * Returns the voting_style timing hint for the AI player.
 * The orchestrator can use this to stagger when AI votes appear.
 * "early" → cast immediately, "late" → wait, "bandwagon" → wait for majority.
 */
export function getVoteTiming(votingStyle: VotingStyle): number {
  switch (votingStyle) {
    case "early":
      return 0.2;
    case "mid":
      return 0.5;
    case "late":
      return 0.8;
    case "bandwagon":
      return 0.6;
  }
}

// ---------------------------------------------------------------------------
// Step 3: Suspicion scoring
// ---------------------------------------------------------------------------

/** Build a score map from filtered relationships + known roles */
export function calculateSuspicionScores(
  memory: FilteredMemory,
  alivePlayerIds: string[],
): Map<string, number> {
  const scores = new Map<string, number>();

  for (const targetId of alivePlayerIds) {
    let score = 0;

    // Relationship-based suspicion
    const rel = memory.relationships[targetId];
    if (rel) {
      // combineScore returns trust + suspicion; suspicion is positive, trust is positive
      // Net suspicion = suspicion − trust (high suspicion, low trust → suspicious)
      score = rel.suspicion - rel.trust;
    }

    // Known-role boost: if we know they're Mafia, spike suspicion
    const known = memory.knownRoles[targetId];
    if (known) {
      if (known.role === "Godfather" || known.role === "Mafia Goon" ||
          known.role === "Framer" || known.role === "Silencer" ||
          known.role === "Consigliere" || known.role === "Janitor") {
        score += 2.0 * known.confidence;
      }
    }

    // Contradiction boost (Level 2+)
    for (const c of memory.contradictions) {
      if (c.playerId === targetId) {
        score += 0.5;
      }
    }

    scores.set(targetId, score);
  }

  return scores;
}

// ---------------------------------------------------------------------------
// Step 4: Role overrides
// ---------------------------------------------------------------------------

/** Mutate scores based on the voter's own role */
export function applyRoleOverrides(
  scores: Map<string, number>,
  player: PlayerRole,
  memory: FilteredMemory,
): void {
  if (player.alignment === "Mafia") {
    // Mafia: protect allies — set their score to -Infinity so they're never voted
    const allyIds = getMafiaAllyIds(player.player_id);
    for (const allyId of allyIds) {
      if (scores.has(allyId)) {
        scores.set(allyId, -Infinity);
      }
    }

    // Godfather: boost the most-accused town player to blend in
    if (player.role === "Godfather") {
      const topTown = getTopTarget(scores);
      if (topTown && topTown.score > 0) {
        scores.set(topTown.id, topTown.score + 0.3);
      }
    }
  }

  if (player.role === "Jester") {
    // Jester wants to get self-lynched — vote for someone random
    // to avoid suspicion of being Jester, but don't push hard
    // (Jester's actual goal is achieved by provoking others to vote them)
    for (const [id, score] of scores) {
      scores.set(id, score * 0.5); // Flatten scores — Jester doesn't truly care
    }
  }

  // TODO(Phase 5): Executioner override — boost target's score heavily
}

// ---------------------------------------------------------------------------
// Step 5: Bandwagon effect
// ---------------------------------------------------------------------------

/** Boost scores for targets that already have votes, scaled by bandwagon_tendency.
 *  The boost is capped to prevent runaway groupthink. */
export function applyBandwagonEffect(
  scores: Map<string, number>,
  currentVotes: Vote[],
  personality: PlayerPersonality,
): void {
  if (currentVotes.length === 0 || personality.bandwagon_tendency <= 0) return;

  // Count votes per target
  const voteCounts = new Map<string, number>();
  for (const v of currentVotes) {
    voteCounts.set(v.target_id, (voteCounts.get(v.target_id) ?? 0) + v.weight);
  }

  const totalVotes = currentVotes.reduce((sum, v) => sum + v.weight, 0);
  if (totalVotes === 0) return;

  for (const [targetId, count] of voteCounts) {
    const existing = scores.get(targetId);
    if (existing !== undefined && existing !== -Infinity) {
      // Bandwagon boost proportional to vote share × tendency, capped at 0.4
      const voteShare = count / totalVotes;
      const boost = Math.min(voteShare * personality.bandwagon_tendency, 0.4);
      scores.set(targetId, existing + boost);
    }
  }
}

// ---------------------------------------------------------------------------
// Step 6: Chat event boost
// ---------------------------------------------------------------------------

/** Recent accusations in chat boost target suspicion */
function applyChatEventBoost(
  scores: Map<string, number>,
  playerId: string,
): void {
  const day = GameState.getState().day;
  const events = ChatState.getEventsByDay(day);

  for (const event of events) {
    // If someone else accused a target, and we're not that target, boost
    if (event.action === "accuse" && event.speaker !== playerId) {
      const existing = scores.get(event.target);
      if (existing !== undefined && existing !== -Infinity) {
        scores.set(event.target, existing + event.weight * 0.3);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Step 7-8: Final selection
// ---------------------------------------------------------------------------

function getTopTarget(
  scores: Map<string, number>,
): { id: string; score: number } | null {
  let bestId: string | null = null;
  let bestScore = -Infinity;

  for (const [id, score] of scores) {
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  if (bestId === null) return null;
  return { id: bestId, score: bestScore };
}

/** If the top score is below the personality's threshold, abstain */
export function shouldAbstain(topScore: number, threshold: number): boolean {
  return topScore < threshold;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return player_ids of living Mafia allies (excluding self) */
export function getMafiaAllyIds(playerId: string): string[] {
  return PlayerState.getPlayersByAlignment("Mafia")
    .filter((p) => p.player_id !== playerId && p.is_alive)
    .map((p) => p.player_id);
}

// ---------------------------------------------------------------------------
// Day 1 cold-start noise
// ---------------------------------------------------------------------------

/**
 * On Day 1, memory-based suspicion scores are near-zero for everyone,
 * which causes all AIs to vote the same target (first alphabetically or
 * whoever got a tiny chat-event boost). This injects per-player random
 * noise scaled by personality so different AIs reach different conclusions.
 */
function applyDay1Noise(
  scores: Map<string, number>,
  personality: PlayerPersonality,
): void {
  // Noise amplitude: Paranoid players add more noise (they suspect everyone
  // differently), while Logical players add less.
  const amplitude = 0.3 + personality.aggression * 0.4;

  for (const [id, score] of scores) {
    if (score === -Infinity) continue; // preserve Mafia ally protection
    const noise = (Math.random() - 0.5) * 2 * amplitude;
    scores.set(id, score + noise);
  }
}
