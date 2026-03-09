// =============================================================================
// FILE: RoleCard.tsx
// PURPOSE: Role card — shown only to owner, never public, displays role info
// LOCATION: src/components/shared/RoleCard.tsx
// =============================================================================

// TODO(APPROACH): Displays the player's own role card. NEVER shown to other
// players (core game mechanic — roles are secret). Shows:
//   - Role name + alignment
//   - Night action description
//   - Special rules
//   - Importance tier badge
//
// Collaborating files:
// - src/types/player.types.ts         — PlayerRole
// - src/types/role.types.ts           — RoleDefinition for detailed info
// - src/state/PlayerState.ts          — reads human player's role
// - src/utils/formatters.ts           — formatRole, formatAlignment
// - src/components/shared/FactionBanner.tsx — faction color header

// TODO: Define RoleCardProps (role: PlayerRole, expanded: boolean)
// TODO: Implement RoleCard component (card with role details)
// TODO: Show role name, alignment, night action, special rules
// TODO: Collapsible/expandable for compact view
// TODO(LOW): Add role icon from assets/icons/
