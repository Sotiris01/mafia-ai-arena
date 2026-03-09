// =============================================================================
// FILE: ResolutionEngine.ts
// PURPOSE: Night action resolver — 7-phase resolution order (phases 0–6)
// LOCATION: src/engine/ResolutionEngine.ts
// =============================================================================

// TODO(APPROACH): Resolves all night actions in strict phase order:
//   Phase 0: Passive (Lookout watch, Tracker track — observe only)
//   Phase 1: Info Alteration (Framer — alter investigation results)
//   Phase 2: Investigate (Sheriff, Consigliere — check alignment/role)
//   Phase 3: Kill & Protect (Mafia kill_vote, Doctor protect, Bodyguard guard)
//   Phase 4: Post-Kill (Zombie infect, Lovers death link — unsavable)
//   Phase 5: Passive Info (Gossip hint — receive cryptic clue)
//   Phase 6: Cleanup (Janitor — investigate dead, Silencer — silence target)
//
// Conflict resolution rules:
//   - Doctor protection blocks Mafia kill
//   - Bodyguard sacrifice: Bodyguard dies if target is attacked
//   - Framer makes target appear as Mafia to Sheriff (Phase 1 before Phase 2)
//   - Godfather always appears as Town to Sheriff
//   - Lovers: if one dies, both die (Phase 4, cannot be saved by Doctor)
//   - Zombie infect: Doctor can cure if Doctor targets same player
//
// Collaborating files:
// - src/types/player.types.ts         — PlayerRole, NightActionType
// - src/types/role.types.ts           — NightActionConfig, resolution_phase
// - src/state/PlayerState.ts          — reads player roles + updates status
// - src/state/GameState.ts            — updates alive/dead/zombie lists
// - src/state/MemoryManager.ts        — stores NightResult for each acting player
// - src/engine/PhaseManager.ts        — triggers resolution during night_resolution
// - src/engine/WinChecker.ts          — called after resolution completes
// - src/engine/FullMoonEngine.ts      — may grant extra actions to buffed faction
// - src/ai/NightDecision.ts           — provides AI target selections as input
// - src/data/roles.json               — role definitions with resolution phases

// TODO(HIGH): Implement resolveNight(actions) — main resolution function
//   Input: Array of { player_id, action_type, target_id }
//   Output: NightResolutionResult with deaths, events, results per player
// TODO(HIGH): Implement phase-by-phase resolution loop (0 through 6)
// TODO(HIGH): Implement conflict resolution (Doctor blocks kill, Framer alters Sheriff)
// TODO: Implement Bodyguard sacrifice logic
// TODO: Implement Lovers death link (Phase 4, unsavable)
// TODO: Implement Zombie infect + Doctor cure interaction
// TODO: Implement Godfather investigation immunity
// TODO: Implement Gossip hint generation (Phase 5)
// TODO: Implement Janitor dead investigation (Phase 6)
// TODO: Implement Silencer effect application (Phase 6)

// TODO(REVIEW): Handle edge case: multiple Doctors protecting same target
// TODO(REVIEW): Handle edge case: Zombie infects a player who dies same night
