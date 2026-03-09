// =============================================================================
// FILE: MemoryManager.ts
// PURPOSE: memory.json CRUD + Time Decay (r=0.85) + event memory storage
// LOCATION: src/state/MemoryManager.ts
// =============================================================================

// TODO(APPROACH): Each AI player has a memory.json (PlayerMemory) that tracks
// relationships, known roles, night results, and witnessed events.
// Memory weights decay each day transition: weight × r (r = 0.85).
// Zombie victims have frozen memory — no updates after infection.
//
// Key operations:
//   - Update relationship weights from ChatEvents (direct ×1.0, indirect ×0.3–0.4)
//   - Apply time decay on day transitions
//   - Store night investigation results (confidence: 1.0 for confirmed)
//   - Record witnessed events (Night Echo, Last Wish, Full Moon)
//   - Track voting history
//   - Freeze memory for zombie victims
//
// Collaborating files:
// - src/types/memory.types.ts         — PlayerMemory, Relationship, KnownRole, EventWitnessed
// - src/types/chat.types.ts           — ChatEvent (input for relationship updates)
// - src/engine/ChatAnalyzer.ts        — produces ChatEvents that feed updateRelationships()
// - src/engine/ResolutionEngine.ts    — provides NightResult data
// - src/ai/VoteDecision.ts            — reads relationships + known_roles for vote logic
// - src/ai/PerceptionFilter.ts        — filters memory by perception_depth
// - src/ai/EventReaction.ts           — calls addEventWitnessed()
// - src/ai/SpeakProbability.ts        — reads interaction_count for cooldown
// - src/utils/weightCalculator.ts     — decay formula + indirect weight math
// - src/data/config.json              — decay_factor (0.85), indirect weights

// TODO(HIGH): Implement initMemory(playerId) — create empty PlayerMemory
// TODO(HIGH): Implement getMemory(playerId) — read player's memory
// TODO(HIGH): Implement updateRelationships(playerId, chatEvents) — process chat into weights
// TODO(HIGH): Implement applyDecay(playerId) — multiply all weights by r=0.85
// TODO: Implement addNightResult(playerId, result) — store investigation/action result
// TODO: Implement addKnownRole(playerId, targetId, knownRole) — store confirmed/suspected role
// TODO: Implement addEventWitnessed(playerId, event) — store Night Echo/Last Wish/Full Moon
// TODO: Implement addVoteRecord(playerId, vote) — store voting history
// TODO: Implement freezeMemory(playerId) — set memory_state to "frozen" (zombie)
// TODO: Implement getRelationshipScore(playerId, targetId) — combined trust + suspicion

// TODO(REVIEW): Should decay apply to known_roles with confidence < 1.0?
// TODO(LOW): Add memory pruning for very old records (performance optimization)
