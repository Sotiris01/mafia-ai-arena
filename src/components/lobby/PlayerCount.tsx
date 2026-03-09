// =============================================================================
// FILE: PlayerCount.tsx
// PURPOSE: Player count selector (7–16) in game lobby
// LOCATION: src/components/lobby/PlayerCount.tsx
// =============================================================================

// TODO(APPROACH): Slider or stepper UI to select number of players (7–16).
// Shows the number of roles available at each count based on ImportanceTier:
//   - 7 players: core roles only
//   - 8–9: + important roles
//   - 10–12: + advanced roles
//   - 13–16: + expanded roles
//
// Collaborating files:
// - src/data/config.json              — total_players min/max
// - src/data/roles.json               — role counts per tier
// - src/state/PlayerState.ts          — getRoleDistribution(count)
// - src/components/lobby/RolePreview.tsx — updates when count changes
// - src/components/lobby/StartButton.tsx — enabled when count selected
// - app/index.tsx                     — lobby screen parent

// TODO: Define PlayerCountProps (value, onChange, min, max)
// TODO: Implement PlayerCount component (slider or +/- stepper)
// TODO: Show tier breakdown at current count
// TODO(LOW): Add player count recommendation text
