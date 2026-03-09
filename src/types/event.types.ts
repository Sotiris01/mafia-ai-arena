// =============================================================================
// FILE: event.types.ts
// PURPOSE: Event system types — NightEchoEvent, LastWish, FullMoon,
//          EventTiming, NightEchoEventId
// LOCATION: src/types/event.types.ts
// =============================================================================

// TODO(APPROACH): Three event systems share types here:
// 1. Night Echo Events (E01–E14) — triggered during night, revealed morning/mid-day
// 2. Last Wish — 40% chance on lynch, 4 action types
// 3. Full Moon — balance mechanic with 3 stages
// EventTiming determines when events are displayed to players.
//
// Collaborating files:
// - src/engine/NightEchoEngine.ts   — selects events using NightEchoEvent definitions
// - src/engine/LastWishEngine.ts    — triggers LastWish actions on lynch
// - src/engine/FullMoonEngine.ts    — manages FullMoon staging
// - src/state/EventState.ts         — stores pending events + Full Moon state
// - src/data/nightEchoEvents.json   — static E01–E14 event configs
// - src/data/lastWishActions.json   — Last Wish action type definitions
// - src/data/fullMoonConfig.json    — stage thresholds + buff definitions
// - src/ai/EventReaction.ts         — AI reaction to events (weight → memory)
// - src/types/memory.types.ts       — EventWitnessed uses NightEchoEventId
// - src/components/events/NightEchoBanner.tsx — renders Night Echo events
// - src/components/events/FullMoonOverlay.tsx — renders Full Moon visual
// - src/hooks/useEvents.ts          — manages event lifecycle in UI

// TODO(HIGH): Define EventTiming type
// - "morning" | "midday"
// - morning: displayed in Morning Report phase
// - midday: interrupts Discussion phase as mid-day events

// TODO(HIGH): Define NightEchoEventId type (14 events)
// - "E01" | "E02" | "E03" | "E04" | "E05" | "E06" | "E07"
// - "E08" | "E09" | "E10" | "E11" | "E12" | "E13" | "E14"

// TODO(HIGH): Define NightEchoEvent interface
// - id: NightEchoEventId
// - name: string
// - timing: EventTiming
// - probability: number              (0.10 – 0.40)
// - linked_roles: Role[]             — import from player.types.ts
// - suspicion_weight: number         — impact on AI memory
// - description_template: string     — template with {player} placeholders

// TODO: Define LastWishActionType
// - "reveal_evidence" | "force_public_vote" | "expose_alignment" | "curse"

// TODO: Define LastWish interface
// - action: LastWishActionType
// - target_id?: string               — player affected (if applicable)
// - day: number
// - lynched_player_id: string        — who was lynched to trigger this

// TODO: Define FullMoonStage type
// - 0 | 1 | 2
// - Stage 0: no effect (balance score < 0.05)
// - Stage 1: info buff for losing faction (score ≥ 0.05)
// - Stage 2: full buff + Zombie cure (score ≥ 0.15)

// TODO: Define PendingEvent interface (for EventState queue)
// - event: NightEchoEvent | LastWish
// - timing: EventTiming
// - night: number
// - delivered: boolean

// TODO: Export all types
