// =============================================================================
// FILE: ZombieIndicator.tsx
// PURPOSE: Zombie infection visual indicator on player avatars
// LOCATION: src/components/events/ZombieIndicator.tsx
// =============================================================================

// TODO(APPROACH): Small badge/overlay on PlayerAvatar showing zombie status.
// Only visible to the player themselves or in morning report announcements.
// Shows infection day and restrictions (can't vote, frozen memory).
//
// Collaborating files:
// - src/types/role.types.ts           — ZombieState
// - src/state/PlayerState.ts          — reads zombie status
// - src/components/shared/PlayerAvatar.tsx — overlays on avatar
// - src/components/night/MorningReport.tsx — zombie status changes

// TODO: Define ZombieIndicatorProps (isZombie: boolean, infectedDay?: number)
// TODO: Implement ZombieIndicator component (badge/icon overlay)
// TODO: Show infection icon on zombie players
// TODO(LOW): Add pulsing green animation for zombie indicator
