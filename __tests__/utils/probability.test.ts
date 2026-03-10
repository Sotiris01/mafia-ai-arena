import {
  rollProbability,
  weightedRandom,
  shuffleArray,
  clamp,
  randomInt,
  randomElement,
} from "../../src/utils/probability";

describe("probability", () => {
  describe("rollProbability", () => {
    it("returns true when chance is 1", () => {
      expect(rollProbability(1)).toBe(true);
    });

    it("returns false when chance is 0", () => {
      expect(rollProbability(0)).toBe(false);
    });

    it("returns boolean for valid probability", () => {
      const result = rollProbability(0.5);
      expect(typeof result).toBe("boolean");
    });
  });

  describe("weightedRandom", () => {
    it("returns the only item when given one item", () => {
      const result = weightedRandom(["a"], [1]);
      expect(result).toBe("a");
    });

    it("returns item with all weight concentrated on it", () => {
      // Give all weight to "b"
      const result = weightedRandom(["a", "b", "c"], [0, 1, 0]);
      expect(result).toBe("b");
    });

    it("returns a valid item from the list", () => {
      const items = ["x", "y", "z"];
      const result = weightedRandom(items, [1, 1, 1]);
      expect(items).toContain(result);
    });

    it("respects weight distribution over many samples", () => {
      const counts = { a: 0, b: 0 };
      for (let i = 0; i < 1000; i++) {
        const r = weightedRandom(["a", "b"], [9, 1]) as "a" | "b";
        counts[r]++;
      }
      // "a" should appear significantly more often (weight 9:1)
      expect(counts.a).toBeGreaterThan(counts.b * 3);
    });
  });

  describe("shuffleArray", () => {
    it("returns array of same length", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffleArray([...arr]);
      expect(result).toHaveLength(arr.length);
    });

    it("contains all original elements", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffleArray([...arr]);
      expect(result.sort()).toEqual(arr.sort());
    });

    it("mutates the original array (in-place shuffle)", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffleArray(arr);
      expect(result).toBe(arr); // same reference
    });

    it("handles empty array", () => {
      expect(shuffleArray([])).toEqual([]);
    });

    it("handles single element", () => {
      expect(shuffleArray([42])).toEqual([42]);
    });
  });

  describe("clamp", () => {
    it("returns value when within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it("clamps to min when below", () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it("clamps to max when above", () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it("returns min when value equals min", () => {
      expect(clamp(0, 0, 10)).toBe(0);
    });

    it("returns max when value equals max", () => {
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe("randomInt", () => {
    it("returns integer within bounds (inclusive)", () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 5);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(5);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it("returns the value when min equals max", () => {
      expect(randomInt(3, 3)).toBe(3);
    });
  });

  describe("randomElement", () => {
    it("returns element from the array", () => {
      const arr = ["a", "b", "c"];
      for (let i = 0; i < 50; i++) {
        expect(arr).toContain(randomElement(arr));
      }
    });

    it("returns the only element from single-item array", () => {
      expect(randomElement([99])).toBe(99);
    });
  });
});
