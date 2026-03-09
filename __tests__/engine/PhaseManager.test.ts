// =============================================================================
// FILE: PhaseManager.test.ts
// PURPOSE: Tests for phase transitions + sub-phase sequencing
// LOCATION: __tests__/engine/PhaseManager.test.ts
// =============================================================================

// TODO(APPROACH): Test phase management:
//   - Phase cycle: Night → Morning → Day → Vote → Night...
//   - Sub-phase sequencing within each phase
//   - Timer management per sub-phase
//   - Day count increment
//   - Phase skip conditions (e.g., skip vote if no accusation)
//
// Collaborating files:
// - src/engine/PhaseManager.ts         — module under test
// - src/types/game.types.ts            — Phase, SubPhase
// - src/data/config.json               — timer defaults

// TODO: describe("PhaseManager")
// TODO: Test full phase cycle (Night → Morning → Day → Vote → Night)
// TODO: Test sub-phase sequencing within Day Phase
// TODO: Test sub-phase sequencing within Night Phase
// TODO: Test day count increments each cycle
// TODO: Test timer durations from config
// TODO: Test skip vote when no accusation made
// TODO(LOW): Test phase transition callbacks fire
