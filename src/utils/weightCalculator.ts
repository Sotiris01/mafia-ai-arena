// =============================================================================
// FILE: weightCalculator.ts
// PURPOSE: Weight math — time decay (r=0.85), indirect weight modifiers
// LOCATION: src/utils/weightCalculator.ts
// =============================================================================

/** Time decay: new_weight = weight × decayFactor (applied each day) */
export function applyDecay(weight: number, decayFactor: number): number {
  return weight * decayFactor;
}

/** Direct weight: 1.0 × raw */
export function calculateDirectWeight(rawWeight: number): number {
  return rawWeight;
}

/**
 * Indirect weight using modifier from config.json:
 *   accuse → ai.indirect_weight_accuse (0.4)
 *   defend → ai.indirect_weight_defend (0.3)
 */
export function calculateIndirectWeight(
  rawWeight: number,
  modifier: number
): number {
  return modifier * rawWeight;
}

/** Combined score for voting decisions */
export function combineScore(trust: number, suspicion: number): number {
  return trust + suspicion;
}

/** Apply emotional reactivity modifier to a weight */
export function applyEmotionalModifier(
  weight: number,
  reactivity: number
): number {
  return weight * reactivity;
}

/** Clamp weight to [min, max] range */
export function normalizeWeight(
  weight: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(weight, min), max);
}

// TODO(LOW): Add weight visualization helper for debugging
