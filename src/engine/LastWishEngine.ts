// =============================================================================
// FILE: LastWishEngine.ts
// PURPOSE: Last Wish trigger on lynch — 40% chance, 4 action types
// LOCATION: src/engine/LastWishEngine.ts
// =============================================================================

// TODO(APPROACH): After a player is lynched, there's a 40% chance of a
// Last Wish event. The action type is randomly selected (not player-chosen):
//   1. Reveal Evidence (30%) — reveals clue about random player's alignment
//   2. Force Public Vote (25%) — triggers immediate re-vote on different player
//   3. Expose Alignment (25%) — reveals lynched player's true alignment
//   4. Curse (20%) — random alive player is silenced next day
//
// Last Wish fires after lynch_resolution sub-phase, before night transition.
// The effect is immediate and cannot be blocked.
//
// Collaborating files:
// - src/types/event.types.ts          — LastWish, LastWishActionType
// - src/data/lastWishActions.json     — action definitions + probability weights
// - src/data/config.json              — last_wish_probability (0.40)
// - src/state/EventState.ts           — enqueue Last Wish event for display
// - src/state/GameState.ts            — reads alive players for target selection
// - src/engine/PhaseManager.ts        — triggers during lynch_resolution sub-phase
// - src/engine/WinChecker.ts          — re-check after Last Wish effects
// - src/utils/probability.ts          — probability roll + weighted selection
// - src/components/voting/LastWishBanner.tsx — renders Last Wish announcement
// - src/hooks/useEvents.ts            — manages Last Wish display

// TODO(HIGH): Implement checkLastWish(lynchedPlayerId) — 40% chance trigger
// TODO(HIGH): Implement selectAction() — weighted random from 4 action types
// TODO: Implement executeRevealEvidence() — reveal random player's alignment
// TODO: Implement executeForceVote() — trigger immediate re-vote
// TODO: Implement executeExposeAlignment(lynchedPlayerId) — show true alignment
// TODO: Implement executeCurse() — silence random alive player
// TODO: Implement createLastWishEvent(action, target) — produce LastWish object

// TODO(REVIEW): Force Public Vote — does this interrupt the normal phase flow?
// TODO(REVIEW): Can Curse target the human player?
