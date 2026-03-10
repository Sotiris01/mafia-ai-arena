// =============================================================================
// FILE: role.types.ts
// PURPOSE: Role definition types — RoleDefinition, NightAction details,
//          SpecialRules, ZombieState, role scaling rules
// LOCATION: src/types/role.types.ts
// =============================================================================

import type { Role, Alignment, ImportanceTier, NightActionType } from "./player.types";
import type { LocalizedText } from "./game.types";

export type ValidTargets = 
    | "alive" 
    | "dead" 
    | "any" 
    | "mafia_only" 
    | "non_mafia" 
    | "none";

export interface TargetRule {
  valid_targets: ValidTargets;
  excludes_self: boolean;
  max_targets: number;
}

export interface NightActionConfig {
  type: NightActionType;
  resolution_phase: number;
  can_self_target: boolean;
  target_rules: TargetRule;
  description: string;
}

export interface RoleDefinition {
  role: Role;
  alignment: Alignment;
  importance_tier: ImportanceTier;
  min_players: number;
  count_scaling: Record<string, number>;
  description: LocalizedText;
  night_action: NightActionConfig;
  special_rules: string[];
  win_condition: string;
  appears_as?: Alignment;
}

export interface ZombieState {
  is_infected: boolean;
  infected_on_day: number;
  original_role: Role;
  can_vote: boolean;
  can_use_night_action: boolean;
  memory_frozen: boolean;
}

export interface RoleDistribution {
  tier: ImportanceTier;
  roles: RoleDefinition[];
  required_player_count: number;
}

/** Top-level shape of src/data/roles.json */
export interface RolesData {
  roles: RoleDefinition[];
}
