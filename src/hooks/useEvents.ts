// =============================================================================
// FILE: useEvents.ts
// PURPOSE: Night Echo + Full Moon + Last Wish event lifecycle management
// LOCATION: src/hooks/useEvents.ts
// =============================================================================

// TODO(APPROACH): Manages the delivery and display of all three event types:
//   1. Night Echo (morning events → Morning Report, midday → Discussion interrupt)
//   2. Full Moon (morning announcement + visual overlay)
//   3. Last Wish (immediate after lynch)
//
// Event lifecycle:
//   Engine produces events → EventState queues them → useEvents delivers →
//   Components display → AI reacts (via EventReaction)
//
// Collaborating files:
// - src/state/EventState.ts           — reads pending events, marks delivered
// - src/ai/EventReaction.ts           — triggers AI reactions to events
// - src/engine/AIEngine.ts            — orchestrates AI event reactions
// - src/hooks/useMorningReport.ts     — morning events feed into report
// - src/hooks/useGameLoop.ts          — midday events interrupt discussion
// - src/components/events/NightEchoBanner.tsx — Night Echo visual
// - src/components/events/FullMoonOverlay.tsx — Full Moon visual
// - src/components/events/ZombieIndicator.tsx — Zombie status display
// - src/components/voting/LastWishBanner.tsx  — Last Wish visual
// - app/game/day.tsx                  — midday event interrupts
// - app/game/morning.tsx              — morning event delivery

// TODO(HIGH): Implement useEvents() hook — { pendingEvents, deliverEvent, activeOverlay }
// TODO: Implement getPendingByTiming(timing) — morning or midday events
// TODO: Implement deliverEvent(eventId) — mark as delivered, trigger AI reactions
// TODO: Implement getActiveOverlay() — Full Moon or Night Echo currently showing
// TODO: Implement dismissOverlay() — user acknowledges event display
// TODO: Implement triggerLastWish(lynchedPlayerId) — check + display Last Wish

// TODO(REVIEW): Mid-day event interruption — how to pause discussion UI smoothly?
// TODO(LOW): Add event dismissal animations
