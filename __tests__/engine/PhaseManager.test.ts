import {
  advanceSubPhase,
  transitionToDay,
  transitionToNight,
  handleLynch,
  getTimerDuration,
  isHumanActionRequired,
  getDayNumber,
} from "../../src/engine/PhaseManager";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/GameState");
jest.mock("../../src/state/MemoryManager");
jest.mock("../../src/engine/WinChecker");

import * as GameState from "../../src/state/GameState";
import * as MemoryManager from "../../src/state/MemoryManager";
import * as WinChecker from "../../src/engine/WinChecker";

const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedMemory = MemoryManager as jest.Mocked<typeof MemoryManager>;
const mockedWinChecker = WinChecker as jest.Mocked<typeof WinChecker>;

beforeEach(() => {
  jest.clearAllMocks();

  mockedGameState.getState.mockReturnValue({
    phase: "day",
    sub_phase: "morning_report",
    day: 1,
    is_game_over: false,
    alive_player_ids: ["human", "ai_1", "ai_2"],
  } as any);

  mockedGameState.getConfig.mockReturnValue({
    timers: {
      morning_report_seconds: 15,
      discussion_seconds: 120,
      trial_seconds: 60,
      voting_seconds: 30,
      night_action_seconds: 45,
    },
  } as any);

  mockedGameState.updatePhase.mockImplementation(() => {});
  mockedGameState.advanceDay.mockImplementation(() => {});
  mockedGameState.markPlayerDead.mockImplementation(() => {});
  mockedGameState.setGameOver.mockImplementation(() => {});
  mockedMemory.applyDayDecay.mockImplementation(() => {});
  mockedWinChecker.checkWinConditions.mockReturnValue(null);
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PhaseManager", () => {
  describe("advanceSubPhase — Day sequence", () => {
    it("advances morning_report → discussion", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "day", sub_phase: "morning_report", is_game_over: false,
      } as any);

      const next = advanceSubPhase();
      expect(next).toBe("discussion");
      expect(mockedGameState.updatePhase).toHaveBeenCalledWith("day", "discussion");
    });

    it("advances discussion → midday_events", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "day", sub_phase: "discussion", is_game_over: false,
      } as any);

      const next = advanceSubPhase();
      expect(next).toBe("midday_events");
    });

    it("advances midday_events → trial", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "day", sub_phase: "midday_events", is_game_over: false,
      } as any);

      expect(advanceSubPhase()).toBe("trial");
    });

    it("advances trial → voting", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "day", sub_phase: "trial", is_game_over: false,
      } as any);

      expect(advanceSubPhase()).toBe("voting");
    });

    it("advances voting → lynch_resolution", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "day", sub_phase: "voting", is_game_over: false,
      } as any);

      expect(advanceSubPhase()).toBe("lynch_resolution");
    });

    it("lynch_resolution transitions to night", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "day", sub_phase: "lynch_resolution", is_game_over: false,
      } as any);

      const next = advanceSubPhase();
      expect(next).toBe("mafia_chat");
      expect(mockedGameState.updatePhase).toHaveBeenCalledWith("night", "mafia_chat");
    });
  });

  describe("advanceSubPhase — Night sequence", () => {
    it("advances mafia_chat → night_actions", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "night", sub_phase: "mafia_chat", is_game_over: false,
      } as any);

      expect(advanceSubPhase()).toBe("night_actions");
    });

    it("advances night_actions → night_resolution", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "night", sub_phase: "night_actions", is_game_over: false,
      } as any);

      expect(advanceSubPhase()).toBe("night_resolution");
    });

    it("night_resolution transitions to next day", () => {
      mockedGameState.getState
        .mockReturnValueOnce({
          phase: "night", sub_phase: "night_resolution", is_game_over: false,
        } as any)
        .mockReturnValue({
          alive_player_ids: ["human", "ai_1", "ai_2"],
          day: 2,
        } as any);

      const next = advanceSubPhase();
      expect(next).toBe("morning_report");
      expect(mockedGameState.advanceDay).toHaveBeenCalled();
    });

    it("night_resolution ends game on win condition", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "night", sub_phase: "night_resolution", is_game_over: false,
      } as any);

      mockedWinChecker.checkWinConditions.mockReturnValue({
        winner: "Town",
        co_winners: [],
        reason: "All Mafia eliminated",
      });

      const next = advanceSubPhase();
      expect(next).toBeNull();
      expect(mockedGameState.setGameOver).toHaveBeenCalled();
    });
  });

  describe("advanceSubPhase — game over", () => {
    it("returns null when game is already over", () => {
      mockedGameState.getState.mockReturnValue({
        phase: "day", sub_phase: "discussion", is_game_over: true,
      } as any);

      expect(advanceSubPhase()).toBeNull();
    });
  });

  describe("transitionToDay", () => {
    it("advances day counter", () => {
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ["human", "ai_1"],
      } as any);

      transitionToDay();
      expect(mockedGameState.advanceDay).toHaveBeenCalled();
    });

    it("applies day decay for AI players", () => {
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ["human", "ai_1", "ai_2"],
      } as any);

      transitionToDay();
      expect(mockedMemory.applyDayDecay).toHaveBeenCalledWith("ai_1");
      expect(mockedMemory.applyDayDecay).toHaveBeenCalledWith("ai_2");
    });

    it("does not apply day decay for human", () => {
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ["human", "ai_1"],
      } as any);

      transitionToDay();
      expect(mockedMemory.applyDayDecay).not.toHaveBeenCalledWith("human");
    });

    it('returns "morning_report" sub-phase', () => {
      mockedGameState.getState.mockReturnValue({
        alive_player_ids: ["human"],
      } as any);

      expect(transitionToDay()).toBe("morning_report");
    });
  });

  describe("transitionToNight", () => {
    it('returns "mafia_chat" sub-phase', () => {
      expect(transitionToNight()).toBe("mafia_chat");
    });

    it("updates phase to night", () => {
      transitionToNight();
      expect(mockedGameState.updatePhase).toHaveBeenCalledWith("night", "mafia_chat");
    });
  });

  describe("handleLynch", () => {
    it("marks player dead", () => {
      handleLynch("ai_2");
      expect(mockedGameState.markPlayerDead).toHaveBeenCalledWith("ai_2");
    });

    it("returns null when no win condition met", () => {
      mockedWinChecker.checkWinConditions.mockReturnValue(null);
      expect(handleLynch("ai_2")).toBeNull();
    });

    it("returns WinResult when game ends", () => {
      const winResult = {
        winner: "Town" as const,
        co_winners: [],
        reason: "All Mafia eliminated",
      };
      mockedWinChecker.checkWinConditions.mockReturnValue(winResult);

      const result = handleLynch("ai_2");
      expect(result).toEqual(winResult);
      expect(mockedGameState.setGameOver).toHaveBeenCalledWith(winResult);
    });

    it("calls checkWinConditions with lynch trigger", () => {
      handleLynch("ai_2");
      expect(mockedWinChecker.checkWinConditions).toHaveBeenCalledWith("lynch", "ai_2");
    });
  });

  describe("getTimerDuration", () => {
    it("returns correct duration for morning_report", () => {
      expect(getTimerDuration("morning_report")).toBe(15);
    });

    it("returns correct duration for discussion", () => {
      expect(getTimerDuration("discussion")).toBe(120);
    });

    it("returns correct duration for voting", () => {
      expect(getTimerDuration("voting")).toBe(30);
    });

    it("returns correct duration for trial", () => {
      expect(getTimerDuration("trial")).toBe(60);
    });

    it("returns correct duration for night_actions", () => {
      expect(getTimerDuration("night_actions")).toBe(45);
    });

    it("returns 0 for auto-advance phases (midday_events, lynch_resolution, night_resolution)", () => {
      expect(getTimerDuration("midday_events")).toBe(0);
      expect(getTimerDuration("lynch_resolution")).toBe(0);
      expect(getTimerDuration("night_resolution")).toBe(0);
    });
  });

  describe("isHumanActionRequired", () => {
    it("returns true for discussion", () => {
      expect(isHumanActionRequired("discussion")).toBe(true);
    });

    it("returns true for voting", () => {
      expect(isHumanActionRequired("voting")).toBe(true);
    });

    it("returns true for night_actions", () => {
      expect(isHumanActionRequired("night_actions")).toBe(true);
    });

    it("returns false for morning_report", () => {
      expect(isHumanActionRequired("morning_report")).toBe(false);
    });

    it("returns false for lynch_resolution", () => {
      expect(isHumanActionRequired("lynch_resolution")).toBe(false);
    });
  });

  describe("getDayNumber", () => {
    it("returns current day from GameState", () => {
      mockedGameState.getState.mockReturnValue({ day: 3 } as any);
      expect(getDayNumber()).toBe(3);
    });
  });
});
