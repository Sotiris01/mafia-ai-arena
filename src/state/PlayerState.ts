// =============================================================================
// FILE: PlayerState.ts
// PURPOSE: Per-player manager — role assignment + personality assignment,
//          CRUD for player state during gameplay
// LOCATION: src/state/PlayerState.ts
// =============================================================================

import type {
  Alignment,
  Role,
  ImportanceTier,
  PlayerRole,
} from "../types/player.types";
import type { RoleDefinition } from "../types/role.types";
import type {
  PlayerPersonality,
  PersonalityDefinition,
  PersonalityType,
} from "../types/personality.types";
import { weightedRandom, shuffleArray } from "../utils/probability";
import rolesData from "../data/roles.json";
import personalitiesData from "../data/personalities.json";

// TODO: Add role swap/conversion support for Executioner→Jester mechanic (Phase 3)

// ---------------------------------------------------------------------------
// Internal stores
// ---------------------------------------------------------------------------

let players: Map<string, PlayerRole> = new Map();
let personalities: Map<string, PlayerPersonality> = new Map();
let humanPlayerId: string | null = null;

const TIER_ORDER: ImportanceTier[] = ["core", "important", "advanced", "expanded"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse count_scaling keys like "7-9" or "14-16" and return count for playerCount */
function getScalingCount(
  scaling: Record<string, number>,
  playerCount: number,
): number {
  for (const [range, count] of Object.entries(scaling)) {
    const parts = range.split("-");
    const lo = parseInt(parts[0], 10);
    const hi = parseInt(parts[1] ?? parts[0], 10);
    if (playerCount >= lo && playerCount <= hi) return count;
  }
  return 0;
}

/** Build the list of roles to assign for the given playerCount */
function buildRolePool(playerCount: number): RoleDefinition[] {
  const defs = (rolesData as unknown as { roles: RoleDefinition[] }).roles;
  const pool: RoleDefinition[] = [];

  // Process tiers in order to guarantee core roles are always included
  for (const tier of TIER_ORDER) {
    const tierRoles = defs.filter(
      (r) => r.importance_tier === tier && r.min_players <= playerCount,
    );
    for (const role of tierRoles) {
      const count = getScalingCount(
        role.count_scaling as Record<string, number>,
        playerCount,
      );
      for (let i = 0; i < count; i++) {
        pool.push(role);
      }
    }
  }

  // If pool is larger than playerCount, trim from the end (expanded first)
  while (pool.length > playerCount) pool.pop();

  // If pool is smaller, pad with Citizens
  const citizenDef = defs.find((r) => r.role === "Citizen")!;
  while (pool.length < playerCount) pool.push(citizenDef);

  return shuffleArray(pool);
}

/** Pick a random personality weighted by frequency */
function pickPersonality(): PlayerPersonality {
  const defs = (personalitiesData as unknown as { personalities: PersonalityDefinition[] })
    .personalities;
  const weights = defs.map((d) => d.frequency);
  const picked = weightedRandom(defs, weights);

  // Extract only the runtime stats (no frequency/traits/description)
  const p: PlayerPersonality = {
    type: picked.type,
    speak_probability_base: picked.speak_probability_base,
    perception_depth: picked.perception_depth,
    aggression: picked.aggression,
    team_logic: picked.team_logic,
    trust_base: picked.trust_base,
    suspicion_sensitivity: picked.suspicion_sensitivity,
    emotional_reactivity: picked.emotional_reactivity,
    persuasion_power: picked.persuasion_power,
    persuasion_resistance: picked.persuasion_resistance,
    leadership: picked.leadership,
    consistency: picked.consistency,
    deception_skill: picked.deception_skill,
    bandwagon_tendency: picked.bandwagon_tendency,
    memory_weight_modifier: picked.memory_weight_modifier,
    voting_style: picked.voting_style,
    vote_threshold: picked.vote_threshold,
  };
  return p;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create all player records. Player ID "human" is reserved for the human player.
 * AI players get IDs "ai_1", "ai_2", etc.
 */
export function initializePlayers(playerCount: number): string[] {
  players.clear();
  personalities.clear();

  const rolePool = buildRolePool(playerCount);
  const ids: string[] = [];

  for (let i = 0; i < playerCount; i++) {
    const isHuman = i === 0;
    const id = isHuman ? "human" : `ai_${i}`;
    const roleDef = rolePool[i];

    const playerRole: PlayerRole = {
      player_id: id,
      player_name: isHuman ? "Player" : `Player ${i + 1}`,
      role: roleDef.role as Role,
      alignment: roleDef.alignment as Alignment,
      importance_tier: roleDef.importance_tier as ImportanceTier,
      night_action: roleDef.night_action.type,
      is_alive: true,
      appears_as: (roleDef.appears_as as Alignment) ?? roleDef.alignment as Alignment,
      is_zombie: false,
      is_revealed_mayor: false,
      special_rules: [...roleDef.special_rules],
    };

    players.set(id, playerRole);
    personalities.set(id, pickPersonality());
    ids.push(id);

    if (isHuman) humanPlayerId = id;
  }

  return ids;
}

/** Get a single player's role data */
export function getPlayer(playerId: string): PlayerRole {
  const p = players.get(playerId);
  if (!p) throw new Error(`Player not found: ${playerId}`);
  return p;
}

/** Get a single player's personality data */
export function getPersonality(playerId: string): PlayerPersonality {
  const p = personalities.get(playerId);
  if (!p) throw new Error(`Personality not found: ${playerId}`);
  return p;
}

/** Return all alive players */
export function getAllAlivePlayers(): PlayerRole[] {
  return Array.from(players.values()).filter((p) => p.is_alive);
}

/** Partial update to a player's mutable fields */
export function updatePlayerStatus(
  playerId: string,
  updates: Partial<Pick<PlayerRole, "is_alive" | "is_zombie" | "is_revealed_mayor" | "appears_as">>,
): void {
  const p = getPlayer(playerId);
  Object.assign(p, updates);
}

/** Get the role distribution generated for the current game */
export function getRoleDistribution(): Map<Role, number> {
  const dist = new Map<Role, number>();
  for (const p of players.values()) {
    dist.set(p.role, (dist.get(p.role) ?? 0) + 1);
  }
  return dist;
}

/** Filter alive players by alignment */
export function getPlayersByAlignment(alignment: Alignment): PlayerRole[] {
  return Array.from(players.values()).filter(
    (p) => p.alignment === alignment && p.is_alive,
  );
}

/** Return the human player record */
export function getHumanPlayer(): PlayerRole {
  if (!humanPlayerId) throw new Error("PlayerState not initialized");
  return getPlayer(humanPlayerId);
}

/** Get all player IDs */
export function getAllPlayerIds(): string[] {
  return Array.from(players.keys());
}

/** Clear state for new game */
export function reset(): void {
  players.clear();
  personalities.clear();
  humanPlayerId = null;
}
