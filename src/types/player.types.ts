// =============================================================================
// FILE: player.types.ts
// PURPOSE: Core player data types — Role, Alignment, ImportanceTier, PlayerRole
// LOCATION: src/types/player.types.ts
// =============================================================================

// TODO(APPROACH): This is the foundational type file. Almost every module in
// the project imports from here. Define all player-identity types first,
// then the PlayerRole interface that combines them.
//
// Collaborating files:
// - src/types/role.types.ts       — extends with RoleDefinition, NightAction, ZombieState
// - src/types/personality.types.ts — personality assigned alongside role
// - src/state/PlayerState.ts      — manages per-player role.json using these types
// - src/data/roles.json           — static data matching the Role union type (19 roles)
// - src/engine/ResolutionEngine.ts — reads PlayerRole for night resolution
// - src/engine/WinChecker.ts      — reads alignment + is_alive for win conditions
// - src/ai/NightDecision.ts       — reads role + night_action for target selection

// TODO(HIGH): Define Alignment type
// - "Town" | "Mafia" | "Neutral"
// - Used by WinChecker, BalanceCalculator, PerceptionFilter

// TODO(HIGH): Define Role type (union of all 19 roles)
// - Town (9): Citizen, Sheriff, Doctor, Lookout, Gossip, Lovers, Bodyguard, Tracker, Mayor
// - Mafia (6): Godfather, Mafia Goon, Framer, Silencer, Consigliere, Janitor
// - Neutral (4): Jester, Survivor, Executioner, Zombie
// - Must match exactly the roles defined in src/data/roles.json

// TODO(HIGH): Define NightActionType (15 action types)
// - "none" | "investigate" | "protect" | "watch" | "passive_hint"
// - "passive_visit" | "guard" | "track" | "kill_vote" | "frame"
// - "silence" | "investigate_role" | "investigate_dead" | "vest" | "infect"
// - Maps 1:1 to role capabilities in roles.json

// TODO: Define ImportanceTier type
// - "core" | "important" | "advanced" | "expanded"
// - core: always included (7+ players)
// - important: 8+ players
// - advanced: 10+ players
// - expanded: 13+ players
// - Used by lobby/RolePreview.tsx for role distribution display

// TODO(HIGH): Define PlayerRole interface
// - player_id: string
// - player_name: string
// - role: Role
// - alignment: Alignment
// - importance_tier: ImportanceTier
// - night_action: NightActionType
// - is_alive: boolean
// - appears_as: Alignment          — Godfather appears as Town to Sheriff
// - is_zombie: boolean             — true if infected by Zombie role
// - is_revealed_mayor: boolean     — true if Mayor used reveal action
// - special_rules: string[]        — role-specific constraints (e.g., "immune_to_investigation")

// TODO: Export all types for use across the project
