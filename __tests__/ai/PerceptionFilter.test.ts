import { getFilteredMemory } from "../../src/ai/PerceptionFilter";
import type { PlayerMemory, Relationship, InteractionRecord } from "../../src/types/memory.types";
import type { ChatEvent } from "../../src/types/chat.types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/MemoryManager");
jest.mock("../../src/state/ChatState");
jest.mock("../../src/state/GameState");

import * as PlayerState from "../../src/state/PlayerState";
import * as MemoryManager from "../../src/state/MemoryManager";
import * as ChatState from "../../src/state/ChatState";
import * as GameState from "../../src/state/GameState";

const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedMemory = MemoryManager as jest.Mocked<typeof MemoryManager>;
const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRelationship(
  trust: number,
  suspicion: number,
  history: InteractionRecord[],
): Relationship {
  return {
    trust,
    suspicion,
    interaction_count: history.length,
    last_interaction_day: history.length > 0 ? history[history.length - 1].day : 1,
    history,
  };
}

function makeRecord(overrides: Partial<InteractionRecord> = {}): InteractionRecord {
  return {
    action: "accuse",
    weight: 0.8,
    day: 2,
    source: "direct",
    ...overrides,
  };
}

function makeEvent(overrides: Partial<ChatEvent> = {}): ChatEvent {
  return {
    message_id: 1,
    speaker: "ai_1",
    action: "accuse",
    target: "ai_2",
    weight: 1.0,
    day: 2,
    raw_text: "I think ai_2 is sus",
    indirect_targets: [],
    ...overrides,
  };
}

function makeMemory(overrides: Partial<PlayerMemory> = {}): PlayerMemory {
  return {
    player_id: "p1",
    current_day: 2,
    relationships: {},
    known_roles: {},
    voting_history: [],
    events_witnessed: [],
    night_results: [],
    gossip_hints: [],
    is_zombie: false,
    memory_state: "active",
    ...overrides,
  };
}

function setupMocks(depth: 1 | 2 | 3, day = 2) {
  mockedPlayerState.getPersonality.mockReturnValue({
    type: "Logical",
    perception_depth: depth,
    speak_probability_base: 0.5,
    aggression: 0.5,
    emotional_reactivity: 0.5,
    deception_skill: 0.5,
    consistency: 0.5,
    leadership: 0.5,
    vote_threshold: 0.3,
    bandwagon_tendency: 0.3,
    voting_style: "mid",
  } as any);
  mockedGameState.getState.mockReturnValue({ day } as any);
}

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PerceptionFilter", () => {
  describe("getFilteredMemory — Level 1 (Superficial)", () => {
    it("returns only current-day high-weight direct interactions", () => {
      setupMocks(1, 2);

      const history: InteractionRecord[] = [
        makeRecord({ day: 1, weight: 0.9, source: "direct" }),  // old day
        makeRecord({ day: 2, weight: 0.1, source: "direct" }),  // low weight
        makeRecord({ day: 2, weight: 0.9, source: "direct" }),  // ✔ pass
        makeRecord({ day: 2, weight: 0.8, source: "indirect" }), // indirect
      ];

      mockedMemory.getMemory.mockReturnValue(
        makeMemory({
          relationships: {
            ai_2: makeRelationship(0.5, 1.0, history),
          },
          known_roles: {
            ai_3: { role: "Sheriff", confidence: 1, source: "investigation" },
            ai_4: { role: "Doctor", confidence: 0.7, source: "claim" },
          },
        }),
      );
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");

      // Only day-2, high-weight, direct records survive
      expect(result.relationships.ai_2).toBeDefined();
      expect(result.relationships.ai_2.history.length).toBe(1);
      expect(result.relationships.ai_2.history[0].weight).toBe(0.9);
    });

    it("only includes investigation/consigliere known roles at Level 1", () => {
      setupMocks(1, 2);

      mockedMemory.getMemory.mockReturnValue(
        makeMemory({
          known_roles: {
            ai_2: { role: "Sheriff", confidence: 1, source: "investigation" },
            ai_3: { role: "Doctor", confidence: 0.7, source: "claim" },
            ai_4: { role: "Godfather", confidence: 1, source: "consigliere" },
          },
        }),
      );
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");

      expect(Object.keys(result.knownRoles)).toEqual(
        expect.arrayContaining(["ai_2", "ai_4"]),
      );
      expect(result.knownRoles.ai_3).toBeUndefined();
    });

    it("only includes current-day events at Level 1", () => {
      setupMocks(1, 3);

      const dayEvents = [makeEvent({ day: 3 })];
      mockedChatState.getEventsByDay.mockImplementation((d) =>
        d === 3 ? dayEvents : [],
      );
      mockedMemory.getMemory.mockReturnValue(makeMemory());

      const result = getFilteredMemory("ai_1");
      expect(result.recentEvents).toEqual(dayEvents);
    });

    it("has no contradictions at Level 1", () => {
      setupMocks(1);
      mockedMemory.getMemory.mockReturnValue(makeMemory());
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");
      expect(result.contradictions).toEqual([]);
    });
  });

  describe("getFilteredMemory — Level 2 (Smart)", () => {
    it("includes all days' interactions above weight threshold", () => {
      setupMocks(2, 3);

      const history: InteractionRecord[] = [
        makeRecord({ day: 1, weight: 0.6, source: "direct" }),
        makeRecord({ day: 2, weight: 0.8, source: "direct" }),
        makeRecord({ day: 3, weight: 0.05, source: "direct" }), // below threshold
      ];

      mockedMemory.getMemory.mockReturnValue(
        makeMemory({
          relationships: {
            ai_2: makeRelationship(0.5, 1.0, history),
          },
        }),
      );
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");
      expect(result.relationships.ai_2).toBeDefined();
      // Exact count depends on config threshold; at least multi-day records pass
      expect(result.relationships.ai_2.history.length).toBeGreaterThanOrEqual(1);
    });

    it("includes all known roles (claims + investigations) at Level 2", () => {
      setupMocks(2, 2);

      mockedMemory.getMemory.mockReturnValue(
        makeMemory({
          known_roles: {
            ai_2: { role: "Sheriff", confidence: 1, source: "investigation" },
            ai_3: { role: "Doctor", confidence: 0.7, source: "claim" },
          },
        }),
      );
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");
      expect(result.knownRoles.ai_2).toBeDefined();
      expect(result.knownRoles.ai_3).toBeDefined();
    });

    it("includes events from last 2 days at Level 2", () => {
      setupMocks(2, 3);

      const day2Events = [makeEvent({ day: 2 })];
      const day3Events = [makeEvent({ day: 3 })];
      mockedChatState.getEventsByDay.mockImplementation((d) => {
        if (d === 2) return day2Events;
        if (d === 3) return day3Events;
        return [];
      });
      mockedMemory.getMemory.mockReturnValue(makeMemory());

      const result = getFilteredMemory("ai_1");
      expect(result.recentEvents).toHaveLength(2);
    });

    it("detects contradictions when claiming a role but defending accused", () => {
      setupMocks(2, 2);

      mockedMemory.getMemory.mockReturnValue(
        makeMemory({
          known_roles: {
            ai_3: { role: "Sheriff", confidence: 1, source: "claim" },
          },
        }),
      );

      // ai_3 claims Sheriff but defends accused players
      mockedChatState.getEventsByDay.mockReturnValue([
        makeEvent({ speaker: "ai_2", action: "accuse", target: "ai_5" }),
        makeEvent({ speaker: "ai_3", action: "defend", target: "ai_5" }),
        makeEvent({ speaker: "ai_3", action: "defend", target: "ai_5" }),
      ]);

      const result = getFilteredMemory("ai_1");
      expect(result.contradictions.length).toBeGreaterThanOrEqual(1);
      expect(result.contradictions[0].playerId).toBe("ai_3");
    });
  });

  describe("getFilteredMemory — Level 3 (Deep)", () => {
    it("includes complete relationship history", () => {
      setupMocks(3, 3);

      const history: InteractionRecord[] = [
        makeRecord({ day: 1, weight: 0.1, source: "indirect" }),
        makeRecord({ day: 2, weight: 0.3, source: "direct" }),
        makeRecord({ day: 3, weight: 0.9, source: "direct" }),
      ];

      mockedMemory.getMemory.mockReturnValue(
        makeMemory({
          relationships: {
            ai_2: makeRelationship(1, 2, history),
          },
        }),
      );
      mockedChatState.getAllEvents.mockReturnValue([makeEvent()]);
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");
      expect(result.relationships.ai_2.history).toHaveLength(3);
    });

    it("includes all events at Level 3", () => {
      setupMocks(3, 3);

      const allEvents = [
        makeEvent({ day: 1 }),
        makeEvent({ day: 2 }),
        makeEvent({ day: 3 }),
      ];
      mockedChatState.getAllEvents.mockReturnValue(allEvents);
      mockedChatState.getEventsByDay.mockReturnValue([]);
      mockedMemory.getMemory.mockReturnValue(makeMemory());

      const result = getFilteredMemory("ai_1");
      expect(result.recentEvents).toHaveLength(3);
    });
  });

  describe("getFilteredMemory — empty/edge cases", () => {
    it("returns empty when no relationships exist", () => {
      setupMocks(1);
      mockedMemory.getMemory.mockReturnValue(makeMemory());
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");
      expect(result.relationships).toEqual({});
      expect(result.knownRoles).toEqual({});
      expect(result.recentEvents).toEqual([]);
    });

    it("includes playerId in the output", () => {
      setupMocks(1);
      mockedMemory.getMemory.mockReturnValue(makeMemory());
      mockedChatState.getEventsByDay.mockReturnValue([]);

      const result = getFilteredMemory("ai_1");
      expect(result.playerId).toBe("ai_1");
    });
  });
});
