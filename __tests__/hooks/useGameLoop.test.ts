/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useGameLoop } from "../../src/hooks/useGameLoop";
import * as GameState from "../../src/state/GameState";
import * as PlayerState from "../../src/state/PlayerState";
import * as ChatState from "../../src/state/ChatState";
import * as EventState from "../../src/state/EventState";
import * as MemoryManager from "../../src/state/MemoryManager";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/GameState");
jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/ChatState");
jest.mock("../../src/state/EventState");
jest.mock("../../src/state/MemoryManager");
jest.mock("../../src/engine/PhaseManager");
jest.mock("../../src/engine/ChatAnalyzer");

const mockedGameState = GameState as jest.Mocked<typeof GameState>;
const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedChatState = ChatState as jest.Mocked<typeof ChatState>;
const mockedEventState = EventState as jest.Mocked<typeof EventState>;
const mockedMemoryManager = MemoryManager as jest.Mocked<typeof MemoryManager>;

const FAKE_GAME_STATE = {
  phase: "day" as const,
  sub_phase: "discussion" as const,
  day: 1,
  alive_player_ids: ["human", "ai_1", "ai_2"],
  dead_player_ids: [],
  full_moon: { is_active: false, stage: 0 as const, balance_score: 0, activations_remaining: 3, buffed_faction: null },
  zombie_player_ids: [],
  is_game_over: false,
  win_result: null,
};

const FAKE_HUMAN_PLAYER = {
  player_id: "human",
  player_name: "Player",
  role: "Sheriff" as const,
  alignment: "Town" as const,
  importance_tier: "core" as const,
  night_action: "investigate" as const,
  is_alive: true,
  appears_as: "Town" as const,
  is_zombie: false,
  is_revealed_mayor: false,
  special_rules: [],
};

beforeEach(() => {
  jest.clearAllMocks();

  mockedPlayerState.initializePlayers.mockReturnValue(["human", "ai_1", "ai_2"]);
  mockedPlayerState.getHumanPlayer.mockReturnValue(FAKE_HUMAN_PLAYER);
  mockedGameState.getState.mockReturnValue({ ...FAKE_GAME_STATE });
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useGameLoop", () => {
  describe("initial state", () => {
    it("starts with isStarted = false", () => {
      const { result } = renderHook(() => useGameLoop());
      expect(result.current.isStarted).toBe(false);
    });

    it("starts with null gameState", () => {
      const { result } = renderHook(() => useGameLoop());
      expect(result.current.gameState).toBeNull();
    });

    it("starts with null humanPlayer", () => {
      const { result } = renderHook(() => useGameLoop());
      expect(result.current.humanPlayer).toBeNull();
    });

    it("starts with empty playerIds", () => {
      const { result } = renderHook(() => useGameLoop());
      expect(result.current.playerIds).toEqual([]);
    });
  });

  describe("startGame", () => {
    it("sets isStarted to true", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      expect(result.current.isStarted).toBe(true);
    });

    it("initializes players with given count", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(12);
      });

      expect(mockedPlayerState.initializePlayers).toHaveBeenCalledWith(12);
    });

    it("initializes GameState with player IDs", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      expect(mockedGameState.init).toHaveBeenCalledWith(["human", "ai_1", "ai_2"]);
    });

    it("initializes memory for AI players only (not human)", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      // Should be called for ai_1 and ai_2, not human
      expect(mockedMemoryManager.initMemory).toHaveBeenCalledTimes(2);
      expect(mockedMemoryManager.initMemory).toHaveBeenCalledWith(
        "ai_1",
        ["human", "ai_1", "ai_2"],
      );
      expect(mockedMemoryManager.initMemory).toHaveBeenCalledWith(
        "ai_2",
        ["human", "ai_1", "ai_2"],
      );
    });

    it("exposes gameState after start", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      expect(result.current.gameState).toEqual(FAKE_GAME_STATE);
    });

    it("exposes humanPlayer after start", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      expect(result.current.humanPlayer).toEqual(FAKE_HUMAN_PLAYER);
    });

    it("exposes playerIds after start", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      expect(result.current.playerIds).toEqual(["human", "ai_1", "ai_2"]);
    });

    it("resets all state modules before initializing", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      expect(mockedGameState.reset).toHaveBeenCalled();
      expect(mockedPlayerState.reset).toHaveBeenCalled();
      expect(mockedChatState.reset).toHaveBeenCalled();
      expect(mockedEventState.reset).toHaveBeenCalled();
      expect(mockedMemoryManager.reset).toHaveBeenCalled();
    });
  });

  describe("resetGame", () => {
    it("sets isStarted back to false", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });
      expect(result.current.isStarted).toBe(true);

      act(() => {
        result.current.resetGame();
      });
      expect(result.current.isStarted).toBe(false);
    });

    it("clears gameState to null", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      act(() => {
        result.current.resetGame();
      });
      expect(result.current.gameState).toBeNull();
    });

    it("clears humanPlayer to null", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      act(() => {
        result.current.resetGame();
      });
      expect(result.current.humanPlayer).toBeNull();
    });

    it("clears playerIds to empty", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });

      act(() => {
        result.current.resetGame();
      });
      expect(result.current.playerIds).toEqual([]);
    });

    it("resets all state modules", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.resetGame();
      });

      expect(mockedGameState.reset).toHaveBeenCalled();
      expect(mockedPlayerState.reset).toHaveBeenCalled();
      expect(mockedChatState.reset).toHaveBeenCalled();
      expect(mockedEventState.reset).toHaveBeenCalled();
      expect(mockedMemoryManager.reset).toHaveBeenCalled();
    });
  });

  describe("startGame after reset", () => {
    it("can start a new game after reset", () => {
      const { result } = renderHook(() => useGameLoop());

      act(() => {
        result.current.startGame(10);
      });
      act(() => {
        result.current.resetGame();
      });
      act(() => {
        result.current.startGame(8);
      });

      expect(result.current.isStarted).toBe(true);
      expect(mockedPlayerState.initializePlayers).toHaveBeenLastCalledWith(8);
    });
  });
});
