// =============================================================================
// FILE: NightEchoEngine.ts
// PURPOSE: Night Echo event selection — E01–E14, max 2 per night,
//          weighted random, filtered by alive roles
// LOCATION: src/engine/NightEchoEngine.ts
// =============================================================================

// TODO(APPROACH): Each night, select 0–2 Night Echo events from the E01–E14
// catalog. Selection uses weighted random with filters:
//   1. Filter events by linked_roles — at least one linked role must be alive
//   2. Apply probability weights from nightEchoEvents.json
//   3. Select up to 2 events (configurable via config.json)
//   4. Assign timing (morning or midday) per event definition
//   5. Enqueue selected events in EventState
//
// Events add suspicion and drama without revealing hard information.
// AI players react to events via EventReaction module.
//
// Collaborating files:
// - src/types/event.types.ts          — NightEchoEvent, NightEchoEventId, EventTiming
// - src/data/nightEchoEvents.json     — static E01–E14 event definitions
// - src/data/config.json              — night_echo_max_per_night (2)
// - src/state/EventState.ts           — enqueue selected events
// - src/state/PlayerState.ts          — check which roles are alive for filtering
// - src/engine/PhaseManager.ts        — triggers event selection during night
// - src/ai/EventReaction.ts           — AI processes events (weight → memory)
// - src/utils/probability.ts          — weighted random selection helper
// - src/components/events/NightEchoBanner.tsx — renders event banners

// TODO(HIGH): Implement selectEvents(aliveRoles) — return selected NightEchoEvent[]
// TODO(HIGH): Implement filterByAliveRoles(events, aliveRoles) — remove invalid events
// TODO: Implement weightedSelection(events, maxCount) — weighted random pick
// TODO: Implement fillEventTemplate(event, context) — replace {player} placeholders
// TODO: Implement enqueueEvents(events) — send to EventState
// TODO: Implement getEventHistory() — track which events fired (prevent repeats?)

// TODO(REVIEW): Should events repeat across nights or be unique per game?
// TODO(LOW): Add event chaining — some events could trigger follow-ups
