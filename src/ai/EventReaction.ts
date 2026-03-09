// =============================================================================
// FILE: EventReaction.ts
// PURPOSE: AI reaction to Night Echo events — weight → memory impact
// LOCATION: src/ai/EventReaction.ts
// =============================================================================

// TODO(APPROACH): When a Night Echo event is delivered (morning or midday),
// each AI player reacts based on their personality:
//   1. Read event suspicion_weight
//   2. Multiply by personality.emotional_reactivity
//   3. Apply to relevant relationships in memory
//   4. Store in events_witnessed[]
//   5. May trigger an immediate speak response
//
// Example: E01 "Mysterious Whispers" (weight 0.30) about Player X
//   - Aggressive player: 0.30 × 1.8 = 0.54 suspicion boost (strong reaction)
//   - Logical player: 0.30 × 0.8 = 0.24 suspicion boost (mild reaction)
//   - Shy player: 0.30 × 0.6 = 0.18 suspicion boost (minimal reaction)
//
// Events can also influence AI behavior:
//   - E06 "Strange Silence" → AI becomes more suspicious of silenced player
//   - E10 "Unexpected Alliance" → AI adjusts trust toward alliance members
//   - E12 "Zombie Sighting" → AI prioritizes zombie threats
//
// Collaborating files:
// - src/types/event.types.ts          — NightEchoEvent, NightEchoEventId
// - src/types/personality.types.ts    — emotional_reactivity, suspicion_sensitivity
// - src/types/memory.types.ts         — EventWitnessed
// - src/state/MemoryManager.ts        — addEventWitnessed(), updateRelationships()
// - src/ai/SpeakProbability.ts        — events may trigger speak response
// - src/ai/MessageGenerator.ts        — event-triggered messages
// - src/engine/NightEchoEngine.ts     — produces events that feed into reactions
// - src/engine/AIEngine.ts            — calls reactToEvent(playerId, event)

// TODO(HIGH): Implement reactToEvent(playerId, event) — process event for AI player
// TODO: Implement calculateImpact(event, personality) — weight × reactivity
// TODO: Implement applyToRelationships(playerId, event, impact) — update suspicion
// TODO: Implement shouldReactPublicly(personality, impact) — speak trigger check
// TODO: Implement getEventContext(event) — extract relevant player from event
// TODO: Implement storeEventMemory(playerId, event) — add to events_witnessed[]

// TODO(REVIEW): Should event reactions be immediate or delayed by a few messages?
// TODO(LOW): Add event-specific reaction templates for more varied responses
