// =============================================================================
// FILE: Timer.tsx
// PURPOSE: Phase timer — countdown display for all timed phases
// LOCATION: src/components/shared/Timer.tsx
// =============================================================================

// TODO(APPROACH): Reusable countdown timer displayed during timed phases
// (Discussion, Trial, Voting, Night Actions). Shows mm:ss format.
// Changes color as time runs low (green → yellow → red).
//
// Collaborating files:
// - src/data/config.json              — timer durations per phase
// - src/engine/PhaseManager.ts        — provides timer duration
// - src/utils/formatters.ts           — formatTime(seconds)
// - src/hooks/useGameLoop.ts          — timer management
// - app/game/day.tsx                  — discussion + trial timers
// - app/game/vote.tsx                 — voting timer
// - app/game/night.tsx                — night action timer

// TODO: Define TimerProps (seconds: number, onExpire: () => void, isWarning?: boolean)
// TODO: Implement Timer component with countdown logic
// TODO: Color coding: green → yellow (30s) → red (10s)
// TODO: Call onExpire callback when timer reaches 0
// TODO(LOW): Add tick sound effect in final seconds
