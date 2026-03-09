// =============================================================================
// FILE: EventState.ts
// PURPOSE: Night Echo pending events queue + Full Moon state + Last Wish state
// LOCATION: src/state/EventState.ts
// =============================================================================

// TODO(APPROACH): Manages the event queue for all three event systems:
//   1. Night Echo events — selected during night, delivered at morning/midday
//   2. Full Moon events — triggered by FullMoonEngine when balance check passes
//   3. Last Wish events — triggered on lynch by LastWishEngine
//
// Events are queued as PendingEvent objects with a "delivered" flag.
// The hooks layer (useEvents) reads pending events and marks them delivered.
//
// Collaborating files:
// - src/types/event.types.ts          — NightEchoEvent, LastWish, PendingEvent, FullMoonStage
// - src/types/game.types.ts           — FullMoonState
// - src/engine/NightEchoEngine.ts     — enqueues selected Night Echo events
// - src/engine/FullMoonEngine.ts      — enqueues Full Moon activation
// - src/engine/LastWishEngine.ts      — enqueues Last Wish action on lynch
// - src/state/GameState.ts            — reads Full Moon state for balance checks
// - src/hooks/useEvents.ts            — reads + delivers pending events to UI
// - src/components/events/NightEchoBanner.tsx — renders Night Echo events
// - src/components/events/FullMoonOverlay.tsx — renders Full Moon visual
// - src/components/voting/LastWishBanner.tsx  — renders Last Wish announcement

// TODO(HIGH): Implement addPendingEvent(event, timing) — enqueue event
// TODO(HIGH): Implement getPendingByTiming(timing) — get morning or midday events
// TODO: Implement markDelivered(eventId) — mark event as shown to players
// TODO: Implement getUndelivered() — all events not yet displayed
// TODO: Implement getFullMoonState() — current Full Moon tracking
// TODO: Implement updateFullMoonState(state) — update after activation
// TODO: Implement getLastWish() — pending Last Wish event if any
// TODO: Implement clearNightEvents() — clear after all events delivered
// TODO: Implement reset() — clear all events for new game

// TODO(REVIEW): Should delivered events be archived or discarded?
