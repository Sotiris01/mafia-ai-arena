// =============================================================================
// FILE: role.types.ts
// PURPOSE: Role definition types — RoleDefinition, NightAction details,
//          SpecialRules, ZombieState, role scaling rules
// LOCATION: src/types/role.types.ts
// =============================================================================

// TODO(APPROACH): Extends player.types.ts with detailed role definitions
// used by src/data/roles.json. Each of the 19 roles has a RoleDefinition
// that specifies its night action, special rules, and scaling behavior.
// ZombieState tracks infection mechanics separately.
//
// Collaborating files:
// - src/types/player.types.ts       — base Role, Alignment, NightActionType types
// - src/data/roles.json             — static data matching RoleDefinition[]
// - src/engine/ResolutionEngine.ts  — reads NightAction for 7-phase resolution
// - src/engine/WinChecker.ts        — reads win_condition field
// - src/ai/NightDecision.ts         — reads target_rules for valid targets
// - src/state/PlayerState.ts        — manages role assignment using RoleDefinition
// - src/components/shared/RoleCard.tsx — displays role info to owner
// - src/components/lobby/RolePreview.tsx — shows role distribution by tier

// TODO(HIGH): Define RoleDefinition interface
// - role: Role                        — from player.types.ts
// - alignment: Alignment
// - importance_tier: ImportanceTier
// - description: string              — role flavor text
// - night_action: NightActionConfig
// - special_rules: SpecialRule[]
// - win_condition: string             — text description of how this role wins
// - appears_as?: Alignment            — only for Godfather (appears as Town)
// - min_players: number               — minimum players needed to include this role

// TODO: Define NightActionConfig interface
// - type: NightActionType
// - target_rules: TargetRule
// - resolution_phase: number          — which phase (0–6) this action resolves in
// - can_self_target: boolean
// - description: string

// TODO: Define TargetRule interface
// - valid_targets: "alive" | "dead" | "any" | "mafia_only" | "non_mafia"
// - excludes_self: boolean
// - max_targets: number               — usually 1, Mafia kill_vote is collective

// TODO: Define SpecialRule type
// - string descriptions of unique role mechanics
// - e.g., "immune_to_investigation", "votes_count_as_2", "cannot_vote_when_zombie"
// - Used by ResolutionEngine and VoteDecision for role-specific overrides

// TODO: Define ZombieState interface
// - is_infected: boolean
// - infected_on_day: number
// - original_role: Role               — role before infection
// - can_vote: boolean                 — false for zombie victims
// - can_use_night_action: boolean     — false for zombie victims
// - memory_frozen: boolean            — true, no memory updates

// TODO: Define RoleDistribution interface (for lobby)
// - tier: ImportanceTier
// - roles: RoleDefinition[]
// - required_player_count: number     — 7 for core, 8 for important, etc.

// TODO: Export all types
