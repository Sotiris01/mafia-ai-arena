// =============================================================================
// FILE: RolePreview.tsx
// PURPOSE: Role distribution preview by tier in game lobby
// LOCATION: src/components/lobby/RolePreview.tsx
// =============================================================================

// TODO(APPROACH): Shows which roles will be in the game based on player count.
// Grouped by ImportanceTier (core/important/advanced/expanded).
// Updates dynamically as PlayerCount changes.
//
// Display format:
//   Core (always): Citizen, Sheriff, Doctor, Godfather, Mafia Goon
//   Important (8+): Lookout, Gossip, Framer, Jester
//   Advanced (10+): Lovers, Bodyguard, Tracker, Silencer, Consigliere, Survivor
//   Expanded (13+): Mayor, Janitor, Executioner, Zombie
//
// Collaborating files:
// - src/data/roles.json               — role definitions with tiers
// - src/types/role.types.ts           — RoleDefinition, ImportanceTier
// - src/state/PlayerState.ts          — getRoleDistribution()
// - src/components/lobby/PlayerCount.tsx — triggers updates on count change
// - app/index.tsx                     — lobby screen parent

// TODO: Define RolePreviewProps (playerCount: number)
// TODO: Implement RolePreview component (sectioned list by tier)
// TODO: Highlight newly unlocked roles when count changes
// TODO: Show role icons + names + alignment color
// TODO(LOW): Add role detail popup on tap
