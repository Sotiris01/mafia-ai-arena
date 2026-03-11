import {
  generateMessage,
  selectMessageType,
  selectTarget,
  getIntensity,
} from "../../src/ai/MessageGenerator";
import type { FilteredMemory } from "../../src/ai/PerceptionFilter";
import type { PlayerPersonality } from "../../src/types/personality.types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/ai/PerceptionFilter");
jest.mock("../../src/ai/providers/AIProviderFactory");
jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/ChatState");
jest.mock("../../src/state/GameState");
jest.mock("../../src/utils/probability");

import * as PerceptionFilter from "../../src/ai/PerceptionFilter";
import * as AIProviderFactory from "../../src/ai/providers/AIProviderFactory";
import * as PlayerState from "../../src/state/PlayerState";
import * as ChatState from "../../src/state/ChatState";
import * as GameState from "../../src/state/GameState";
import * as probability from "../../src/utils/probability";

const mockedFilter = PerceptionFilter as jest.Mocked<typeof PerceptionFilter>;
const mockedFactory = AIProviderFactory as jest.Mocked<typeof AIProviderFactory>;
const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedProbability = probability as jest.Mocked<typeof probability>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFiltered(overrides: Partial<FilteredMemory> = {}): FilteredMemory {
  return {
    playerId: "ai_1",
    relationships: {},
    knownRoles: {},
    recentEvents: [],
    contradictions: [],
    coordinatedVoters: [],
    ...overrides,
  };
}

const defaultPersonality: PlayerPersonality = {
  type: "Logical",
  perception_depth: 2,
  speak_probability_base: 0.5,
  aggression: 0.5,
  emotional_reactivity: 0.5,
  deception_skill: 0.5,
  consistency: 0.7,
  leadership: 0.5,
  vote_threshold: 0.3,
  bandwagon_tendency: 0.3,
  voting_style: "mid",
} as any;

const defaultPlayer = {
  player_id: "ai_1",
  player_name: "Bot 1",
  role: "Citizen",
  alignment: "Town",
  is_alive: true,
  is_zombie: false,
  is_revealed_mayor: false,
} as any;

beforeEach(() => {
  jest.clearAllMocks();

  mockedPlayerState.getPlayer.mockReturnValue(defaultPlayer);
  mockedPlayerState.getPersonality.mockReturnValue(defaultPersonality);
  mockedGameState.getState.mockReturnValue({
    day: 2,
    alive_player_ids: ["human", "ai_1", "ai_2", "ai_3"],
  } as any);
  mockedChatState.getEventsByDay.mockReturnValue([]);
  mockedFilter.getFilteredMemory.mockReturnValue(makeFiltered());
  mockedProbability.randomElement.mockImplementation((arr: any[]) => arr[0]);
  mockedProbability.rollProbability.mockReturnValue(false);

  const mockProvider = {
    type: "template" as const,
    generateMessage: jest.fn().mockResolvedValue("Test message text"),
    analyzeMessage: jest.fn(),
    isAvailable: jest.fn().mockReturnValue(true),
  };
  mockedFactory.getProvider.mockReturnValue(mockProvider as any);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MessageGenerator", () => {
  describe("generateMessage", () => {
    it("returns a Message with correct fields", async () => {
      const msg = await generateMessage("ai_1");

      expect(msg.sender_id).toBe("ai_1");
      expect(msg.sender_name).toBe("Bot 1");
      expect(msg.text).toBe("Test message text");
      expect(msg.channel).toBe("public");
      expect(msg.is_human).toBe(false);
      expect(msg.id).toMatch(/^msg_/);
      expect(typeof msg.timestamp).toBe("number");
    });

    it("calls the AI provider to generate text", async () => {
      await generateMessage("ai_1");

      const provider = mockedFactory.getProvider();
      expect(provider.generateMessage).toHaveBeenCalledTimes(1);
      expect(provider.generateMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.any(String),
          personality: "Logical",
          intensity: expect.any(String),
        }),
      );
    });
  });

  describe("selectMessageType", () => {
    it("returns defend when recently accused and consistency >= aggression", () => {
      mockedChatState.getEventsByDay.mockReturnValue([
        {
          message_id: 1, speaker: "ai_2", action: "accuse", target: "ai_1",
          weight: 1, day: 2, raw_text: "ai_1 is mafia", indirect_targets: [],
        },
      ]);

      const personality = { ...defaultPersonality, consistency: 0.8, aggression: 0.3 } as any;
      const result = selectMessageType("ai_1", defaultPlayer, personality, makeFiltered());
      expect(result).toBe("defend");
    });

    it("returns deflect when recently accused and aggression > consistency", () => {
      mockedChatState.getEventsByDay.mockReturnValue([
        {
          message_id: 1, speaker: "ai_2", action: "accuse", target: "ai_1",
          weight: 1, day: 2, raw_text: "ai_1 is guilty", indirect_targets: [],
        },
      ]);

      const personality = { ...defaultPersonality, consistency: 0.2, aggression: 0.9 } as any;
      const result = selectMessageType("ai_1", defaultPlayer, personality, makeFiltered());
      expect(result).toBe("deflect");
    });

    it("returns accuse when suspicious relationship exists", () => {
      const filtered = makeFiltered({
        relationships: {
          ai_2: { trust: 0, suspicion: 0.8, interaction_count: 3, last_interaction_day: 2, history: [] },
        },
      });

      const result = selectMessageType("ai_1", defaultPlayer, defaultPersonality, filtered);
      expect(result).toBe("accuse");
    });

    it("returns question as default when no triggers are present", () => {
      const result = selectMessageType("ai_1", defaultPlayer, defaultPersonality, makeFiltered());
      expect(result).toBe("question");
    });

    it("Mafia player gets Mafia-specific message type", () => {
      const mafiaPlayer = { ...defaultPlayer, alignment: "Mafia", role: "Mafia Goon" } as any;
      mockedPlayerState.getPlayer.mockReturnValue(mafiaPlayer);

      const result = selectMessageType("ai_1", mafiaPlayer, defaultPersonality, makeFiltered());
      expect(["accuse", "agree", "question", "deflect"]).toContain(result);
    });
  });

  describe("selectTarget", () => {
    it("accuse: picks most suspicious player", () => {
      const filtered = makeFiltered({
        relationships: {
          ai_2: { trust: 0, suspicion: 0.9, interaction_count: 3, last_interaction_day: 2, history: [] },
          ai_3: { trust: 0, suspicion: 0.2, interaction_count: 1, last_interaction_day: 2, history: [] },
        },
      });

      const target = selectTarget("ai_1", "accuse", defaultPlayer, filtered);
      expect(target).toBe("ai_2");
    });

    it("defend: picks most trusted player or self", () => {
      const filtered = makeFiltered({
        relationships: {
          ai_3: { trust: 0.9, suspicion: 0, interaction_count: 2, last_interaction_day: 2, history: [] },
        },
      });

      const target = selectTarget("ai_1", "defend", defaultPlayer, filtered);
      expect(target).toBe("ai_3");
    });

    it("claim: returns empty string (no target)", () => {
      const target = selectTarget("ai_1", "claim", defaultPlayer, makeFiltered());
      expect(target).toBe("");
    });

    it("question: returns empty string", () => {
      const target = selectTarget("ai_1", "question", defaultPlayer, makeFiltered());
      expect(target).toBe("");
    });

    it("accuse: Mafia doesn't accuse Mafia allies", () => {
      const mafiaPlayer = { ...defaultPlayer, alignment: "Mafia" } as any;
      const filtered = makeFiltered({
        relationships: {
          ai_2: { trust: 0, suspicion: 0.9, interaction_count: 3, last_interaction_day: 2, history: [] },
        },
      });

      // ai_2 is Mafia ally
      mockedPlayerState.getPlayer
        .mockReturnValueOnce(mafiaPlayer) // for the caller
        .mockReturnValueOnce({ ...defaultPlayer, player_id: "ai_2", alignment: "Mafia" } as any); // target check

      const target = selectTarget("ai_1", "accuse", mafiaPlayer, filtered);
      // Should not target the Mafia ally — either picks ai_3 (Town) or empty
      expect(target).not.toBe("ai_2");
    });
  });

  describe("getIntensity", () => {
    it("returns high for high aggression", () => {
      const personality = { ...defaultPersonality, aggression: 0.8 } as any;
      expect(getIntensity(personality, "accuse", makeFiltered())).toBe("high");
    });

    it("returns medium for moderate aggression", () => {
      const personality = { ...defaultPersonality, aggression: 0.5 } as any;
      expect(getIntensity(personality, "accuse", makeFiltered())).toBe("medium");
    });

    it("returns low for low aggression", () => {
      const personality = { ...defaultPersonality, aggression: 0.2 } as any;
      expect(getIntensity(personality, "accuse", makeFiltered())).toBe("low");
    });

    it("returns high for defensive messages when contradictions exist", () => {
      const personality = { ...defaultPersonality, aggression: 0.2 } as any;
      const filtered = makeFiltered({
        contradictions: [{ playerId: "ai_2", description: "test", day: 2 }],
      });
      expect(getIntensity(personality, "defend", filtered)).toBe("high");
    });
  });
});
