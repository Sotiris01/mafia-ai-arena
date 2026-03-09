// =============================================================================
// FILE: PlayerState.ts
// PURPOSE: Per-player JSON manager — role.json + personality.json per player
// LOCATION: src/state/PlayerState.ts
// =============================================================================

// TODO(APPROACH): Manages individual player data files. Each player has:
//   - role data (from src/data/roles.json → PlayerRole)
//   - personality data (from src/data/personalities.json → PlayerPersonality)
// On game init, assigns roles by tier + player count, then assigns
// random personalities. Provides CRUD for player state during gameplay.
//
// Storage pattern: one JSON per player or a single players.json with all
// player records keyed by player_id.
//
// Collaborating files:
// - src/types/player.types.ts         — PlayerRole interface
// - src/types/personality.types.ts    — PlayerPersonality interface
// - src/types/role.types.ts           — RoleDefinition, ZombieState
// - src/data/roles.json               — role definitions for assignment
// - src/data/personalities.json       — personality definitions for assignment
// - src/state/GameState.ts            — reads alive_players, updates on death
// - src/engine/ResolutionEngine.ts    — reads player roles for night actions
// - src/engine/WinChecker.ts          — reads alignment + alive status
// - src/ai/NightDecision.ts           — reads role for action selection
// - src/ai/PerceptionFilter.ts        — reads personality.perception_depth
// - src/components/shared/RoleCard.tsx — reads role info for display

// TODO(HIGH): Implement initializePlayers(playerCount) — assign roles by tier + personalities
// TODO(HIGH): Implement getPlayer(playerId) — return PlayerRole + PlayerPersonality
// TODO(HIGH): Implement getAllAlivePlayers() — filter alive players
// TODO: Implement updatePlayerStatus(playerId, updates) — alive, zombie, revealed
// TODO: Implement getRoleDistribution(playerCount) — select roles by ImportanceTier
// TODO: Implement getPlayersByAlignment(alignment) — filter by Town/Mafia/Neutral
// TODO: Implement getHumanPlayer() — return the single human player

// TODO(REVIEW): Role assignment algorithm — ensure balanced distribution per tier
// TODO(LOW): Add role swap/conversion support for future mechanics
