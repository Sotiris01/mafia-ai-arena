// =============================================================================
// FILE: VoteResult.tsx
// PURPOSE: Lynch result display — shows who was lynched (NO role reveal)
// LOCATION: src/components/voting/VoteResult.tsx
// =============================================================================

// TODO(APPROACH): Displays the result of the vote:
//   - "PlayerX has been lynched" (role NOT revealed — core game mechanic)
//   - "No one was lynched" (tie or insufficient votes)
// Brief dramatic moment before potential Last Wish event.
//
// Collaborating files:
// - src/hooks/useVoting.ts            — provides vote result
// - src/components/voting/LastWishBanner.tsx — may follow after lynch
// - src/utils/formatters.ts           — formatVoteResult helper
// - app/game/vote.tsx                 — parent screen

// TODO: Define VoteResultProps (lynchedPlayer: string | null, voteCount: number)
// TODO: Implement VoteResult component
// TODO: Handle "no lynch" display
// TODO: Emphasize that role is NOT revealed (design choice)
// TODO(LOW): Add dramatic reveal animation
