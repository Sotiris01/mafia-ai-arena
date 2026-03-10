import * as PlayerState from "../../src/state/PlayerState";

beforeEach(() => {
  PlayerState.reset();
});

afterEach(() => {
  PlayerState.reset();
});

describe("PlayerState", () => {
  describe("initializePlayers", () => {
    it("creates correct number of players", () => {
      const ids = PlayerState.initializePlayers(7);
      expect(ids).toHaveLength(7);
    });

    it("first player is human", () => {
      PlayerState.initializePlayers(7);
      const human = PlayerState.getHumanPlayer();
      expect(human.player_id).toBe("human");
    });

    it("AI players have sequential IDs", () => {
      const ids = PlayerState.initializePlayers(7);
      expect(ids[0]).toBe("human");
      expect(ids[1]).toBe("ai_1");
      expect(ids[6]).toBe("ai_6");
    });

    it("all players start alive", () => {
      PlayerState.initializePlayers(7);
      const alive = PlayerState.getAllAlivePlayers();
      expect(alive).toHaveLength(7);
      alive.forEach((p) => expect(p.is_alive).toBe(true));
    });

    it("assigns valid roles to all players", () => {
      PlayerState.initializePlayers(10);
      const ids = PlayerState.getAllPlayerIds();
      for (const id of ids) {
        const p = PlayerState.getPlayer(id);
        expect(p.role).toBeDefined();
        expect(["Town", "Mafia", "Neutral"]).toContain(p.alignment);
      }
    });

    it("assigns personalities to all players", () => {
      PlayerState.initializePlayers(7);
      const ids = PlayerState.getAllPlayerIds();
      for (const id of ids) {
        const p = PlayerState.getPersonality(id);
        expect(p.type).toBeDefined();
        expect(typeof p.aggression).toBe("number");
        expect(typeof p.trust_base).toBe("number");
      }
    });
  });

  describe("role distribution", () => {
    it("always includes core roles (7 players)", () => {
      PlayerState.initializePlayers(7);
      const dist = PlayerState.getRoleDistribution();
      // Core roles: Citizen, Sheriff, Doctor, Godfather, Mafia Goon, Jester
      expect(dist.has("Godfather")).toBe(true);
      expect(dist.has("Jester")).toBe(true);
    });

    it("includes more roles with 10 players", () => {
      PlayerState.initializePlayers(10);
      const dist = PlayerState.getRoleDistribution();
      // At 10+, advanced roles become available
      const totalRoles = Array.from(dist.values()).reduce((a, b) => a + b, 0);
      expect(totalRoles).toBe(10);
    });

    it("total roles equals player count", () => {
      for (const count of [7, 9, 12, 16]) {
        PlayerState.reset();
        PlayerState.initializePlayers(count);
        const dist = PlayerState.getRoleDistribution();
        const total = Array.from(dist.values()).reduce((a, b) => a + b, 0);
        expect(total).toBe(count);
      }
    });
  });

  describe("getPlayer", () => {
    it("returns player data", () => {
      PlayerState.initializePlayers(7);
      const p = PlayerState.getPlayer("human");
      expect(p.player_id).toBe("human");
      expect(p.player_name).toBe("Player");
    });

    it("throws for unknown player", () => {
      PlayerState.initializePlayers(7);
      expect(() => PlayerState.getPlayer("unknown")).toThrow("not found");
    });
  });

  describe("getPersonality", () => {
    it("returns personality stats", () => {
      PlayerState.initializePlayers(7);
      const p = PlayerState.getPersonality("human");
      expect(["Aggressive", "Cautious", "Paranoid", "Logical", "Shy", "Charismatic"]).toContain(p.type);
      expect(p.perception_depth).toBeGreaterThanOrEqual(1);
      expect(p.perception_depth).toBeLessThanOrEqual(3);
    });

    it("throws for unknown player", () => {
      PlayerState.initializePlayers(7);
      expect(() => PlayerState.getPersonality("unknown")).toThrow("not found");
    });
  });

  describe("getAllAlivePlayers", () => {
    it("returns only alive players", () => {
      PlayerState.initializePlayers(7);
      PlayerState.updatePlayerStatus("ai_1", { is_alive: false });
      const alive = PlayerState.getAllAlivePlayers();
      expect(alive).toHaveLength(6);
      expect(alive.find((p) => p.player_id === "ai_1")).toBeUndefined();
    });
  });

  describe("updatePlayerStatus", () => {
    it("marks player as dead", () => {
      PlayerState.initializePlayers(7);
      PlayerState.updatePlayerStatus("ai_1", { is_alive: false });
      expect(PlayerState.getPlayer("ai_1").is_alive).toBe(false);
    });

    it("marks player as zombie", () => {
      PlayerState.initializePlayers(7);
      PlayerState.updatePlayerStatus("ai_2", { is_zombie: true });
      expect(PlayerState.getPlayer("ai_2").is_zombie).toBe(true);
    });

    it("reveals mayor", () => {
      PlayerState.initializePlayers(7);
      PlayerState.updatePlayerStatus("human", { is_revealed_mayor: true });
      expect(PlayerState.getPlayer("human").is_revealed_mayor).toBe(true);
    });
  });

  describe("getPlayersByAlignment", () => {
    it("filters by Town alignment", () => {
      PlayerState.initializePlayers(7);
      const town = PlayerState.getPlayersByAlignment("Town");
      town.forEach((p) => expect(p.alignment).toBe("Town"));
    });

    it("filters by Mafia alignment", () => {
      PlayerState.initializePlayers(7);
      const mafia = PlayerState.getPlayersByAlignment("Mafia");
      mafia.forEach((p) => expect(p.alignment).toBe("Mafia"));
    });

    it("excludes dead players", () => {
      PlayerState.initializePlayers(7);
      const allAlive = PlayerState.getAllAlivePlayers();
      const mafiaPlayer = allAlive.find((p) => p.alignment === "Mafia");
      if (mafiaPlayer) {
        PlayerState.updatePlayerStatus(mafiaPlayer.player_id, { is_alive: false });
        const mafia = PlayerState.getPlayersByAlignment("Mafia");
        expect(mafia.find((p) => p.player_id === mafiaPlayer.player_id)).toBeUndefined();
      }
    });
  });

  describe("getHumanPlayer", () => {
    it("returns the human player", () => {
      PlayerState.initializePlayers(7);
      const human = PlayerState.getHumanPlayer();
      expect(human.player_id).toBe("human");
      expect(human.player_name).toBe("Player");
    });

    it("throws when not initialized", () => {
      expect(() => PlayerState.getHumanPlayer()).toThrow();
    });
  });

  describe("reset", () => {
    it("clears all player data", () => {
      PlayerState.initializePlayers(7);
      PlayerState.reset();
      expect(() => PlayerState.getPlayer("human")).toThrow();
      expect(() => PlayerState.getHumanPlayer()).toThrow();
    });
  });
});
