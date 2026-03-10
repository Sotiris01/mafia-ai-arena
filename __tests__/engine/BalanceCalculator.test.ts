import * as BalanceCalculator from "../../src/engine/BalanceCalculator";
import * as GameState from "../../src/state/GameState";
import * as PlayerState from "../../src/state/PlayerState";

// ---------------------------------------------------------------------------
// Helpers — set up a small game for balance tests
// ---------------------------------------------------------------------------

function setupGame(players: { id: string; alignment: "Town" | "Mafia" | "Neutral" }[]) {
  GameState.reset();
  PlayerState.reset();

  // Initialize players through PlayerState (need realistic setup)
  const ids = players.map((p) => p.id);
  // We'll initialize with a valid count, then override alignments
  PlayerState.initializePlayers(ids.length >= 7 ? ids.length : 7);
  GameState.init(
    ids.length >= 7 ? PlayerState.getAllPlayerIds() : ids,
  );
}

// For isolated unit tests, we mock the state modules
jest.mock("../../src/state/GameState");
jest.mock("../../src/state/PlayerState");

const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("BalanceCalculator", () => {
  describe("countByFaction", () => {
    it("counts Town, Mafia, and Neutral correctly", () => {
      const aliveIds = ["p1", "p2", "p3", "p4", "p5"];
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: aliveIds,
      } as any);

      mockedPlayerState.getPlayer.mockImplementation((id: string) => {
        const map: Record<string, string> = {
          p1: "Town",
          p2: "Town",
          p3: "Mafia",
          p4: "Neutral",
          p5: "Town",
        };
        return { alignment: map[id] } as any;
      });

      const counts = BalanceCalculator.countByFaction();
      expect(counts.town).toBe(3);
      expect(counts.mafia).toBe(1);
      expect(counts.neutral).toBe(1);
    });

    it("returns zeros when no players alive", () => {
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: [],
      } as any);

      const counts = BalanceCalculator.countByFaction();
      expect(counts.town).toBe(0);
      expect(counts.mafia).toBe(0);
      expect(counts.neutral).toBe(0);
    });

    it("handles all-Mafia scenario", () => {
      const aliveIds = ["m1", "m2", "m3"];
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: aliveIds,
      } as any);

      mockedPlayerState.getPlayer.mockReturnValue({ alignment: "Mafia" } as any);

      const counts = BalanceCalculator.countByFaction();
      expect(counts.town).toBe(0);
      expect(counts.mafia).toBe(3);
      expect(counts.neutral).toBe(0);
    });
  });

  describe("calculateBalance", () => {
    it("returns positive score when Town outnumbers expected ratio", () => {
      // 4 Town, 1 Mafia → ratio 0.8, expected 0.6 → score +0.2
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ["p1", "p2", "p3", "p4", "p5"],
      } as any);

      mockedPlayerState.getPlayer.mockImplementation((id: string) => {
        if (id === "p5") return { alignment: "Mafia" } as any;
        return { alignment: "Town" } as any;
      });

      const balance = BalanceCalculator.calculateBalance();
      expect(balance.score).toBeCloseTo(0.2);
      expect(balance.town_alive).toBe(4);
      expect(balance.mafia_alive).toBe(1);
      expect(balance.neutral_alive).toBe(0);
      expect(balance.total_alive).toBe(5);
      expect(balance.expected_ratio).toBe(0.6);
    });

    it("returns negative score when Mafia outnumbers expected", () => {
      // 1 Town, 4 Mafia → ratio 0.2, expected 0.6 → score -0.4
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ["p1", "p2", "p3", "p4", "p5"],
      } as any);

      mockedPlayerState.getPlayer.mockImplementation((id: string) => {
        if (id === "p1") return { alignment: "Town" } as any;
        return { alignment: "Mafia" } as any;
      });

      const balance = BalanceCalculator.calculateBalance();
      expect(balance.score).toBeCloseTo(-0.4);
    });

    it("returns zero score when ratio matches expected", () => {
      // 6 Town, 4 Mafia → ratio 0.6, expected 0.6 → score 0
      const ids = ["t1", "t2", "t3", "t4", "t5", "t6", "m1", "m2", "m3", "m4"];
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ids,
      } as any);

      mockedPlayerState.getPlayer.mockImplementation((id: string) => {
        if (id.startsWith("t")) return { alignment: "Town" } as any;
        return { alignment: "Mafia" } as any;
      });

      const balance = BalanceCalculator.calculateBalance();
      expect(balance.score).toBeCloseTo(0);
    });

    it("returns 0 score when no players alive", () => {
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: [],
      } as any);

      const balance = BalanceCalculator.calculateBalance();
      expect(balance.score).toBe(0);
      expect(balance.total_alive).toBe(0);
    });

    it("counts Neutral as non-Mafia for ratio", () => {
      // 2 Town, 1 Neutral, 2 Mafia → nonMafia=3, total=5, ratio=0.6
      const ids = ["t1", "t2", "n1", "m1", "m2"];
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ids,
      } as any);

      mockedPlayerState.getPlayer.mockImplementation((id: string) => {
        if (id.startsWith("t")) return { alignment: "Town" } as any;
        if (id.startsWith("n")) return { alignment: "Neutral" } as any;
        return { alignment: "Mafia" } as any;
      });

      const balance = BalanceCalculator.calculateBalance();
      expect(balance.score).toBeCloseTo(0); // 0.6 - 0.6 = 0
      expect(balance.neutral_alive).toBe(1);
    });
  });

  describe("getStage", () => {
    it("returns Stage 0 for balanced score", () => {
      mockedGameState.getConfig.mockReturnValue({
        balance_thresholds: { stage_1: 0.05, stage_2: 0.15 },
      } as any);

      expect(BalanceCalculator.getStage(0.02)).toBe(0);
    });

    it("returns Stage 1 for moderate imbalance", () => {
      mockedGameState.getConfig.mockReturnValue({
        balance_thresholds: { stage_1: 0.05, stage_2: 0.15 },
      } as any);

      expect(BalanceCalculator.getStage(0.10)).toBe(1);
    });

    it("returns Stage 2 for severe imbalance", () => {
      mockedGameState.getConfig.mockReturnValue({
        balance_thresholds: { stage_1: 0.05, stage_2: 0.15 },
      } as any);

      expect(BalanceCalculator.getStage(0.25)).toBe(2);
    });

    it("handles negative scores (takes abs for imbalance)", () => {
      mockedGameState.getConfig.mockReturnValue({
        balance_thresholds: { stage_1: 0.05, stage_2: 0.15 },
      } as any);

      expect(BalanceCalculator.getStage(-0.20)).toBe(2);
    });
  });

  describe("getLosing", () => {
    it("returns Mafia when score is positive (Town winning)", () => {
      expect(BalanceCalculator.getLosing(0.3)).toBe("Mafia");
    });

    it("returns Town when score is negative (Mafia winning)", () => {
      expect(BalanceCalculator.getLosing(-0.2)).toBe("Town");
    });

    it("returns Town at zero (tie defaults to Town)", () => {
      expect(BalanceCalculator.getLosing(0)).toBe("Town");
    });
  });
});
