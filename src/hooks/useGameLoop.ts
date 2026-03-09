// =============================================================================
// FILE: useGameLoop.ts
// PURPOSE: Main gameplay loop hook — orchestrates Steps 1–5 of the
//          Gameplay Loop, drives phase transitions and AI actions
// LOCATION: src/hooks/useGameLoop.ts
// =============================================================================

// TODO(APPROACH): Top-level React hook that connects the Engine layer to
// the App layer. Manages the main game cycle:
//   Step 1: Morning Report (deaths, events, Full Moon)
//   Step 2: Discussion (chat loop with AI players)
//   Step 3: Trial & Vote (accusation → defense → vote)
//   Step 4: Night (Mafia chat → night actions → resolution)
//   Step 5: Check win conditions → loop or end
//
// Returns game state + action handlers for the UI screens.
//
// Collaborating files:
// - src/engine/PhaseManager.ts        — phase transitions
// - src/engine/AIEngine.ts            — AI player actions per sub-phase
// - src/engine/WinChecker.ts          — win condition evaluation
// - src/state/GameState.ts            — current game state
// - src/hooks/useChat.ts              — chat sub-hook for discussion
// - src/hooks/useVoting.ts            — voting sub-hook for trial
// - src/hooks/useNightActions.ts      — night action sub-hook
// - src/hooks/useMorningReport.ts     — morning report assembly
// - src/hooks/useEvents.ts            — event delivery
// - app/game/_layout.tsx              — consumes this hook for screen routing

// TODO(HIGH): Implement useGameLoop() hook returning { gameState, actions, phase }
// TODO(HIGH): Implement startGame(playerCount) — initialize all state + assign roles
// TODO: Implement advancePhase() — trigger PhaseManager transitions
// TODO: Implement runAITurn() — execute AI actions for current sub-phase
// TODO: Implement handleWinCondition(result) — navigate to result screen
// TODO: Implement pauseGame() / resumeGame() — background handling
// TODO: Implement resetGame() — clear all state for new game

// TODO(REVIEW): State update batching — avoid excessive re-renders
// TODO(LOW): Add game state persistence for resume-after-close
