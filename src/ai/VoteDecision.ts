// =============================================================================
// FILE: VoteDecision.ts
// PURPOSE: AI voting logic — 8-step process with role overrides
// LOCATION: src/ai/VoteDecision.ts
// =============================================================================

// TODO(APPROACH): Decision Layer module for AI voting. Uses an 8-step
// process to determine who to vote for during the trial sub-phase.
// Never replaced by LLM — always if-else logic.
//
// 8-Step Vote Process:
//   1. Gather all relationships from memory
//   2. Apply PerceptionFilter (depth 1/2/3)
//   3. Calculate suspicion scores per alive player
//   4. Apply role-specific overrides:
//      - Mafia: never vote for Mafia allies (unless desperate)
//      - Jester: try to get self-lynched subtly
//      - Executioner: push to lynch target
//      - Godfather: vote strategically to blend in
//   5. Apply personality modifiers:
//      - bandwagon_tendency: follow majority
//      - vote_threshold: minimum suspicion to cast vote
//      - voting_style: early/mid/late/bandwagon
//   6. Consider recent chat events (accusations carry weight)
//   7. Compare top suspect against vote_threshold
//   8. Return vote target or "abstain"
//
// Collaborating files:
// - src/types/personality.types.ts    — vote_threshold, voting_style, bandwagon_tendency
// - src/types/player.types.ts         — PlayerRole for role overrides
// - src/types/memory.types.ts         — Relationship, KnownRole
// - src/ai/PerceptionFilter.ts        — filters memory by perception depth
// - src/state/MemoryManager.ts        — reads relationships + known_roles
// - src/state/ChatState.ts            — reads recent accusations/defenses
// - src/state/PlayerState.ts          — reads player role + personality
// - src/engine/AIEngine.ts            — calls decideVote() during voting sub-phase
// - src/hooks/useVoting.ts            — processes AI votes alongside human vote

// TODO(HIGH): Implement decideVote(playerId, context) — return target_id or null
// TODO(HIGH): Implement calculateSuspicionScores(memory, alivePlayers) — score per player
// TODO(HIGH): Implement applyRoleOverrides(scores, playerRole) — Mafia/Jester/Executioner logic
// TODO: Implement applyPersonalityModifiers(scores, personality) — bandwagon, threshold
// TODO: Implement applyBandwagonEffect(scores, currentVotes) — follow the majority
// TODO: Implement shouldAbstain(topScore, threshold) — below threshold = no vote
// TODO: Implement getMafiaAllyIds(playerId) — for Mafia ally protection
// TODO: Implement getVoteTiming(votingStyle) — when in the voting phase to cast

// TODO(REVIEW): Zombie can't vote — ensure this is enforced before calling decideVote
// TODO(REVIEW): Mayor ×2 vote weight — handled in useVoting, not here
