// =============================================================================
// FILE: morning.tsx
// PURPOSE: Morning Report screen — deaths, events, Full Moon status
// LOCATION: app/game/morning.tsx
// =============================================================================

// TODO(APPROACH): Morning Report is shown at the start of each day.
// Assembles and displays:
//   1. Night deaths (who died, cause — unless Janitor cleaned)
//   2. Night Echo event results (visible effects)
//   3. Full Moon status update (stage changes, buff announcements)
//   4. Zombie infection announcements
//   5. Special announcements (Mayor reveal fallout, etc.)
//
// Collaborating files:
// - src/components/night/MorningReport.tsx — report content component
// - src/components/events/FullMoonOverlay.tsx — Full Moon visual
// - src/components/events/ZombieIndicator.tsx — zombie status
// - src/hooks/useMorningReport.ts         — report assembly
// - src/hooks/useEvents.ts                — event results
// - src/engine/FullMoonEngine.ts           — Full Moon stage check
// - src/state/GameState.ts                — zombie tracking

// TODO: Call useMorningReport to assemble report data
// TODO: Show death announcements (with Janitor clean check)
// TODO: Show Night Echo event results
// TODO: Show Full Moon status changes
// TODO: Show zombie infection notices
// TODO: "Continue" button → transition to /game/day
// TODO: Check WinChecker before advancing (game may end)
// TODO(LOW): Add death reveal animation
