// =============================================================================
// FILE: NightAction.tsx
// PURPOSE: Night action selector — role-specific UI for human player
// LOCATION: src/components/night/NightAction.tsx
// =============================================================================

// TODO(APPROACH): Shows the human player their role-specific night action.
// Different UI depending on role:
//   - Sheriff/Doctor/Lookout/etc: "Select a player to [action]" + player grid
//   - Mafia: "Vote on kill target" + player grid
//   - Citizen/Jester: "You have no night action. Waiting..."
//   - Survivor: "Use protective vest?" (limited uses)
//
// Collaborating files:
// - src/hooks/useNightActions.ts      — provides action config + submitAction
// - src/types/player.types.ts         — NightActionType for UI variant
// - src/state/PlayerState.ts          — human player's role
// - src/components/shared/PlayerAvatar.tsx — target selection grid icons
// - app/game/night.tsx                — parent screen

// TODO(HIGH): Define NightActionProps interface
// TODO(HIGH): Implement NightAction component with role-specific variants
// TODO: Implement target selection grid (alive players)
// TODO: Handle "no action" roles (waiting screen)
// TODO: Show action description text per role
// TODO: Handle Survivor vest with use counter
// TODO(LOW): Add target confirmation dialog
