import * as MemoryManager from "../../src/state/MemoryManager";
import type { ChatEvent } from "../../src/types/chat.types";

const ALL_PLAYERS = ["ai_1", "ai_2", "ai_3"];

function makeAccuseEvent(speaker: string, target: string, day = 1): ChatEvent {
  return {
    message_id: Math.random(),
    speaker,
    action: "accuse",
    target,
    weight: 1.0,
    day,
    raw_text: `${speaker} accuses ${target}`,
    indirect_targets: [],
  };
}

function makeDefendEvent(speaker: string, target: string, day = 1): ChatEvent {
  return {
    message_id: Math.random(),
    speaker,
    action: "defend",
    target,
    weight: 0.8,
    day,
    raw_text: `${speaker} defends ${target}`,
    indirect_targets: [],
  };
}

beforeEach(() => {
  MemoryManager.reset();
  for (const id of ALL_PLAYERS) {
    MemoryManager.initMemory(id, ALL_PLAYERS);
  }
});

afterEach(() => {
  MemoryManager.reset();
});

describe("MemoryManager", () => {
  describe("initMemory / getMemory", () => {
    it("creates empty memory for player", () => {
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.player_id).toBe("ai_1");
      expect(mem.current_day).toBe(1);
      expect(mem.memory_state).toBe("active");
      expect(mem.is_zombie).toBe(false);
    });

    it("pre-creates relationship slots for all other players", () => {
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.relationships["ai_2"]).toBeDefined();
      expect(mem.relationships["ai_3"]).toBeDefined();
      expect(mem.relationships["ai_1"]).toBeUndefined(); // no self-relationship
    });

    it("starts with empty collections", () => {
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.night_results).toHaveLength(0);
      expect(mem.events_witnessed).toHaveLength(0);
      expect(mem.voting_history).toHaveLength(0);
      expect(mem.gossip_hints).toHaveLength(0);
    });

    it("throws for unknown player", () => {
      expect(() => MemoryManager.getMemory("unknown")).toThrow("not found");
    });
  });

  describe("updateRelationships", () => {
    it("increases suspicion from accusation", () => {
      const events = [makeAccuseEvent("ai_2", "ai_3")];
      MemoryManager.updateRelationships("ai_1", events);
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.relationships["ai_2"].suspicion).toBeGreaterThan(0);
    });

    it("increases trust from defense", () => {
      const events = [makeDefendEvent("ai_2", "ai_3")];
      MemoryManager.updateRelationships("ai_1", events);
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.relationships["ai_2"].trust).toBeGreaterThan(0);
    });

    it("increments interaction count", () => {
      const events = [
        makeAccuseEvent("ai_2", "ai_3"),
        makeDefendEvent("ai_2", "ai_1"),
      ];
      MemoryManager.updateRelationships("ai_1", events);
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.relationships["ai_2"].interaction_count).toBe(2);
    });

    it("records interaction history", () => {
      const events = [makeAccuseEvent("ai_2", "ai_3")];
      MemoryManager.updateRelationships("ai_1", events);
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.relationships["ai_2"].history).toHaveLength(1);
      expect(mem.relationships["ai_2"].history[0].action).toBe("accuse");
    });

    it("processes indirect targets", () => {
      const event: ChatEvent = {
        message_id: 1,
        speaker: "ai_2",
        action: "accuse",
        target: "ai_3",
        weight: 1.0,
        day: 1,
        raw_text: "ai_2 accuses ai_3",
        indirect_targets: [
          { player_id: "ai_3", relationship: "indirect_accuse", weight_modifier: 0.4 },
        ],
      };
      MemoryManager.updateRelationships("ai_1", [event]);
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.relationships["ai_3"].suspicion).toBeGreaterThan(0);
    });

    it("skips updates for frozen memory (zombie)", () => {
      MemoryManager.freezeMemory("ai_1", 1);
      MemoryManager.updateRelationships("ai_1", [makeAccuseEvent("ai_2", "ai_3")]);
      const mem = MemoryManager.getMemory("ai_1");
      // Suspicion should remain 0 because memory is frozen
      expect(mem.relationships["ai_2"].suspicion).toBe(0);
    });
  });

  describe("applyDayDecay", () => {
    it("decays trust and suspicion by decay factor", () => {
      // Set up some initial relationship weights
      MemoryManager.updateRelationships("ai_1", [
        makeAccuseEvent("ai_2", "ai_3"),
      ]);
      const before = MemoryManager.getMemory("ai_1").relationships["ai_2"].suspicion;
      expect(before).toBeGreaterThan(0);

      MemoryManager.applyDayDecay("ai_1");
      const after = MemoryManager.getMemory("ai_1").relationships["ai_2"].suspicion;
      expect(after).toBeLessThan(before);
      expect(after).toBeCloseTo(before * 0.7); // decay_factor = 0.70
    });

    it("increments current_day", () => {
      expect(MemoryManager.getMemory("ai_1").current_day).toBe(1);
      MemoryManager.applyDayDecay("ai_1");
      expect(MemoryManager.getMemory("ai_1").current_day).toBe(2);
    });

    it("skips decay for frozen memory", () => {
      MemoryManager.updateRelationships("ai_1", [makeAccuseEvent("ai_2", "ai_3")]);
      const before = MemoryManager.getMemory("ai_1").relationships["ai_2"].suspicion;
      MemoryManager.freezeMemory("ai_1", 1);
      MemoryManager.applyDayDecay("ai_1");
      const after = MemoryManager.getMemory("ai_1").relationships["ai_2"].suspicion;
      expect(after).toBe(before); // unchanged
    });
  });

  describe("addNightResult", () => {
    it("stores night action result", () => {
      MemoryManager.addNightResult("ai_1", {
        night: 1,
        action_performed: "investigate",
        target_id: "ai_2",
        result: "Town",
      });
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.night_results).toHaveLength(1);
      expect(mem.night_results[0].result).toBe("Town");
    });

    it("skips for frozen memory", () => {
      MemoryManager.freezeMemory("ai_1", 1);
      MemoryManager.addNightResult("ai_1", {
        night: 1,
        action_performed: "investigate",
        target_id: "ai_2",
        result: "Town",
      });
      expect(MemoryManager.getMemory("ai_1").night_results).toHaveLength(0);
    });
  });

  describe("addKnownRole", () => {
    it("stores known role for target", () => {
      MemoryManager.addKnownRole("ai_1", "ai_2", {
        role: "Godfather",
        confidence: 1.0,
        source: "investigation",
      });
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.known_roles["ai_2"].role).toBe("Godfather");
      expect(mem.known_roles["ai_2"].confidence).toBe(1.0);
    });
  });

  describe("addEventWitnessed", () => {
    it("stores witnessed event", () => {
      MemoryManager.addEventWitnessed("ai_1", {
        day: 1,
        type: "E01",
        timing: "morning",
        suspicion_weight: 0.3,
      });
      expect(MemoryManager.getMemory("ai_1").events_witnessed).toHaveLength(1);
    });
  });

  describe("addVoteRecord", () => {
    it("stores voting record", () => {
      MemoryManager.addVoteRecord("ai_1", {
        day: 1,
        voted_for: "ai_2",
        lynch_result: "no_lynch",
      });
      expect(MemoryManager.getMemory("ai_1").voting_history).toHaveLength(1);
    });
  });

  describe("addGossipHint", () => {
    it("stores gossip hint", () => {
      MemoryManager.addGossipHint("ai_1", {
        day: 1,
        hint_text: "Someone smells of gunpowder...",
        target_id: "ai_2",
        confidence: 0.5,
      });
      expect(MemoryManager.getMemory("ai_1").gossip_hints).toHaveLength(1);
    });
  });

  describe("freezeMemory", () => {
    it("sets zombie state and frozen memory", () => {
      MemoryManager.freezeMemory("ai_1", 3);
      const mem = MemoryManager.getMemory("ai_1");
      expect(mem.is_zombie).toBe(true);
      expect(mem.zombie_since_day).toBe(3);
      expect(mem.memory_state).toBe("frozen");
    });
  });

  describe("getRelationshipScore", () => {
    it("returns combined trust + suspicion", () => {
      // Build up some relationship weights
      MemoryManager.updateRelationships("ai_1", [
        makeAccuseEvent("ai_2", "ai_3"), // suspicion for ai_2
        makeDefendEvent("ai_3", "ai_1"), // trust for ai_3
      ]);
      const score = MemoryManager.getRelationshipScore("ai_1", "ai_2");
      expect(typeof score).toBe("number");
    });

    it("returns 0 for unknown target", () => {
      expect(MemoryManager.getRelationshipScore("ai_1", "unknown")).toBe(0);
    });
  });

  describe("reset", () => {
    it("clears all memory data", () => {
      MemoryManager.addNightResult("ai_1", {
        night: 1,
        action_performed: "investigate",
        target_id: "ai_2",
        result: "Town",
      });
      MemoryManager.reset();
      expect(() => MemoryManager.getMemory("ai_1")).toThrow("not found");
    });
  });
});
