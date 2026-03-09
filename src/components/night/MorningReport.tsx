// =============================================================================
// FILE: MorningReport.tsx
// PURPOSE: Morning announcement composer — displays deaths/events sequentially
// LOCATION: src/components/night/MorningReport.tsx
// =============================================================================

// TODO(APPROACH): Renders the Morning Report as a sequential announcement.
// Items appear one by one with dramatic timing:
//   1. "Day X begins..."
//   2. Death announcements (NO role reveal): "PlayerA was found dead"
//   3. Night Echo morning events (if any)
//   4. Full Moon announcement (if activated)
//   5. Zombie status changes
//
// Collaborating files:
// - src/hooks/useMorningReport.ts     — provides report items + advance
// - src/utils/formatters.ts           — formatDeathMessage, formatEventTitle
// - src/components/events/NightEchoBanner.tsx — embedded event display
// - src/components/events/FullMoonOverlay.tsx — Full Moon visual
// - app/game/morning.tsx              — parent screen

// TODO(HIGH): Implement MorningReport component with sequential reveals
// TODO: Render death announcements (no role info)
// TODO: Embed Night Echo morning events
// TODO: Show Full Moon activation if applicable
// TODO: "Tap to continue" or auto-advance between items
// TODO(LOW): Add dramatic reveal animations + sound triggers
