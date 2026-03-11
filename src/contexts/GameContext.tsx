// =============================================================================
// FILE: GameContext.tsx
// PURPOSE: React context that shares useGameLoop state across all screens
// LOCATION: src/contexts/GameContext.tsx
// =============================================================================

import React, { createContext, useContext } from "react";
import {
  useGameLoop,
  type GameLoopState,
  type GameLoopActions,
} from "../hooks/useGameLoop";

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type GameContextValue = GameLoopState & GameLoopActions;

const GameContext = createContext<GameContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gameLoop = useGameLoop();
  return (
    <GameContext.Provider value={gameLoop}>{children}</GameContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error("useGame must be used within a <GameProvider>");
  }
  return ctx;
}

// TODO(Phase 5): Add pauseGame / resumeGame for app background handling
