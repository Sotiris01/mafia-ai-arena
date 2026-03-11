import { TemplateProvider } from "../../../src/ai/providers/TemplateProvider";
import type { MessageContext } from "../../../src/ai/providers/AITextProvider";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../../src/utils/probability", () => ({
  randomElement: (arr: any[]) => arr[0],
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TemplateProvider", () => {
  let provider: TemplateProvider;

  beforeEach(() => {
    provider = new TemplateProvider();
  });

  describe("type", () => {
    it('has type "template"', () => {
      expect(provider.type).toBe("template");
    });
  });

  describe("isAvailable", () => {
    it("always returns true", () => {
      expect(provider.isAvailable()).toBe(true);
    });
  });

  describe("generateMessage", () => {
    it("returns a non-empty string", async () => {
      const context: MessageContext = {
        action: "accuse",
        personality: "Logical",
        intensity: "medium",
        targetName: "Alice",
      };

      const result = await provider.generateMessage(context);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("substitutes {player} placeholder with target name", async () => {
      const context: MessageContext = {
        action: "accuse",
        personality: "Logical",
        intensity: "medium",
        targetName: "Bob",
      };

      const result = await provider.generateMessage(context);
      // If template contains {player}, it should be replaced
      expect(result).not.toContain("{player}");
    });

    it("handles missing target name gracefully", async () => {
      const context: MessageContext = {
        action: "question",
        personality: "Logical",
        intensity: "low",
        targetName: "",
      };

      const result = await provider.generateMessage(context);
      expect(typeof result).toBe("string");
    });

    it("falls back for unknown action type", async () => {
      const context: MessageContext = {
        action: "nonexistent" as any,
        personality: "Logical",
        intensity: "medium",
        targetName: "Eve",
      };

      // Should use fallback template instead of crashing
      const result = await provider.generateMessage(context);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("falls back for unknown personality", async () => {
      const context: MessageContext = {
        action: "accuse",
        personality: "Unknown" as any,
        intensity: "medium",
        targetName: "Eve",
      };

      const result = await provider.generateMessage(context);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("works for all standard action types", async () => {
      const actions = ["accuse", "defend", "agree", "disagree", "claim", "question", "deflect"] as const;
      for (const action of actions) {
        const context: MessageContext = {
          action,
          personality: "Logical",
          intensity: "medium",
          targetName: "TestPlayer",
        };
        const result = await provider.generateMessage(context);
        expect(typeof result).toBe("string");
      }
    });
  });

  describe("analyzeMessage", () => {
    it("returns a ChatEvent with action classification", async () => {
      const event = await provider.analyzeMessage(
        "I think ai_2 is very suspicious and guilty",
        "ai_1",
        2,
      );

      expect(event.speaker).toBe("ai_1");
      expect(event.day).toBe(2);
      expect(event.action).toBe("accuse");
      expect(typeof event.weight).toBe("number");
    });

    it("classifies defend keywords", async () => {
      const event = await provider.analyzeMessage(
        "I trust this player, they are innocent",
        "ai_1",
        2,
      );
      expect(event.action).toBe("defend");
    });

    it("classifies agree keywords", async () => {
      const event = await provider.analyzeMessage(
        "I agree, that's exactly right",
        "ai_1",
        2,
      );
      expect(event.action).toBe("agree");
    });

    it("classifies question keywords", async () => {
      const event = await provider.analyzeMessage(
        "Why did you do that? Please explain",
        "ai_1",
        2,
      );
      expect(event.action).toBe("question");
    });

    it("defaults to question for unclassified text", async () => {
      const event = await provider.analyzeMessage(
        "hello how is everyone doing",
        "ai_1",
        2,
      );
      expect(event.action).toBe("question");
    });

    it("assigns correct weight by action type", async () => {
      const accuseEvent = await provider.analyzeMessage("you are guilty mafia", "ai_1", 2);
      const questionEvent = await provider.analyzeMessage("hello again", "ai_1", 2);

      expect(accuseEvent.weight).toBeGreaterThan(questionEvent.weight);
    });
  });
});
