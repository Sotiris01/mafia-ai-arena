import {
  getProvider,
  setPreferredProvider,
  getProviderStatus,
  resetProvider,
} from "../../../src/ai/providers/AIProviderFactory";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetProvider();
});

describe("AIProviderFactory", () => {
  describe("getProvider", () => {
    it("returns a provider with type property", () => {
      const provider = getProvider();
      expect(provider.type).toBeDefined();
    });

    it("returns a provider that is available", () => {
      const provider = getProvider();
      expect(provider.isAvailable()).toBe(true);
    });

    it("returns a provider that can generate messages", async () => {
      const provider = getProvider();
      const text = await provider.generateMessage({
        action: "accuse",
        personality: "Logical",
        intensity: "medium",
        targetName: "TestPlayer",
      });
      expect(typeof text).toBe("string");
      expect(text.length).toBeGreaterThan(0);
    });

    it("returns a provider that can analyze messages", async () => {
      const provider = getProvider();
      const event = await provider.analyzeMessage(
        "I think this player is suspicious",
        "ai_1",
        1,
      );
      expect(event).toBeDefined();
      expect(event.speaker).toBe("ai_1");
      expect(event.day).toBe(1);
    });

    it("caches the provider (returns same instance)", () => {
      const provider1 = getProvider();
      const provider2 = getProvider();
      expect(provider1).toBe(provider2);
    });

    it("rebuilds provider after resetProvider()", () => {
      const provider1 = getProvider();
      resetProvider();
      const provider2 = getProvider();
      expect(provider1).not.toBe(provider2);
    });
  });

  describe("setPreferredProvider", () => {
    it("clears cache so next getProvider rebuilds", () => {
      const provider1 = getProvider();
      setPreferredProvider("template");
      const provider2 = getProvider();
      expect(provider1).not.toBe(provider2);
    });
  });

  describe("getProviderStatus", () => {
    it("returns template as available", () => {
      const status = getProviderStatus();
      expect(status.template).toBe(true);
    });

    it("returns gemma_api as unavailable (Phase 6 not implemented)", () => {
      const status = getProviderStatus();
      expect(status.gemma_api).toBe(false);
    });

    it("returns gemma_local as unavailable (Phase 7 not implemented)", () => {
      const status = getProviderStatus();
      expect(status.gemma_local).toBe(false);
    });
  });

  describe("FallbackProvider", () => {
    it("falls back to TemplateProvider when generating", async () => {
      // Currently only TemplateProvider is in chain — test that it works
      const provider = getProvider();
      const text = await provider.generateMessage({
        action: "defend",
        personality: "Cautious",
        intensity: "high",
        targetName: "Alice",
      });
      expect(typeof text).toBe("string");
    });

    it("falls back to TemplateProvider when analyzing", async () => {
      const provider = getProvider();
      const event = await provider.analyzeMessage(
        "I defend Alice, she is innocent",
        "ai_1",
        2,
      );
      expect(event.action).toBe("defend");
    });
  });
});
