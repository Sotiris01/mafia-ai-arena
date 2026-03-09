// =============================================================================
// FILE: index.tsx
// PURPOSE: Home / Lobby screen — player count, role preview, game start
// LOCATION: app/index.tsx
// =============================================================================

// TODO(APPROACH): Main lobby screen. Uses lobby/ components:
//   1. PlayerCount selector (7–16)
//   2. RolePreview showing roles at current count
//   3. StartButton to initialize and begin the game
//
// On "Start Game":
//   - Calls useGameLoop.startGame(playerCount)
//   - Navigates to /game/night (game always starts at Night Phase 0)
//
// Collaborating files:
// - src/components/lobby/PlayerCount.tsx  — count selector
// - src/components/lobby/RolePreview.tsx  — role distribution preview
// - src/components/lobby/StartButton.tsx  — start button
// - src/hooks/useGameLoop.ts              — startGame()
// - src/state/GameState.ts                — init game state
// - src/state/PlayerState.ts              — assign roles + personalities
// - app/_layout.tsx                       — parent layout

// TODO: Render PlayerCount, RolePreview, StartButton
// TODO: Manage playerCount state locally
// TODO: On start → initialize game → router.push("/game/night")
// TODO(LOW): Add game rules / how-to-play link
