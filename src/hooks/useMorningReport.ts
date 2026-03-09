// =============================================================================
// FILE: useMorningReport.ts
// PURPOSE: Morning report assembly + delivery — deaths, events, Full Moon
// LOCATION: src/hooks/useMorningReport.ts
// =============================================================================

// TODO(APPROACH): Assembles and delivers the Morning Report at the start
// of each day. The report includes:
//   1. Deaths from last night (names only — NO role reveal)
//   2. Morning-timed Night Echo events (🌅 events)
//   3. Full Moon announcements (if activated)
//   4. Zombie status changes (if any)
//   5. Any other overnight effects
//
// The report is displayed sequentially with dramatic timing.
//
// Collaborating files:
// - src/state/GameState.ts            — reads deaths from last night
// - src/state/EventState.ts           — reads morning-timed pending events
// - src/engine/FullMoonEngine.ts      — Full Moon activation announcements
// - src/engine/NightEchoEngine.ts     — Night Echo events for morning
// - src/components/night/MorningReport.tsx — renders report items
// - src/components/events/NightEchoBanner.tsx — renders morning events
// - src/components/events/FullMoonOverlay.tsx — Full Moon visual
// - src/hooks/useGameLoop.ts          — triggers morning report on day transition
// - app/game/morning.tsx              — uses this hook

// TODO(HIGH): Implement useMorningReport() hook — { reportItems, isComplete, advance }
// TODO: Implement assembleMorningReport() — gather deaths + events + announcements
// TODO: Implement getDeathAnnouncements() — format death messages (no role reveal)
// TODO: Implement getMorningEvents() — filter events with timing = "morning"
// TODO: Implement getFullMoonAnnouncement() — if Full Moon activated
// TODO: Implement markReportComplete() — signal to advance to discussion

// TODO(REVIEW): Report pacing — delay between items for dramatic effect
// TODO(LOW): Add sound effects per report item type
