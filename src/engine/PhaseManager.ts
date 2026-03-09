// =============================================================================
// FILE: PhaseManager.ts
// PURPOSE: Day/Night/Morning transitions + sub-phase sequencing + timer control
// LOCATION: src/engine/PhaseManager.ts
// =============================================================================

// TODO(APPROACH): Central phase controller that drives the game loop.
// Manages the transition sequence:
//   Morning Report → Discussion → Mid-Day Events → Trial → Voting →
//   Lynch Resolution → Mafia Chat → Night Actions → Night Resolution → ↩
//
// After each lynch and night resolution, calls WinChecker to see if game ends.
// Reads timer values from config.json for phase durations.
//
// Collaborating files:
// - src/types/game.types.ts           — Phase, SubPhase
// - src/state/GameState.ts            — reads/updates phase + sub_phase
// - src/engine/WinChecker.ts          — called after lynch_resolution and night_resolution
// - src/engine/ResolutionEngine.ts    — triggered during night_resolution sub-phase
// - src/engine/NightEchoEngine.ts     — triggered during night to select events
// - src/engine/FullMoonEngine.ts      — checked each night for activation
// - src/engine/LastWishEngine.ts      — triggered during lynch_resolution
// - src/engine/ChatAnalyzer.ts        — processes chat during discussion sub-phase
// - src/engine/AIEngine.ts            — orchestrates AI actions per sub-phase
// - src/state/MemoryManager.ts        — applyDecay() called on day transition
// - src/data/config.json              — timer durations
// - src/hooks/useGameLoop.ts          — subscribes to phase changes for UI

// TODO(HIGH): Implement PhaseManager class with currentPhase + subPhase state
// TODO(HIGH): Implement transitionToDay() — set morning_report, apply memory decay
// TODO(HIGH): Implement transitionToNight() — set mafia_chat, trigger event selection
// TODO(HIGH): Implement advanceSubPhase() — move to next sub-phase in sequence
// TODO: Implement checkWinConditions() — delegate to WinChecker, handle result
// TODO: Implement getTimerDuration(subPhase) — return seconds from config
// TODO: Implement isHumanActionRequired(subPhase) — check if waiting for human input
// TODO: Implement getDayNumber() — current day count

// TODO(REVIEW): Should phase transitions be event-driven or polling-based?
// TODO(LOW): Add phase transition animations/delays for dramatic effect
