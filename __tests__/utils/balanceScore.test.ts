import {
  calculateRatio,
  getImbalance,
  mapToStage,
  getLosingFaction,
} from "../../src/utils/balanceScore";

describe("balanceScore", () => {
  describe("calculateRatio", () => {
    it("returns correct ratio for normal game", () => {
      // 6 town, 10 total → 0.6
      expect(calculateRatio(6, 10)).toBeCloseTo(0.6);
    });

    it("returns 1 when all players are town", () => {
      expect(calculateRatio(5, 5)).toBe(1);
    });

    it("returns 0 when no town alive", () => {
      expect(calculateRatio(0, 5)).toBe(0);
    });

    it("returns 0 when no players alive", () => {
      expect(calculateRatio(0, 0)).toBe(0);
    });
  });

  describe("getImbalance", () => {
    it("returns 0 for perfectly balanced ratio", () => {
      expect(getImbalance(0.6, 0.6)).toBe(0);
    });

    it("returns positive value for any imbalance direction", () => {
      expect(getImbalance(0.8, 0.6)).toBeCloseTo(0.2);
      expect(getImbalance(0.4, 0.6)).toBeCloseTo(0.2);
    });
  });

  describe("mapToStage", () => {
    const thresholds = { stage_1: 0.05, stage_2: 0.15 };

    it("returns Stage 0 when balanced (imbalance < stage_1)", () => {
      expect(mapToStage(0.03, thresholds)).toBe(0);
    });

    it("returns Stage 1 for moderate imbalance", () => {
      expect(mapToStage(0.10, thresholds)).toBe(1);
    });

    it("returns Stage 2 for major imbalance", () => {
      expect(mapToStage(0.20, thresholds)).toBe(2);
    });

    it("returns Stage 1 at exact stage_1 threshold", () => {
      expect(mapToStage(0.05, thresholds)).toBe(1);
    });

    it("returns Stage 2 at exact stage_2 threshold", () => {
      expect(mapToStage(0.15, thresholds)).toBe(2);
    });

    it("returns Stage 0 for zero imbalance", () => {
      expect(mapToStage(0, thresholds)).toBe(0);
    });
  });

  describe("getLosingFaction", () => {
    it("returns Mafia when score > 0 (Town overpowers)", () => {
      expect(getLosingFaction(0.5)).toBe("Mafia");
    });

    it("returns Town when score < 0 (Mafia overpowers)", () => {
      expect(getLosingFaction(-0.3)).toBe("Town");
    });

    it("returns Town when score is 0 (tie → Town is 'losing')", () => {
      expect(getLosingFaction(0)).toBe("Town");
    });
  });
});
