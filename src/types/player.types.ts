// =============================================================================
// FILE: player.types.ts
// PURPOSE: Core player data types — Role, Alignment, ImportanceTier, PlayerRole
// LOCATION: src/types/player.types.ts
// =============================================================================

export type Alignment = "Town" | "Mafia" | "Neutral";

// 19 roles matching src/data/roles.json exactly
// Town (9) | Mafia (6) | Neutral (4)
export type Role =
  | "Citizen"
  | "Sheriff"
  | "Doctor"
  | "Lookout"
  | "Gossip"
  | "Bodyguard"
  | "Lovers"
  | "Tracker"
  | "Mayor"
  | "Godfather"
  | "Mafia Goon"
  | "Framer"
  | "Silencer"
  | "Consigliere"
  | "Janitor"
  | "Jester"
  | "Survivor"
  | "Executioner"
  | "Zombie";

// Maps 1:1 to role capabilities in roles.json
export type NightActionType =
  | "none"
  | "investigate"
  | "protect"
  | "watch"
  | "passive_hint"
  | "passive_visit"
  | "guard"
  | "track"
  | "kill_vote"
  | "frame"
  | "silence"
  | "investigate_role"
  | "investigate_dead"
  | "vest"
  | "infect";

// core: 7+ | important: 8+ | advanced: 10+ | expanded: 13+
export type ImportanceTier = "core" | "important" | "advanced" | "expanded";

export interface PlayerRole {
  player_id: string;
  player_name: string;
  role: Role;
  alignment: Alignment;
  importance_tier: ImportanceTier;
  night_action: NightActionType;
  is_alive: boolean;
  appears_as: Alignment;
  is_zombie: boolean;
  is_revealed_mayor: boolean;
  special_rules: string[];
}
