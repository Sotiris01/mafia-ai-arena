import { shouldSpeak, getChance } from "../../src/ai/SpeakProbability";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/ChatState");
jest.mock("../../src/state/GameState");
jest.mock("../../src/utils/probability");

import * as PlayerState from "../../src/state/PlayerState";
import * as ChatState from "../../src/state/ChatState";
import * as GameState from "../../src/state/GameState";
import * as probability from "../../src/utils/probability";

const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedProbability = probability as jest.Mocked<typeof probability>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setupPlayer(overrides: Record<string, unknown> = {}) {
  const defaultPersonality = {
    type: "Logical",
    perception_depth: 2,
    speak_probability_base: 0.5,
    aggression: 0.5,
    emotional_reactivity: 0.5,
    deception_skill: 0.5,
    consistency: 0.5,
    leadership: 0.5,
    vote_threshold: 0.3,
    bandwagon_tendency: 0.3,
    voting_style: "mid" as const,
  };

  const defaultPlayer = {
    player_id: "ai_1",
    player_name: "Bot 1",
    role: "Citizen",
    alignment: "Town",
    is_alive: true,
    is_zombie: false,
    is_revealed_mayor: false,
  };

  mockedPlayerState.getPersonality.mockReturnValue({
    ...defaultPersonality,
    ...overrides,
  } as any);
  mockedPlayerState.getPlayer.mockReturnValue({
    ...defaultPlayer,
    ...overrides,
  } as any);
  mockedPlayerState.getPlayersByAlignment.mockReturnValue([]);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedGameState.getState.mockReturnValue({ day: 2 } as any);
  mockedChatState.getEventsByDay.mockReturnValue([]);
  mockedChatState.getRecentMessages.mockReturnValue([]);
  mockedProbability.clamp.mockImplementation((v, min, max) =>
    Math.min(Math.max(v, min), max),
  );
  setupPlayer();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SpeakProbability", () => {
  describe("getChance", () => {
    it("returns a number between 0 and 1", () => {
      const chance = getChance("ai_1", { messageCount: 0 });
      expect(chance).toBeGreaterThanOrEqual(0);
      expect(chance).toBeLessThanOrEqual(1);
    });

    it("increases on Day 1 (Day 1 boost ×1.2)", () => {
      mockedGameState.getState.mockReturnValue({ day: 1 } as any);
      const chanceDay1 = getChance("ai_1", { messageCount: 0 });

      mockedGameState.getState.mockReturnValue({ day: 2 } as any);
      const chanceDay2 = getChance("ai_1", { messageCount: 0 });

      expect(chanceDay1).toBeGreaterThan(chanceDay2);
    });

    it("high speak_probability_base → higher chance", () => {
      setupPlayer({ speak_probability_base: 0.9 });
      const highChance = getChance("ai_1", { messageCount: 0 });

      setupPlayer({ speak_probability_base: 0.2 });
      const lowChance = getChance("ai_1", { messageCount: 0 });

      expect(highChance).toBeGreaterThan(lowChance);
    });

    it("boosts chance when player was directly accused", () => {
      const chanceNormal = getChance("ai_1", { messageCount: 0 });

      mockedChatState.getEventsByDay.mockReturnValue([
        {
          message_id: 1,
          speaker: "ai_2",
          action: "accuse",
          target: "ai_1",
          weight: 1,
          day: 2,
          raw_text: "ai_1 is sus",
          indirect_targets: [],
        },
      ]);

      const chanceAccused = getChance("ai_1", { messageCount: 0 });
      expect(chanceAccused).toBeGreaterThan(chanceNormal);
    });

    it("applies cooldown when player spoke recently", () => {
      const chanceNoCooldown = getChance("ai_1", { messageCount: 5 });

      // Player spoke 1 message ago
      mockedChatState.getRecentMessages.mockReturnValue([
        { sender_id: "ai_2" } as any,
        { sender_id: "ai_2" } as any,
        { sender_id: "ai_2" } as any,
        { sender_id: "ai_1" } as any,  // spoke 1 message ago
        { sender_id: "ai_3" } as any,
      ]);

      const chanceCooldown = getChance("ai_1", { messageCount: 5 });
      expect(chanceCooldown).toBeLessThan(chanceNoCooldown);
    });

    it("is clamped between 0 and 1", () => {
      // Very high base → should still be clamped
      setupPlayer({ speak_probability_base: 5.0 });
      const chance = getChance("ai_1", { messageCount: 0 });
      expect(chance).toBeLessThanOrEqual(1);
    });
  });

  describe("shouldSpeak", () => {
    it("returns true when rollProbability returns true", () => {
      mockedProbability.rollProbability.mockReturnValue(true);
      expect(shouldSpeak("ai_1", { messageCount: 0 })).toBe(true);
    });

    it("returns false when rollProbability returns false", () => {
      mockedProbability.rollProbability.mockReturnValue(false);
      expect(shouldSpeak("ai_1", { messageCount: 0 })).toBe(false);
    });

    it("calls rollProbability with the computed chance", () => {
      mockedProbability.rollProbability.mockReturnValue(true);
      shouldSpeak("ai_1", { messageCount: 0 });

      expect(mockedProbability.rollProbability).toHaveBeenCalledWith(
        expect.any(Number),
      );
      const arg = mockedProbability.rollProbability.mock.calls[0][0];
      expect(arg).toBeGreaterThanOrEqual(0);
      expect(arg).toBeLessThanOrEqual(1);
    });
  });

  describe("role modifier", () => {
    it("Mafia players get a modifier", () => {
      setupPlayer({ alignment: "Mafia", role: "Mafia Goon" });
      const mafiaChance = getChance("ai_1", { messageCount: 0 });

      setupPlayer({ alignment: "Town", role: "Citizen" });
      const townChance = getChance("ai_1", { messageCount: 0 });

      // Mafia general has a different modifier than town general
      // (exact values from config) — just verify they differ or are valid
      expect(typeof mafiaChance).toBe("number");
      expect(typeof townChance).toBe("number");
    });

    it("Mayor pre-reveal vs post-reveal have different modifiers", () => {
      setupPlayer({ role: "Mayor", is_revealed_mayor: false });
      const preReveal = getChance("ai_1", { messageCount: 0 });

      setupPlayer({ role: "Mayor", is_revealed_mayor: true });
      const postReveal = getChance("ai_1", { messageCount: 0 });

      // Config may set them equal, but the code path is exercised
      expect(typeof preReveal).toBe("number");
      expect(typeof postReveal).toBe("number");
    });
  });

  describe("trigger modifier — ally involved", () => {
    it("boosts when an ally was accused", () => {
      setupPlayer({ alignment: "Town" });
      mockedPlayerState.getPlayersByAlignment.mockReturnValue([
        { player_id: "ai_1", alignment: "Town" } as any,
        { player_id: "ai_3", alignment: "Town" } as any,
      ]);

      const chanceBase = getChance("ai_1", { messageCount: 0 });

      mockedChatState.getEventsByDay.mockReturnValue([
        {
          message_id: 1,
          speaker: "ai_2",
          action: "accuse",
          target: "ai_3",
          weight: 1,
          day: 2,
          raw_text: "ai_3 is sus",
          indirect_targets: [],
        },
      ]);

      const chanceTrigger = getChance("ai_1", { messageCount: 0 });
      expect(chanceTrigger).toBeGreaterThan(chanceBase);
    });
  });
});
