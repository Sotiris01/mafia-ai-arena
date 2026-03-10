/**
 * @jest-environment jsdom
 */

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { GameProvider, useGame } from "../../src/contexts/GameContext";
import * as GameState from "../../src/state/GameState";
import * as PlayerState from "../../src/state/PlayerState";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../../src/state/GameState");
jest.mock("../../src/state/PlayerState");
jest.mock("../../src/state/ChatState");
jest.mock("../../src/state/EventState");
jest.mock("../../src/state/MemoryManager");

const mockedPlayerState = PlayerState as jest.Mocked<typeof PlayerState>;
const mockedGameState = GameState as jest.Mocked<typeof GameState>;

const FAKE_STATE = {
  phase: "day" as const,
  sub_phase: "discussion" as const,
  day: 1,
  alive_player_ids: ["human", "ai_1"],
  dead_player_ids: [],
  full_moon: { is_active: false, stage: 0 as const, balance_score: 0, activations_remaining: 3, buffed_faction: null },
  zombie_player_ids: [],
  is_game_over: false,
  win_result: null,
};

const FAKE_HUMAN = {
  player_id: "human",
  player_name: "Player",
  role: "Doctor" as const,
  alignment: "Town" as const,
  importance_tier: "core" as const,
  night_action: "protect" as const,
  is_alive: true,
  appears_as: "Town" as const,
  is_zombie: false,
  is_revealed_mayor: false,
  special_rules: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedPlayerState.initializePlayers.mockReturnValue(["human", "ai_1"]);
  mockedPlayerState.getHumanPlayer.mockReturnValue(FAKE_HUMAN);
  mockedGameState.getState.mockReturnValue({ ...FAKE_STATE });
});

// ---------------------------------------------------------------------------
// Wrapper
// ---------------------------------------------------------------------------

function wrapper({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GameContext", () => {
  describe("useGame outside provider", () => {
    it("throws when used outside GameProvider", () => {
      // Suppress React error boundary console output
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useGame());
      }).toThrow("useGame must be used within a <GameProvider>");

      spy.mockRestore();
    });
  });

  describe("useGame inside provider", () => {
    it("provides initial state (not started)", () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      expect(result.current.isStarted).toBe(false);
      expect(result.current.gameState).toBeNull();
      expect(result.current.humanPlayer).toBeNull();
      expect(result.current.playerIds).toEqual([]);
    });

    it("exposes startGame function", () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      expect(typeof result.current.startGame).toBe("function");
    });

    it("exposes resetGame function", () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      expect(typeof result.current.resetGame).toBe("function");
    });

    it("startGame updates state through context", () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame(10);
      });

      expect(result.current.isStarted).toBe(true);
      expect(result.current.gameState).toEqual(FAKE_STATE);
      expect(result.current.humanPlayer).toEqual(FAKE_HUMAN);
      expect(result.current.playerIds).toEqual(["human", "ai_1"]);
    });

    it("resetGame clears state through context", () => {
      const { result } = renderHook(() => useGame(), { wrapper });

      act(() => {
        result.current.startGame(10);
      });

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.isStarted).toBe(false);
      expect(result.current.gameState).toBeNull();
      expect(result.current.humanPlayer).toBeNull();
    });

    it("shares state across multiple consumers", () => {
      const { result: consumer1 } = renderHook(() => useGame(), { wrapper });
      // Both consumers get same initial state shape
      expect(consumer1.current.isStarted).toBe(false);
      expect(typeof consumer1.current.startGame).toBe("function");
    });
  });
});
