// =============================================================================
// FILE: FullMoonEngine.ts
// PURPOSE: Full Moon balance check (Stage 0/1/2) + buff application
// LOCATION: src/engine/FullMoonEngine.ts
// =============================================================================

// TODO(APPROACH): Each night, check if Full Moon should activate:
//   1. Get balance_score from BalanceCalculator
//   2. Determine stage (0/1/2) from thresholds in fullMoonConfig.json
//   3. If stage > 0, roll probability (15% per night)
//   4. If activated, apply buff to losing faction + update state
//   5. Max 3 activations per game
//
// Stage effects:
//   Stage 1: Info buff — losing faction roles get an extra investigation
//   Stage 2: Full buff — +1 action for losing faction + Zombie cure if active
//
// Collaborating files:
// - src/types/game.types.ts           — FullMoonState
// - src/types/event.types.ts          — FullMoonStage
// - src/data/fullMoonConfig.json      — thresholds, buffs, probability
// - src/engine/BalanceCalculator.ts   — provides balance_score
// - src/state/GameState.ts            — reads/updates FullMoonState
// - src/state/EventState.ts           — enqueues Full Moon event for display
// - src/engine/PhaseManager.ts        — triggers Full Moon check each night
// - src/engine/ResolutionEngine.ts    — applies buff actions during resolution
// - src/utils/probability.ts          — probability roll helper
// - src/components/events/FullMoonOverlay.tsx — renders Full Moon visual
// - src/hooks/useEvents.ts            — manages Full Moon event display

// TODO(HIGH): Implement checkFullMoon() — main check function each night
// TODO(HIGH): Implement determineStage(balanceScore) — return 0, 1, or 2
// TODO: Implement applyBuff(stage, losingFaction) — grant extra actions
// TODO: Implement cureZombie() — Stage 2 can cure active zombie infection
// TODO: Implement getLosingFaction(balanceScore) — which faction is behind
// TODO: Implement canActivate() — check activations_remaining > 0
// TODO: Implement reset() — clear Full Moon state for new game

// TODO(REVIEW): Should Full Moon buff persist for one night or one full day-night cycle?
// TODO(REVIEW): What happens if both factions are equally balanced (score ≈ 0)?
