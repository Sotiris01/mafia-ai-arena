// =============================================================================
// FILE: NightDecision.ts
// PURPOSE: AI night action target selection — role-specific logic for 19 roles
// LOCATION: src/ai/NightDecision.ts
// =============================================================================

// TODO(APPROACH): Decision Layer module for night action targeting.
// Each of the 19 roles has unique targeting logic. This is always if-else,
// never replaced by LLM.
//
// Role-specific targeting:
//   Town:
//     - Sheriff: investigate most suspicious player (not already investigated)
//     - Doctor: protect most valuable/threatened Town player
//     - Lookout: watch player most likely to be visited
//     - Gossip: passive — no target needed
//     - Bodyguard: guard most likely Mafia kill target
//     - Tracker: track suspicious player to see who they visited
//     - Mayor: no night action (or reveal during day)
//     - Citizen: no night action
//     - Lovers: passive — linked death, no target
//   Mafia:
//     - Godfather: participates in kill_vote
//     - Mafia Goon: participates in kill_vote
//     - Framer: frame suspected Town investigator's target
//     - Silencer: silence most dangerous Town leader
//     - Consigliere: investigate to learn exact roles
//     - Janitor: investigate dead (after they die)
//   Neutral:
//     - Jester: no night action
//     - Survivor: vest (self-protect, limited uses)
//     - Executioner: no night action
//     - Zombie: infect target (adjacent to last infection)
//
// Collaborating files:
// - src/types/player.types.ts         — PlayerRole, NightActionType, Role
// - src/types/role.types.ts           — NightActionConfig, TargetRule
// - src/types/memory.types.ts         — Relationship, KnownRole
// - src/state/PlayerState.ts          — reads role + alignment for targeting
// - src/state/MemoryManager.ts        — reads memory for target scoring
// - src/ai/PerceptionFilter.ts        — filters available information
// - src/engine/AIEngine.ts            — calls selectTarget() during night_actions
// - src/engine/ResolutionEngine.ts    — processes selected targets
// - src/data/roles.json               — target_rules per role

// TODO(HIGH): Implement selectTarget(playerId) — return target_id based on role
// TODO(HIGH): Implement getMafiaKillVote(playerId) — collective Mafia kill target
// TODO: Implement selectInvestigationTarget(playerId) — Sheriff/Consigliere logic
// TODO: Implement selectProtectionTarget(playerId) — Doctor/Bodyguard logic
// TODO: Implement selectFrameTarget(playerId) — Framer strategic targeting
// TODO: Implement selectSilenceTarget(playerId) — Silencer: silence the biggest threat
// TODO: Implement selectZombieTarget(playerId) — Zombie infection targeting
// TODO: Implement selectSurvivorVest(playerId) — use vest if threatened
// TODO: Implement getValidTargets(role, alivePlayers) — filter by TargetRule

// TODO(REVIEW): Mafia kill_vote — how do multiple Mafia agree on same target?
// TODO(LOW): Add target history tracking to avoid re-targeting same player
