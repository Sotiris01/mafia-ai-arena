import {
  analyzeHumanMessage,
  analyzeAIMessage,
  classifyAction,
  identifyTarget,
  assignWeight,
  detectIndirectTargets,
  detectRoleClaim,
  resetMessageCounter,
} from "../../src/engine/ChatAnalyzer";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/ChatState");
jest.mock("../../src/state/MemoryManager");
jest.mock("../../src/state/GameState");

import * as PlayerState from "../../src/state/PlayerState";
import * as ChatState from "../../src/state/ChatState";
import * as MemoryManager from "../../src/state/MemoryManager";
import * as GameState from "../../src/state/GameState";

const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;
const mockedMemory = MemoryManager as jest.Mocked<typeof MemoryManager>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;

beforeEach(() => {
  jest.clearAllMocks();
  resetMessageCounter();

  mockedGameState.getState.mockReturnValue({
    day: 2,
    alive_player_ids: ["human", "ai_1", "ai_2", "ai_3"],
  } as any);

  mockedPlayerState.getAllAlivePlayers.mockReturnValue([
    { player_id: "human", player_name: "Player" } as any,
    { player_id: "ai_1", player_name: "Alice" } as any,
    { player_id: "ai_2", player_name: "Bob" } as any,
    { player_id: "ai_3", player_name: "Charlie" } as any,
  ]);

  mockedChatState.getEventsByDay.mockReturnValue([]);
  mockedChatState.addChatEvent.mockImplementation(() => {});
  mockedMemory.updateRelationships.mockImplementation(() => {});
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ChatAnalyzer", () => {
  describe("classifyAction", () => {
    it('classifies "you are suspicious mafia" as accuse', () => {
      expect(classifyAction("you are suspicious mafia")).toBe("accuse");
    });

    it('classifies "I trust this player, innocent" as defend', () => {
      expect(classifyAction("I trust this player, innocent")).toBe("defend");
    });

    it('classifies "I agree, exactly right" as agree', () => {
      expect(classifyAction("I agree, exactly right")).toBe("agree");
    });

    it('classifies "that is wrong, disagree" as disagree', () => {
      expect(classifyAction("that is wrong, disagree")).toBe("disagree");
    });

    it("classifies \"I'm the Sheriff\" as claim", () => {
      expect(classifyAction("I'm the Sheriff, I claim this role")).toBe("claim");
    });

    it('classifies "why did you do that?" as question', () => {
      expect(classifyAction("why did you do that?")).toBe("question");
    });

    it('classifies "what about looking at someone else instead" as deflect', () => {
      expect(classifyAction("what about looking at someone else instead")).toBe("deflect");
    });

    it("defaults to question for unclassifiable text", () => {
      expect(classifyAction("hello world")).toBe("question");
    });

    it("picks action with most keyword matches", () => {
      // "suspicious guilty vote" has 3 accuse keywords
      expect(classifyAction("suspicious guilty vote")).toBe("accuse");
    });
  });

  describe("identifyTarget", () => {
    it("finds a player by name in text", () => {
      expect(identifyTarget("I think Alice is suspicious")).toBe("ai_1");
    });

    it("finds Bob as target", () => {
      expect(identifyTarget("Bob seems guilty to me")).toBe("ai_2");
    });

    it("is case-insensitive", () => {
      expect(identifyTarget("i think ALICE is sus")).toBe("ai_1");
    });

    it('returns empty string when no player name found', () => {
      expect(identifyTarget("someone is suspicious")).toBe("");
    });
  });

  describe("assignWeight", () => {
    it("returns base weight for accuse action", () => {
      const weight = assignWeight("you are suspicious", "accuse");
      expect(weight).toBeCloseTo(1.0);
    });

    it("returns lower weight for question action", () => {
      const weight = assignWeight("why did that happen", "question");
      expect(weight).toBeCloseTo(0.3);
    });

    it("boosts weight for exclamation marks", () => {
      const normal = assignWeight("you are suspicious", "accuse");
      const excited = assignWeight("you are suspicious!", "accuse");
      expect(excited).toBeGreaterThan(normal);
    });

    it("boosts weight for ALL CAPS text", () => {
      const normal = assignWeight("you are suspicious", "accuse");
      const caps = assignWeight("YOU ARE SUSPICIOUS", "accuse");
      expect(caps).toBeGreaterThan(normal);
    });

    it('boosts weight for "definitely"', () => {
      const normal = assignWeight("you are suspicious", "accuse");
      const definite = assignWeight("you are definitely suspicious", "accuse");
      expect(definite).toBeGreaterThan(normal);
    });

    it('reduces weight for "maybe"', () => {
      const normal = assignWeight("you are suspicious", "accuse");
      const maybe = assignWeight("maybe you are suspicious", "accuse");
      expect(maybe).toBeLessThan(normal);
    });

    it("clamps to maximum 1.5", () => {
      // All boosters at once
      const weight = assignWeight("DEFINITELY SUSPICIOUS!", "accuse");
      expect(weight).toBeLessThanOrEqual(1.5);
    });

    it("clamps to minimum 0.1", () => {
      const weight = assignWeight("maybe something", "question");
      expect(weight).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe("detectIndirectTargets", () => {
    it("detects indirect accuse: A accuses B who defended C → indirect accuse C", () => {
      mockedChatState.getEventsByDay.mockReturnValue([
        {
          message_id: 1, speaker: "ai_2", action: "defend", target: "ai_3",
          weight: 0.8, day: 2, raw_text: "ai_3 is fine", indirect_targets: [],
        },
      ]);

      const indirects = detectIndirectTargets("ai_1", "ai_2", "accuse");
      expect(indirects.length).toBe(1);
      expect(indirects[0].player_id).toBe("ai_3");
      expect(indirects[0].relationship).toBe("indirect_accuse");
    });

    it("detects indirect accuse: A defends B who accused C → indirect accuse C", () => {
      mockedChatState.getEventsByDay.mockReturnValue([
        {
          message_id: 1, speaker: "ai_2", action: "accuse", target: "ai_3",
          weight: 1.0, day: 2, raw_text: "ai_3 is sus", indirect_targets: [],
        },
      ]);

      const indirects = detectIndirectTargets("ai_1", "ai_2", "defend");
      expect(indirects.length).toBe(1);
      expect(indirects[0].player_id).toBe("ai_3");
      expect(indirects[0].relationship).toBe("indirect_accuse");
    });

    it("returns empty for non-accuse/defend actions", () => {
      const indirects = detectIndirectTargets("ai_1", "ai_2", "agree");
      expect(indirects).toEqual([]);
    });

    it("returns empty when no target", () => {
      const indirects = detectIndirectTargets("ai_1", "", "accuse");
      expect(indirects).toEqual([]);
    });
  });

  describe("detectRoleClaim", () => {
    it('detects "I am the Sheriff" as Sheriff claim', () => {
      const claim = detectRoleClaim("I am the Sheriff", "ai_1", 2);
      expect(claim).toBeDefined();
      expect(claim!.claimed_role).toBe("Sheriff");
      expect(claim!.day_claimed).toBe(2);
    });

    it("detects \"I'm Doctor\" as Doctor claim", () => {
      const claim = detectRoleClaim("I'm doctor and I can save people", "ai_1", 3);
      expect(claim).toBeDefined();
      expect(claim!.claimed_role).toBe("Doctor");
    });

    it('detects "claim mayor" as Mayor claim', () => {
      const claim = detectRoleClaim("I claim mayor status", "ai_1", 2);
      expect(claim).toBeDefined();
      expect(claim!.claimed_role).toBe("Mayor");
    });

    it("returns undefined for text without role claims", () => {
      const claim = detectRoleClaim("I think Bob is suspicious", "ai_1", 2);
      expect(claim).toBeUndefined();
    });

    it("is case-insensitive", () => {
      const claim = detectRoleClaim("I AM THE SHERIFF", "ai_1", 2);
      expect(claim).toBeDefined();
      expect(claim!.claimed_role).toBe("Sheriff");
    });
  });

  describe("analyzeHumanMessage", () => {
    it("creates ChatEvent with correct fields", () => {
      const event = analyzeHumanMessage("Alice is very suspicious", "human");

      expect(event.speaker).toBe("human");
      expect(event.action).toBe("accuse");
      expect(event.target).toBe("ai_1");
      expect(event.day).toBe(2);
      expect(typeof event.weight).toBe("number");
      expect(typeof event.message_id).toBe("number");
    });

    it("stores event in ChatState", () => {
      analyzeHumanMessage("Hello everyone", "human");
      expect(mockedChatState.addChatEvent).toHaveBeenCalledTimes(1);
    });

    it("updates AI memories", () => {
      analyzeHumanMessage("Alice is sus", "human");
      expect(mockedMemory.updateRelationships).toHaveBeenCalled();
    });

    it("increments message IDs sequentially", () => {
      const event1 = analyzeHumanMessage("First message", "human");
      const event2 = analyzeHumanMessage("Second message", "human");
      expect(event2.message_id).toBe(event1.message_id + 1);
    });
  });

  describe("analyzeAIMessage", () => {
    it("creates ChatEvent with provided action type", () => {
      const event = analyzeAIMessage(
        "I think Bob is guilty",
        "ai_1",
        "accuse",
        "ai_2",
      );

      expect(event.speaker).toBe("ai_1");
      expect(event.action).toBe("accuse");
      expect(event.target).toBe("ai_2");
    });

    it("stores event and updates memories", () => {
      analyzeAIMessage("defending Alice", "ai_1", "defend", "ai_1");
      expect(mockedChatState.addChatEvent).toHaveBeenCalledTimes(1);
      expect(mockedMemory.updateRelationships).toHaveBeenCalled();
    });
  });

  describe("resetMessageCounter", () => {
    it("resets counter so next ID starts at 1", () => {
      analyzeHumanMessage("msg", "human"); // id=1
      analyzeHumanMessage("msg", "human"); // id=2
      resetMessageCounter();
      const event = analyzeHumanMessage("msg", "human");
      expect(event.message_id).toBe(1);
    });
  });
});
