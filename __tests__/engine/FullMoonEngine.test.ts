// =============================================================================
// FILE: FullMoonEngine.test.ts
// PURPOSE: Tests for Full Moon balance mechanic (3 stages)
// LOCATION: __tests__/engine/FullMoonEngine.test.ts
// =============================================================================

// TODO(APPROACH): Test Full Moon mechanic:
//   - Balance score calculation (Town vs Mafia strength ratio)
//   - Stage thresholds: Stage 0 (≤0.05), Stage 1 (0.05-0.15), Stage 2 (>0.15)
//   - Buff application per stage
//   - Trigger probability (0.15 per night when imbalanced)
//   - Stage transitions
//
// Collaborating files:
// - src/engine/FullMoonEngine.ts       — module under test
// - src/engine/BalanceCalculator.ts     — balance score input
// - src/data/fullMoonConfig.json       — thresholds + buffs
// - src/types/event.types.ts           — FullMoonStage

// TODO: describe("FullMoonEngine")
// TODO: Test Stage 0 — balanced game, no buffs
// TODO: Test Stage 1 — slight imbalance, minor buffs
// TODO: Test Stage 2 — major imbalance, strong buffs
// TODO: Test stage transition from 0→1→2
// TODO: Test buff application to weaker faction
// TODO: Test trigger probability (0.15 per night)
// TODO: Test balance score edge cases (all Town dead, all Mafia dead)
// TODO(LOW): Test Full Moon interaction with Night Echo E06
