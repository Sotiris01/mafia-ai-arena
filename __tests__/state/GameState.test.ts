import * as GameState from "../../src/state/GameState";

const TEST_PLAYERS = ["human", "ai_1", "ai_2", "ai_3"];

beforeEach(() => {
  GameState.reset();
  GameState.init(TEST_PLAYERS);
});

afterEach(() => {
  GameState.reset();
});

describe("GameState", () => {
  describe("init / getState", () => {
    it("creates initial state with correct defaults", () => {
      const s = GameState.getState();
      expect(s.phase).toBe("day");
      expect(s.sub_phase).toBe("discussion");
      expect(s.day).toBe(1);
      expect(s.is_game_over).toBe(false);
      expect(s.win_result).toBeNull();
    });

    it("tracks all player IDs as alive", () => {
      const s = GameState.getState();
      expect(s.alive_player_ids).toEqual(TEST_PLAYERS);
      expect(s.dead_player_ids).toEqual([]);
    });

    it("initializes Full Moon as inactive", () => {
      const s = GameState.getState();
      expect(s.full_moon.is_active).toBe(false);
      expect(s.full_moon.stage).toBe(0);
      expect(s.full_moon.activations_remaining).toBe(3);
      expect(s.full_moon.buffed_faction).toBeNull();
    });

    it("starts with empty zombie list", () => {
      expect(GameState.getState().zombie_player_ids).toEqual([]);
    });
  });

  describe("getState (uninitialized)", () => {
    it("throws when not initialized", () => {
      GameState.reset();
      expect(() => GameState.getState()).toThrow("not initialized");
    });
  });

  describe("getConfig", () => {
    it("returns loaded config", () => {
      const cfg = GameState.getConfig();
      expect(cfg).toBeDefined();
      expect(typeof cfg.decay_factor).toBe("number");
    });

    it("throws when not initialized", () => {
      GameState.reset();
      expect(() => GameState.getConfig()).toThrow("not initialized");
    });
  });

  describe("updatePhase", () => {
    it("updates phase and sub_phase", () => {
      GameState.updatePhase("night", "night_actions");
      const s = GameState.getState();
      expect(s.phase).toBe("night");
      expect(s.sub_phase).toBe("night_actions");
    });
  });

  describe("advanceDay", () => {
    it("increments day counter", () => {
      expect(GameState.getState().day).toBe(1);
      GameState.advanceDay();
      expect(GameState.getState().day).toBe(2);
      GameState.advanceDay();
      expect(GameState.getState().day).toBe(3);
    });
  });

  describe("markPlayerDead", () => {
    it("moves player from alive to dead", () => {
      GameState.markPlayerDead("ai_1");
      const s = GameState.getState();
      expect(s.alive_player_ids).not.toContain("ai_1");
      expect(s.dead_player_ids).toContain("ai_1");
    });

    it("does not duplicate in dead list", () => {
      GameState.markPlayerDead("ai_1");
      GameState.markPlayerDead("ai_1");
      expect(GameState.getState().dead_player_ids.filter((id) => id === "ai_1")).toHaveLength(1);
    });
  });

  describe("markPlayerZombie", () => {
    it("adds player to zombie list", () => {
      GameState.markPlayerZombie("ai_2");
      expect(GameState.getState().zombie_player_ids).toContain("ai_2");
    });

    it("does not duplicate", () => {
      GameState.markPlayerZombie("ai_2");
      GameState.markPlayerZombie("ai_2");
      expect(GameState.getState().zombie_player_ids).toHaveLength(1);
    });
  });

  describe("updateFullMoon", () => {
    it("partially updates Full Moon state", () => {
      GameState.updateFullMoon({ is_active: true, stage: 1 });
      const fm = GameState.getState().full_moon;
      expect(fm.is_active).toBe(true);
      expect(fm.stage).toBe(1);
      expect(fm.activations_remaining).toBe(3); // unchanged
    });

    it("updates buffed_faction", () => {
      GameState.updateFullMoon({ buffed_faction: "Town" });
      expect(GameState.getState().full_moon.buffed_faction).toBe("Town");
    });
  });

  describe("setGameOver", () => {
    it("sets game over with win result", () => {
      const result = { winner: "Town" as const, co_winners: [] as string[], reason: "All Mafia eliminated" };
      GameState.setGameOver(result);
      const s = GameState.getState();
      expect(s.is_game_over).toBe(true);
      expect(s.win_result).toEqual(result);
    });
  });

  describe("isPlayerAlive", () => {
    it("returns true for alive player", () => {
      expect(GameState.isPlayerAlive("ai_1")).toBe(true);
    });

    it("returns false for dead player", () => {
      GameState.markPlayerDead("ai_1");
      expect(GameState.isPlayerAlive("ai_1")).toBe(false);
    });
  });

  describe("reset", () => {
    it("clears all state", () => {
      GameState.markPlayerDead("ai_1");
      GameState.reset();
      expect(() => GameState.getState()).toThrow("not initialized");
      expect(() => GameState.getConfig()).toThrow("not initialized");
    });
  });
});
