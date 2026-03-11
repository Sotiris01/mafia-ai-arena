// =============================================================================
// FILE: personality.types.ts
// PURPOSE: Personality system types — 6 personality types, 17 stat fields,
//          PerceptionDepth, VotingStyle
// LOCATION: src/types/personality.types.ts
// =============================================================================



export type PersonalityType =
  | "Aggressive"
  | "Cautious"
  | "Paranoid"
  | "Logical"
  | "Shy"
  | "Charismatic";

// 1 = Superficial (Aggressive, Shy)
// 2 = Smart (Cautious, Charismatic, Logical)
// 3 = Deep (Paranoid)
export type PerceptionDepth = 1 | 2 | 3;

export type VotingStyle = "early" | "mid" | "late" | "bandwagon";

/** 17 stats assigned to each AI player at game start */
export interface PlayerPersonality {
  type: PersonalityType;
  // Speech & Decision
  speak_probability_base: number;
  perception_depth: PerceptionDepth;
  aggression: number;
  team_logic: number;
  // Trust & Suspicion
  trust_base: number;
  suspicion_sensitivity: number;
  emotional_reactivity: number;
  // Social
  persuasion_power: number;
  persuasion_resistance: number;
  leadership: number;
  // Behavior
  consistency: number;
  deception_skill: number;
  bandwagon_tendency: number;
  // Memory & Voting
  memory_weight_modifier: number;
  voting_style: VotingStyle;
  vote_threshold: number;
}

/** Full definition from src/data/personalities.json (extends runtime stats with metadata) */
export interface PersonalityDefinition extends PlayerPersonality {
  frequency: number;
  traits: string[];
  description: string;
}

/** Top-level shape of src/data/personalities.json */
export interface PersonalitiesData {
  personalities: PersonalityDefinition[];
}
