// =============================================================================
// FILE: probability.ts
// PURPOSE: Random + probability helpers — weighted selection, probability rolls
// LOCATION: src/utils/probability.ts
// =============================================================================

// TODO(APPROACH): Pure utility functions for probability calculations.
// No game logic — just math. Used across engine, AI, and hooks layers.
//
// Key functions:
//   - rollProbability(chance) — true/false based on 0–1 probability
//   - weightedRandom(items, weights) — select item by weight
//   - shuffleArray(arr) — Fisher-Yates shuffle
//   - clamp(value, min, max) — clamp number to range
//   - randomInt(min, max) — random integer in range
//   - randomElement(arr) — random element from array
//
// Collaborating files:
// - src/engine/NightEchoEngine.ts     — weightedRandom for event selection
// - src/engine/LastWishEngine.ts      — rollProbability (40% chance)
// - src/engine/FullMoonEngine.ts      — rollProbability (15% per night)
// - src/ai/SpeakProbability.ts        — rollProbability for speak chance
// - src/ai/providers/TemplateProvider.ts — randomElement for template selection

// TODO(HIGH): Implement rollProbability(chance: number) — return boolean
// TODO(HIGH): Implement weightedRandom<T>(items: T[], weights: number[]) — return T
// TODO: Implement shuffleArray<T>(arr: T[]) — in-place Fisher-Yates
// TODO: Implement clamp(value, min, max) — constrain to range
// TODO: Implement randomInt(min, max) — inclusive random integer
// TODO: Implement randomElement<T>(arr: T[]) — random item from array

// TODO(LOW): Consider using a seeded PRNG for reproducible games (testing)
