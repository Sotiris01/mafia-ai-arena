// =============================================================================
// FILE: PlayerAvatar.tsx
// PURPOSE: Player icon with status — alive/dead/zombie/silenced indicators
// LOCATION: src/components/shared/PlayerAvatar.tsx
// =============================================================================

// TODO(APPROACH): Reusable player avatar component used across all screens.
// Shows player name + status icon. Status variations:
//   - Alive: normal avatar with personality-based color
//   - Dead: grayed out with X overlay
//   - Zombie: green tint with ZombieIndicator
//   - Silenced: muted icon
//   - Mayor: MayorBadge overlay after reveal
//
// Props:
//   - playerId: string
//   - playerName: string
//   - isAlive: boolean
//   - isZombie: boolean
//   - isSilenced: boolean
//   - isMayor: boolean
//   - size: "small" | "medium" | "large"
//
// Collaborating files:
// - src/types/player.types.ts         — PlayerRole for status fields
// - src/components/events/ZombieIndicator.tsx — zombie badge overlay
// - src/components/shared/MayorBadge.tsx — Mayor ×2 badge overlay
// - src/components/chat/ChatBubble.tsx — avatar next to messages
// - src/components/voting/VotePanel.tsx — avatars in voting grid
// - src/components/night/NightAction.tsx — avatars in target selection

// TODO(HIGH): Define PlayerAvatarProps interface
// TODO(HIGH): Implement PlayerAvatar component
// TODO: Handle all status variations (alive/dead/zombie/silenced/mayor)
// TODO: Personality-based color coding
// TODO(LOW): Add status transition animations
