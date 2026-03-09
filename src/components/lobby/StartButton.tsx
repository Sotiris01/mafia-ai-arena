// =============================================================================
// FILE: StartButton.tsx
// PURPOSE: Game start button in lobby — validates settings and starts game
// LOCATION: src/components/lobby/StartButton.tsx
// =============================================================================

// TODO(APPROACH): Large "Start Game" button in the lobby. Validates:
//   - Player count is within range (7–16)
//   - Settings are configured
// Triggers game initialization flow.
//
// Collaborating files:
// - src/hooks/useGameLoop.ts          — startGame(playerCount) callback
// - src/state/GameState.ts            — initializes game state
// - src/state/PlayerState.ts          — assigns roles + personalities
// - src/components/lobby/PlayerCount.tsx — reads selected count
// - app/index.tsx                     — lobby screen parent

// TODO: Define StartButtonProps (onStart: () => void, disabled: boolean)
// TODO: Implement StartButton component
// TODO: Show loading state during game initialization
// TODO(LOW): Add dramatic "game is starting" animation transition
