// =============================================================================
// FILE: VotePanel.tsx
// PURPOSE: Voting UI container — player selection grid, Mayor ×2 indicator
// LOCATION: src/components/voting/VotePanel.tsx
// =============================================================================

// TODO(APPROACH): Main voting interface during the voting sub-phase.
// Displays all alive players as selectable targets. Human taps to vote.
// Shows Mayor ×2 indicator. Zombie players shown as "can't vote".
// Displays current vote tally as votes come in.
//
// Collaborating files:
// - src/hooks/useVoting.ts            — provides castVote + vote state
// - src/components/voting/VoteCard.tsx — individual vote displays
// - src/components/shared/PlayerAvatar.tsx — player icons in grid
// - src/components/shared/MayorBadge.tsx — Mayor indicator
// - src/components/shared/Timer.tsx    — voting countdown
// - app/game/vote.tsx                 — parent screen

// TODO(HIGH): Implement VotePanel component with player selection grid
// TODO: Display current vote tally (real-time or progressive reveal)
// TODO: Handle human vote submission
// TODO: Show Mayor ×2 badge next to Mayor's vote
// TODO: Disable voting for zombie players
// TODO: Show voting deadline timer
// TODO(LOW): Add vote confirmation dialog
