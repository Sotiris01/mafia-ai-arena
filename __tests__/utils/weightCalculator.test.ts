import {
  applyDecay,
  calculateDirectWeight,
  calculateIndirectWeight,
  combineScore,
  applyEmotionalModifier,
  normalizeWeight,
} from "../../src/utils/weightCalculator";

describe("weightCalculator", () => {
  describe("applyDecay", () => {
    it("decays weight by factor", () => {
      expect(applyDecay(1.0, 0.7)).toBeCloseTo(0.7);
    });

    it("decays to zero with factor 0", () => {
      expect(applyDecay(5.0, 0)).toBe(0);
    });

    it("preserves weight with factor 1", () => {
      expect(applyDecay(3.5, 1)).toBe(3.5);
    });

    it("applies cumulatively", () => {
      let w = 1.0;
      w = applyDecay(w, 0.7);
      w = applyDecay(w, 0.7);
      expect(w).toBeCloseTo(0.49); // 1.0 × 0.7 × 0.7
    });
  });

  describe("calculateDirectWeight", () => {
    it("returns raw weight as-is (×1.0)", () => {
      expect(calculateDirectWeight(0.8)).toBe(0.8);
      expect(calculateDirectWeight(0)).toBe(0);
      expect(calculateDirectWeight(-0.5)).toBe(-0.5);
    });
  });

  describe("calculateIndirectWeight", () => {
    it("applies modifier to raw weight", () => {
      // accuse modifier = 0.4
      expect(calculateIndirectWeight(1.0, 0.4)).toBeCloseTo(0.4);
    });

    it("applies defend modifier", () => {
      // defend modifier = 0.3
      expect(calculateIndirectWeight(1.0, 0.3)).toBeCloseTo(0.3);
    });

    it("returns 0 when modifier is 0", () => {
      expect(calculateIndirectWeight(5.0, 0)).toBe(0);
    });
  });

  describe("combineScore", () => {
    it("sums trust and suspicion", () => {
      expect(combineScore(0.5, 0.3)).toBeCloseTo(0.8);
    });

    it("handles negative values", () => {
      expect(combineScore(-0.5, 0.3)).toBeCloseTo(-0.2);
    });

    it("returns 0 for zero inputs", () => {
      expect(combineScore(0, 0)).toBe(0);
    });
  });

  describe("applyEmotionalModifier", () => {
    it("amplifies weight with high reactivity", () => {
      // Paranoid: emotional_reactivity = 1.60
      expect(applyEmotionalModifier(1.0, 1.6)).toBeCloseTo(1.6);
    });

    it("dampens weight with low reactivity", () => {
      // Logical: emotional_reactivity = 0.50
      expect(applyEmotionalModifier(1.0, 0.5)).toBeCloseTo(0.5);
    });

    it("returns 0 when weight is 0", () => {
      expect(applyEmotionalModifier(0, 1.5)).toBe(0);
    });
  });

  describe("normalizeWeight", () => {
    it("clamps to max when above", () => {
      expect(normalizeWeight(1.5, -1, 1)).toBe(1);
    });

    it("clamps to min when below", () => {
      expect(normalizeWeight(-2.0, -1, 1)).toBe(-1);
    });

    it("passes through when within range", () => {
      expect(normalizeWeight(0.5, -1, 1)).toBe(0.5);
    });

    it("handles edge at min", () => {
      expect(normalizeWeight(-1, -1, 1)).toBe(-1);
    });

    it("handles edge at max", () => {
      expect(normalizeWeight(1, -1, 1)).toBe(1);
    });
  });
});
