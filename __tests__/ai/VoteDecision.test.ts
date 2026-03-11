import {
  decideVote,
  getVoteTiming,
  calculateSuspicionScores,
  applyRoleOverrides,
  applyBandwagonEffect,
  shouldAbstain,
  getMafiaAllyIds,
} from "../../src/ai/VoteDecision";
import type { FilteredMemory } from "../../src/ai/PerceptionFilter";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/ai/PerceptionFilter");
jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/GameState");
jest.mock("../../src/state/ChatState");

import * as PerceptionFilter from "../../src/ai/PerceptionFilter";
import * as PlayerState from "../../src/state/PlayerState";
import * as GameState from "../../src/state/GameState";
import * as ChatState from "../../src/state/ChatState";

const mockedFilter = PerceptionFilter as jest.Mocked<typeof PerceptionFilter>;
const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFilteredMemory(overrides: Partial<FilteredMemory> = {}): FilteredMemory {
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

function setupDefaultMocks() {
  mockedPlayerState.getPlayer.mockReturnValue({
    player_id: "ai_1",
    player_name: "Bot 1",
    role: "Citizen",
    alignment: "Town",
    is_alive: true,
    is_zombie: false,
  } as any);

  mockedPlayerState.getPersonality.mockReturnValue({
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
  } as any);

  mockedGameState.getState.mockReturnValue({
    day: 2,
    alive_player_ids: ["human", "ai_1", "ai_2", "ai_3", "ai_4"],
  } as any);

  mockedChatState.getEventsByDay.mockReturnValue([]);

  mockedFilter.getFilteredMemory.mockReturnValue(makeFilteredMemory());
}

beforeEach(() => {
  jest.clearAllMocks();
  setupDefaultMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("VoteDecision", () => {
  describe("calculateSuspicionScores", () => {
    it("returns 0 for players with no relationship data", () => {
      const memory = makeFilteredMemory();
      const scores = calculateSuspicionScores(memory, ["ai_2", "ai_3"]);
      expect(scores.get("ai_2")).toBe(0);
      expect(scores.get("ai_3")).toBe(0);
    });

    it("scores = suspicion - trust from relationships", () => {
      const memory = makeFilteredMemory({
        relationships: {
          ai_2: { trust: 0.2, suspicion: 0.8, interaction_count: 3, last_interaction_day: 2, history: [] },
        },
      });
      const scores = calculateSuspicionScores(memory, ["ai_2"]);
      expect(scores.get("ai_2")).toBeCloseTo(0.6);
    });

    it("boosts score when target is known Mafia", () => {
      const memory = makeFilteredMemory({
        knownRoles: {
          ai_2: { role: "Godfather", confidence: 1, source: "investigation" },
        },
      });
      const scores = calculateSuspicionScores(memory, ["ai_2"]);
      expect(scores.get("ai_2")!).toBeGreaterThan(0);
    });

    it("boosts score for contradiction targets", () => {
      const memory = makeFilteredMemory({
        contradictions: [{ playerId: "ai_2", description: "suspicious", day: 2 }],
      });
      const scores = calculateSuspicionScores(memory, ["ai_2"]);
      expect(scores.get("ai_2")).toBeCloseTo(0.5);
    });
  });

  describe("applyRoleOverrides", () => {
    it("Mafia sets ally scores to -Infinity", () => {
      const scores = new Map([["ai_2", 0.5], ["ai_3", 0.8]]);
      const player = {
        player_id: "ai_1",
        alignment: "Mafia",
        role: "Mafia Goon",
      } as any;
      const memory = makeFilteredMemory();

      mockedPlayerState.getPlayersByAlignment.mockReturnValue([
        { player_id: "ai_1", is_alive: true } as any,
        { player_id: "ai_2", is_alive: true } as any,
      ]);

      applyRoleOverrides(scores, player, memory);
      expect(scores.get("ai_2")).toBe(-Infinity);
      expect(scores.get("ai_3")).toBe(0.8);
    });

    it("Godfather boosts top town target", () => {
      const scores = new Map([["ai_3", 0.5], ["ai_4", 0.8]]);
      const player = {
        player_id: "ai_1",
        alignment: "Mafia",
        role: "Godfather",
      } as any;
      const memory = makeFilteredMemory();

      mockedPlayerState.getPlayersByAlignment.mockReturnValue([
        { player_id: "ai_1", is_alive: true } as any,
      ]);

      applyRoleOverrides(scores, player, memory);
      // ai_4 was top at 0.8, gets +0.3
      expect(scores.get("ai_4")).toBeCloseTo(1.1);
    });

    it("Jester flattens all scores ×0.5", () => {
      const scores = new Map([["ai_2", 1.0], ["ai_3", 0.6]]);
      const player = { player_id: "ai_1", alignment: "Neutral", role: "Jester" } as any;

      applyRoleOverrides(scores, player, makeFilteredMemory());
      expect(scores.get("ai_2")).toBeCloseTo(0.5);
      expect(scores.get("ai_3")).toBeCloseTo(0.3);
    });
  });

  describe("applyBandwagonEffect", () => {
    it("does nothing with empty votes", () => {
      const scores = new Map([["ai_2", 0.5]]);
      const personality = { bandwagon_tendency: 0.5 } as any;
      applyBandwagonEffect(scores, [], personality);
      expect(scores.get("ai_2")).toBe(0.5);
    });

    it("boosts targets that already have votes", () => {
      const scores = new Map([["ai_2", 0.5], ["ai_3", 0.5]]);
      const votes = [
        { voter_id: "ai_4", target_id: "ai_2", weight: 1, day: 2 },
      ];
      const personality = { bandwagon_tendency: 0.8 } as any;

      applyBandwagonEffect(scores, votes, personality);
      expect(scores.get("ai_2")!).toBeGreaterThan(0.5);
      expect(scores.get("ai_3")).toBe(0.5); // no votes for ai_3
    });

    it("does not boost -Infinity scores (Mafia allies)", () => {
      const scores = new Map([["ai_2", -Infinity]]);
      const votes = [
        { voter_id: "ai_4", target_id: "ai_2", weight: 1, day: 2 },
      ];
      const personality = { bandwagon_tendency: 0.8 } as any;

      applyBandwagonEffect(scores, votes, personality);
      expect(scores.get("ai_2")).toBe(-Infinity);
    });

    it("skips when bandwagon_tendency is 0", () => {
      const scores = new Map([["ai_2", 0.5]]);
      const votes = [
        { voter_id: "ai_4", target_id: "ai_2", weight: 1, day: 2 },
      ];
      const personality = { bandwagon_tendency: 0 } as any;

      applyBandwagonEffect(scores, votes, personality);
      expect(scores.get("ai_2")).toBe(0.5);
    });
  });

  describe("shouldAbstain", () => {
    it("returns true when top score is below threshold", () => {
      expect(shouldAbstain(0.1, 0.3)).toBe(true);
    });

    it("returns false when top score is above threshold", () => {
      expect(shouldAbstain(0.5, 0.3)).toBe(false);
    });

    it("returns false when score equals threshold", () => {
      expect(shouldAbstain(0.3, 0.3)).toBe(false);
    });
  });

  describe("getVoteTiming", () => {
    it("returns 0.2 for early voters", () => {
      expect(getVoteTiming("early")).toBe(0.2);
    });

    it("returns 0.5 for mid voters", () => {
      expect(getVoteTiming("mid")).toBe(0.5);
    });

    it("returns 0.8 for late voters", () => {
      expect(getVoteTiming("late")).toBe(0.8);
    });

    it("returns 0.6 for bandwagon voters", () => {
      expect(getVoteTiming("bandwagon")).toBe(0.6);
    });
  });

  describe("getMafiaAllyIds", () => {
    it("returns other alive Mafia player IDs", () => {
      mockedPlayerState.getPlayersByAlignment.mockReturnValue([
        { player_id: "ai_1", is_alive: true } as any,
        { player_id: "ai_2", is_alive: true } as any,
        { player_id: "ai_5", is_alive: false } as any,
      ]);

      const allies = getMafiaAllyIds("ai_1");
      expect(allies).toEqual(["ai_2"]);
    });
  });

  describe("decideVote", () => {
    it("returns a target player ID when suspicion is above threshold", () => {
      mockedFilter.getFilteredMemory.mockReturnValue(
        makeFilteredMemory({
          relationships: {
            ai_2: { trust: 0, suspicion: 1.0, interaction_count: 3, last_interaction_day: 2, history: [] },
          },
        }),
      );

      const target = decideVote("ai_1", { currentVotes: [] });
      expect(typeof target).toBe("string");
    });

    it("returns null (abstain) when all scores are below threshold", () => {
      mockedPlayerState.getPersonality.mockReturnValue({
        vote_threshold: 999,
        perception_depth: 2,
        bandwagon_tendency: 0,
        voting_style: "mid",
      } as any);

      const target = decideVote("ai_1", { currentVotes: [] });
      expect(target).toBeNull();
    });
  });
});
