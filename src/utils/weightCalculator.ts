// =============================================================================
// FILE: weightCalculator.ts
// PURPOSE: Weight math — time decay (r=0.85), indirect weight modifiers
// LOCATION: src/utils/weightCalculator.ts
// =============================================================================

// TODO(APPROACH): Pure math functions for the memory weight system.
// Weights represent relationship strength and decay over time.
//
// Key formulas:
//   - Time decay: new_weight = weight × r  (r = 0.85, applied each day)
//   - Direct weight: 1.0 × raw_weight
//   - Indirect accusation: 0.3 × raw_weight
//   - Indirect defense: 0.4 × raw_weight
//   - Combined score: trust + suspicion (for voting decisions)
//
// Collaborating files:
// - src/state/MemoryManager.ts        — calls applyDecay(), calculateWeight()
// - src/engine/ChatAnalyzer.ts        — calls calculateIndirectWeight()
// - src/data/config.json              — decay_factor (0.85), indirect multipliers
// - src/types/memory.types.ts         — Relationship (trust, suspicion fields)
// - src/ai/VoteDecision.ts            — uses combined score for suspicion

// TODO(HIGH): Implement applyDecay(weight, decayFactor) — return decayed weight
// TODO(HIGH): Implement calculateDirectWeight(rawWeight) — 1.0 × raw
// TODO: Implement calculateIndirectWeight(rawWeight, type) — 0.3 or 0.4 × raw
// TODO: Implement combineScore(trust, suspicion) — weighted combination
// TODO: Implement applyEmotionalModifier(weight, reactivity) — personality effect
// TODO: Implement normalizeWeight(weight, min, max) — clamp to valid range

// TODO(LOW): Add weight visualization helper for debugging
