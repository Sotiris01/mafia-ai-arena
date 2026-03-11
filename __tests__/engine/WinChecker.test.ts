import {
  checkWinConditions,
  checkTownWin,
  checkMafiaWin,
  countByAlignment,
  getSurvivorCoWinners,
} from "../../src/engine/WinChecker";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/GameState");
jest.mock("../../src/state/PlayerState");

import * as PlayerState from "../../src/state/PlayerState";
import * as GameState from "../../src/state/GameState";

const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setAlive(players: Array<{ id: string; alignment: string; role: string }>) {
  mockedPlayerState.getAllAlivePlayers.mockReturnValue(
    players.map((p) => ({
      player_id: p.id,
      player_name: `Name_${p.id}`,
      role: p.role,
      alignment: p.alignment,
      is_alive: true,
      is_zombie: false,
    })) as any[],
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockedGameState.getState.mockReturnValue({
    is_game_over: false,
    alive_player_ids: [],
  } as any);
  mockedGameState.setGameOver.mockImplementation(() => {});
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("WinChecker", () => {
  describe("countByAlignment", () => {
    it("counts alive players by alignment", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Town", role: "Sheriff" },
        { id: "3", alignment: "Mafia", role: "Godfather" },
        { id: "4", alignment: "Neutral", role: "Jester" },
      ]);

      const counts = countByAlignment();
      expect(counts.town).toBe(2);
      expect(counts.mafia).toBe(1);
      expect(counts.neutral).toBe(1);
      expect(counts.total).toBe(4);
    });

    it("returns zeros when no players alive", () => {
      setAlive([]);
      const counts = countByAlignment();
      expect(counts.total).toBe(0);
    });
  });

  describe("checkTownWin", () => {
    it("returns win when no Mafia remain", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Town", role: "Sheriff" },
      ]);

      const result = checkTownWin();
      expect(result).not.toBeNull();
      expect(result!.winner).toBe("Town");
    });

    it("returns null when Mafia still alive", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Mafia", role: "Godfather" },
      ]);

      expect(checkTownWin()).toBeNull();
    });

    it("returns null when no players alive", () => {
      setAlive([]);
      expect(checkTownWin()).toBeNull();
    });
  });

  describe("checkMafiaWin", () => {
    it("returns win when Mafia >= non-Mafia", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Mafia", role: "Godfather" },
        { id: "3", alignment: "Mafia", role: "Mafia Goon" },
      ]);

      const result = checkMafiaWin();
      expect(result).not.toBeNull();
      expect(result!.winner).toBe("Mafia");
    });

    it("returns win when Mafia equals non-Mafia", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Mafia", role: "Godfather" },
      ]);

      expect(checkMafiaWin()).not.toBeNull();
    });

    it("returns null when Town outnumbers Mafia", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Town", role: "Sheriff" },
        { id: "3", alignment: "Mafia", role: "Godfather" },
      ]);

      expect(checkMafiaWin()).toBeNull();
    });

    it("returns null when no Mafia alive", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
      ]);

      expect(checkMafiaWin()).toBeNull();
    });
  });

  describe("getSurvivorCoWinners", () => {
    it("returns alive Survivor player IDs", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Neutral", role: "Survivor" },
        { id: "3", alignment: "Neutral", role: "Jester" },
      ]);

      const coWinners = getSurvivorCoWinners();
      expect(coWinners).toEqual(["2"]);
    });

    it("returns empty when no Survivors alive", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
      ]);

      expect(getSurvivorCoWinners()).toEqual([]);
    });
  });

  describe("checkWinConditions", () => {
    it("returns Town win when all Mafia eliminated", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Town", role: "Sheriff" },
      ]);

      const result = checkWinConditions("lynch");
      expect(result).not.toBeNull();
      expect(result!.winner).toBe("Town");
    });

    it("returns Mafia win when Mafia >= non-Mafia", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Mafia", role: "Godfather" },
        { id: "3", alignment: "Mafia", role: "Mafia Goon" },
      ]);

      const result = checkWinConditions("night");
      expect(result).not.toBeNull();
      expect(result!.winner).toBe("Mafia");
    });

    it("returns null when game should continue", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Town", role: "Sheriff" },
        { id: "3", alignment: "Mafia", role: "Godfather" },
      ]);

      expect(checkWinConditions("lynch")).toBeNull();
    });

    it("includes Survivor co-winners", () => {
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
        { id: "2", alignment: "Neutral", role: "Survivor" },
      ]);

      const result = checkWinConditions("lynch");
      expect(result).not.toBeNull();
      expect(result!.co_winners).toEqual(["2"]);
    });

    it("Town win takes priority over Mafia win", () => {
      // All mafia dead → Town win (even though 0 mafia >= 0 non-mafia is handled)
      setAlive([
        { id: "1", alignment: "Town", role: "Citizen" },
      ]);

      const result = checkWinConditions("lynch");
      expect(result).not.toBeNull();
      expect(result!.winner).toBe("Town");
    });
  });
});
