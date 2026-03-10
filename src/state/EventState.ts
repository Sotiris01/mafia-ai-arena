// =============================================================================
// FILE: EventState.ts
// PURPOSE: Night Echo pending events queue + Full Moon state + Last Wish state
// LOCATION: src/state/EventState.ts
// =============================================================================

import type {
  EventTiming,
  PendingEvent,
  LastWish,
  NightEchoEvent,
} from "../types/event.types";

// TODO: Decide if delivered events should be archived for end-game recap (Phase 5)

// ---------------------------------------------------------------------------
// Internal stores
// ---------------------------------------------------------------------------

let pendingEvents: PendingEvent[] = [];
let lastWish: LastWish | null = null;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Enqueue a pending event with timing (morning / midday) */
export function addPendingEvent(
  event: Omit<PendingEvent, "delivered">,
): PendingEvent {
  const pending: PendingEvent = {
    ...event,
    delivered: false,
  };
  pendingEvents.push(pending);
  return pending;
}

/** Get events scheduled for a specific timing (morning / midday) */
export function getPendingByTiming(timing: EventTiming): PendingEvent[] {
  return pendingEvents.filter((e) => e.timing === timing && !e.delivered);
}

/** Mark a specific event as delivered (by index in the pending list) */
export function markDelivered(index: number): void {
  if (index >= 0 && index < pendingEvents.length) {
    pendingEvents[index].delivered = true;
  }
}

/** Get all events not yet displayed */
export function getUndelivered(): PendingEvent[] {
  return pendingEvents.filter((e) => !e.delivered);
}

/** Set or replace the current Last Wish event */
export function setLastWish(wish: LastWish): void {
  lastWish = wish;
}

/** Get the pending Last Wish event if any */
export function getLastWish(): LastWish | null {
  return lastWish;
}

/** Clear Last Wish after it has been processed */
export function clearLastWish(): void {
  lastWish = null;
}

/** Clear delivered events after all have been shown */
export function clearDeliveredEvents(): void {
  pendingEvents = pendingEvents.filter((e) => !e.delivered);
}

/** Clear all night-cycle events (called at end of morning announcements) */
export function clearNightEvents(): void {
  pendingEvents = [];
}

/** Clear all events for new game */
export function reset(): void {
  pendingEvents = [];
  lastWish = null;
}
