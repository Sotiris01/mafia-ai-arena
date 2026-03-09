// =============================================================================
// FILE: _layout.tsx
// PURPOSE: Game layout — nested Expo Router layout for all game screens
// LOCATION: app/game/_layout.tsx
// =============================================================================

// TODO(APPROACH): Nested layout for game screens. Provides:
//   - Shared game UI (top bar with phase indicator, timer, day count)
//   - Navigation between game phases (no back button — phases advance linearly)
//   - Game state context available to all child screens
//
// Child routes:
//   /game/day     → day.tsx (Discussion + Mid-Day Events)
//   /game/night   → night.tsx (Night Actions + Mafia Chat)
//   /game/vote    → vote.tsx (Trial & Voting)
//   /game/morning → morning.tsx (Morning Report)
//   /game/result  → result.tsx (Game Over)
//
// Collaborating files:
// - src/hooks/useGameLoop.ts          — phase state, transitions
// - src/components/shared/Timer.tsx   — phase timer in top bar
// - src/engine/PhaseManager.ts        — current phase info
// - app/game/day.tsx                  — Day Phase screen
// - app/game/night.tsx                — Night Phase screen
// - app/game/vote.tsx                 — Vote screen
// - app/game/morning.tsx              — Morning Report screen
// - app/game/result.tsx               — Game Over screen

// TODO: Import expo-router Stack for game sub-navigation
// TODO: Render shared top bar (phase name, day count, timer)
// TODO: Disable back navigation (phases are linear)
// TODO: Pass game state context to children
// TODO(LOW): Add phase transition animation between screens
