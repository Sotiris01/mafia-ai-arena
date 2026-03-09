// =============================================================================
// FILE: useVoting.ts
// PURPOSE: Voting phase hook — Mayor ×2, Zombie restriction, vote collection
// LOCATION: src/hooks/useVoting.ts
// =============================================================================

// TODO(APPROACH): Manages the Trial + Voting sub-phases:
//   1. Accusation — someone nominates a player for trial
//   2. Defense — accused player gets to respond
//   3. Voting — all alive players vote (except Zombies)
//   4. Lynch resolution — tally votes, Mayor ×2 weight
//
// Special rules:
//   - Mayor × 2 vote weight (after reveal)
//   - Zombie players cannot vote
//   - Tie → no lynch
//   - Jester win check after lynch
//   - Last Wish trigger after lynch (40% chance)
//
// Collaborating files:
// - src/types/game.types.ts           — Vote interface
// - src/ai/VoteDecision.ts            — AI vote logic
// - src/engine/AIEngine.ts            — triggers AI votes
// - src/engine/WinChecker.ts          — Jester/Executioner check after lynch
// - src/engine/LastWishEngine.ts      — Last Wish trigger after lynch
// - src/state/GameState.ts            — reads alive players, updates on lynch
// - src/state/PlayerState.ts          — reads Mayor status, Zombie status
// - src/state/MemoryManager.ts        — records vote history
// - src/components/voting/VotePanel.tsx — voting UI
// - src/components/voting/VoteCard.tsx   — individual vote display
// - src/components/voting/VoteResult.tsx — lynch result (NO role reveal)
// - src/components/voting/LastWishBanner.tsx — Last Wish display
// - app/game/vote.tsx                  — uses this hook

// TODO(HIGH): Implement useVoting() hook returning { votes, castVote, result }
// TODO(HIGH): Implement castVote(targetId) — human player votes
// TODO(HIGH): Implement collectAIVotes() — gather all AI votes with timing
// TODO: Implement tallyVotes(votes) — count with Mayor ×2 weight
// TODO: Implement resolveLynch(targetId) — process lynch (no role reveal)
// TODO: Implement isVotingEligible(playerId) — not dead, not zombie
// TODO: Implement handleTie() — no lynch on tie

// TODO(REVIEW): Vote display — show votes in real-time or reveal all at once?
// TODO(LOW): Add vote change mechanic (can player change their vote before deadline?)
