// =============================================================================
// FILE: useGameLoop.ts
// PURPOSE: Main gameplay loop hook — orchestrates Steps 1–5 of the
//          Gameplay Loop, drives phase transitions and AI actions
// LOCATION: src/hooks/useGameLoop.ts
// =============================================================================

// Phase 3 — startGame + state exposure.
// Phase 4 — Full day cycle: discussion → vote → night (skip) → morning → next day.
//           advancePhase() drives PhaseManager transitions.
//           refreshState() syncs React state with imperative modules.

import { useState, useCallback } from "react";
import type { GameState as GameStateType, SubPhase } from "../types/game.types";
import type { PlayerRole } from "../types/player.types";
import * as GameState from "../state/GameState";
import * as PlayerState from "../state/PlayerState";
import * as ChatState from "../state/ChatState";
import * as EventState from "../state/EventState";
import * as MemoryManager from "../state/MemoryManager";
import {
  advanceSubPhase,
  transitionToDay,
  transitionToNight,
} from "../engine/PhaseManager";
import { resetMessageCounter as resetChatAnalyzerCounter } from "../engine/ChatAnalyzer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GameLoopState {
  /** Whether a game is currently active */
  isStarted: boolean;
  /** Current game state snapshot (null before startGame) */
  gameState: GameStateType | null;
  /** The human player's role data (null before startGame) */
  humanPlayer: PlayerRole | null;
  /** All player IDs in the game */
  playerIds: string[];
}

export interface GameLoopActions {
  /** Initialize a new game with the given player count (7–16) */
  startGame: (playerCount: number) => void;
  /** Reset all state and return to pre-game */
  resetGame: () => void;
  /** Advance to the next sub-phase. Returns the new SubPhase or null if game over. */
  advancePhase: () => SubPhase | null;
  /** Transition from night to a new day (morning_report) */
  goToDay: () => SubPhase;
  /** Transition from day to night (mafia_chat) */
  goToNight: () => SubPhase;
  /** Re-read imperative state modules and push snapshot to React */
  refreshState: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGameLoop(): GameLoopState & GameLoopActions {
  const [isStarted, setIsStarted] = useState(false);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [humanPlayer, setHumanPlayer] = useState<PlayerRole | null>(null);
  const [playerIds, setPlayerIds] = useState<string[]>([]);

  /** Push current imperative state into React for re-render */
  const refreshState = useCallback(() => {
    try {
      setGameState({ ...GameState.getState() });
      setHumanPlayer({ ...PlayerState.getHumanPlayer() });
    } catch {
      // State not initialized yet — ignore
    }
  }, []);

  /**
   * Start a new game:
   *  1. Initialize PlayerState (role assignment)
   *  2. Initialize GameState
   *  3. Initialize MemoryManager for each AI player
   *  4. Reset ChatState and EventState
   */
  const startGame = useCallback((playerCount: number) => {
    // Reset any previous game
    GameState.reset();
    PlayerState.reset();
    ChatState.reset();
    EventState.reset();
    MemoryManager.reset();
    resetChatAnalyzerCounter();

    // 1. Assign roles + personalities to all players
    const ids = PlayerState.initializePlayers(playerCount);

    // 2. Create game state with player IDs
    GameState.init(ids);

    // 3. Initialize AI memory (skip human — human doesn't need AI memory)
    const aiIds = ids.filter((id) => id !== "human");
    for (const aiId of aiIds) {
      MemoryManager.initMemory(aiId, ids);
    }

    // 4. Reset event queues
    ChatState.reset();
    EventState.reset();

    // 5. Expose state to React
    setPlayerIds(ids);
    setHumanPlayer(PlayerState.getHumanPlayer());
    setGameState({ ...GameState.getState() });
    setIsStarted(true);
  }, []);

  /** Clear all state — return to lobby */
  const resetGame = useCallback(() => {
    GameState.reset();
    PlayerState.reset();
    ChatState.reset();
    EventState.reset();
    MemoryManager.reset();

    setIsStarted(false);
    setGameState(null);
    setHumanPlayer(null);
    setPlayerIds([]);
  }, []);

  /**
   * Advance to the next sub-phase using PhaseManager.
   * Returns the new SubPhase, or null if the game ended.
   * Automatically syncs React state after the transition.
   */
  const advancePhase = useCallback((): SubPhase | null => {
    const result = advanceSubPhase();
    refreshState();
    return result;
  }, [refreshState]);

  /**
   * Transition from night → new day (morning_report).
   * Advances day counter, applies memory decay.
   */
  const goToDay = useCallback((): SubPhase => {
    const sub = transitionToDay();
    refreshState();
    return sub;
  }, [refreshState]);

  /**
   * Transition from day → night (mafia_chat).
   */
  const goToNight = useCallback((): SubPhase => {
    const sub = transitionToNight();
    refreshState();
    return sub;
  }, [refreshState]);

  return {
    isStarted,
    gameState,
    humanPlayer,
    playerIds,
    startGame,
    resetGame,
    advancePhase,
    goToDay,
    goToNight,
    refreshState,
  };
}

// TODO(Phase 5): Add handleWinCondition() + navigate to result screen
// TODO(Phase 5): Add pauseGame() / resumeGame() for background handling
// TODO(LOW): Add game state persistence via AsyncStorage for resume-after-close
