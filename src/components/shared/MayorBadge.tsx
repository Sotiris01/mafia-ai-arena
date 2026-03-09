// =============================================================================
// FILE: MayorBadge.tsx
// PURPOSE: Mayor revealed indicator — ×2 vote badge
// LOCATION: src/components/shared/MayorBadge.tsx
// =============================================================================

// TODO(APPROACH): Small badge overlay shown on Mayor's avatar after they
// use the reveal action. Indicates their vote counts as ×2.
// Also shown next to Mayor's name in VotePanel.
//
// Collaborating files:
// - src/types/player.types.ts         — is_revealed_mayor field
// - src/state/PlayerState.ts          — reads Mayor reveal status
// - src/components/shared/PlayerAvatar.tsx — overlays on Mayor's avatar
// - src/components/voting/VotePanel.tsx — shown in voting context
// - src/components/voting/VoteCard.tsx — next to Mayor's vote entry

// TODO: Define MayorBadgeProps (size: "small" | "large")
// TODO: Implement MayorBadge component (×2 icon/badge)
// TODO(LOW): Add reveal animation when Mayor first reveals
