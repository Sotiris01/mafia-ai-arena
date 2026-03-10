// =============================================================================
// FILE: useGameLoop.ts
// PURPOSE: Main gameplay loop hook — orchestrates Steps 1–5 of the
//          Gameplay Loop, drives phase transitions and AI actions
// LOCATION: src/hooks/useGameLoop.ts
// =============================================================================

// Phase 3 — Minimal implementation: startGame + state exposure.
// Full loop (AI turns, phase transitions, win checks) added in Phase 4–5.

import { useState, useCallback } from "react";
import type { GameState as GameStateType, Phase, SubPhase } from "../types/game.types";
import type { PlayerRole } from "../types/player.types";
import * as GameState from "../state/GameState";
import * as PlayerState from "../state/PlayerState";
import * as ChatState from "../state/ChatState";
import * as EventState from "../state/EventState";
import * as MemoryManager from "../state/MemoryManager";

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
  // TODO(Phase 4): advancePhase() — trigger PhaseManager transitions
  // TODO(Phase 4): runAITurn() — execute AI actions for current sub-phase
  // TODO(Phase 5): handleWinCondition(result) — navigate to result screen
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGameLoop(): GameLoopState & GameLoopActions {
  const [isStarted, setIsStarted] = useState(false);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [humanPlayer, setHumanPlayer] = useState<PlayerRole | null>(null);
  const [playerIds, setPlayerIds] = useState<string[]>([]);

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

  return {
    isStarted,
    gameState,
    humanPlayer,
    playerIds,
    startGame,
    resetGame,
  };
}

// TODO(Phase 4): Add advancePhase() using PhaseManager.advanceSubPhase()
// TODO(Phase 4): Add runAITurn() using AIEngine.runDiscussionTurn()
// TODO(Phase 5): Add handleWinCondition() + navigate to result screen
// TODO(Phase 5): Add pauseGame() / resumeGame() for background handling
// TODO(LOW): Add game state persistence via AsyncStorage for resume-after-close
