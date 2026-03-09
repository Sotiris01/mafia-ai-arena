// =============================================================================
// FILE: vote.tsx
// PURPOSE: Trial & Voting screen — accusations, defense, lynch vote
// LOCATION: app/game/vote.tsx
// =============================================================================

// TODO(APPROACH): Vote Phase sub-phases:
//   1. Accusation — players nominate suspects
//   2. Trial — accused defends (timed)
//   3. Vote — all alive players vote (guilty/innocent/abstain)
//   4. Last Wish — if lynched, 40% chance of Last Wish action
//
// Key mechanics:
//   - Mayor's vote counts ×2 (if revealed)
//   - Zombies cannot vote (ZombieState.voting = false)
//   - Jester WANTS to be lynched (win condition)
//   - Executioner targets specific player for lynch
//   - AI voting via VoteDecision module
//
// Collaborating files:
// - src/components/voting/VotePanel.tsx    — voting interface
// - src/components/voting/VoteCard.tsx     — individual vote display
// - src/components/voting/VoteResult.tsx   — tally + outcome
// - src/components/voting/LastWishBanner.tsx — Last Wish result
// - src/components/shared/MayorBadge.tsx   — Mayor ×2 indicator
// - src/hooks/useVoting.ts                — vote collection + tally
// - src/hooks/useEvents.ts                — Last Wish trigger
// - src/ai/VoteDecision.ts                — AI vote logic
// - src/engine/LastWishEngine.ts           — Last Wish execution

// TODO: Show nomination/accusation sub-phase UI
// TODO: Show defense timer during trial
// TODO: Render VotePanel for voting
// TODO: Handle Mayor ×2, Zombie restriction
// TODO: Show VoteResult with outcome
// TODO: If lynched → check Last Wish → show LastWishBanner
// TODO: Transition to /game/night when vote concludes
// TODO(LOW): Add dramatic vote reveal animation
