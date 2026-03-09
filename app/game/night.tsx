// =============================================================================
// FILE: night.tsx
// PURPOSE: Night Phase screen — role actions + Mafia chat
// LOCATION: app/game/night.tsx
// =============================================================================

// TODO(APPROACH): Night Phase sub-phases:
//   1. Pre-Action — Night Echo events may trigger
//   2. Night Actions — each role acts in resolution order (phases 0-6)
//   3. Mafia Chat — Mafia-only private discussion
//   4. Post-Action — results queued for morning
//
// Key mechanics:
//   - 7-phase Night Resolution order (Passive → Info-Alter → Investigate →
//     Kill&Protect → Post-Kill → Passive-Info → Cleanup)
//   - Human player: shown NightAction UI for their role
//   - AI players: NightDecision calculates targets
//   - Mafia members see MafiaChat
//   - Night Echo events trigger with probability
//
// Collaborating files:
// - src/components/night/NightAction.tsx   — human's night action UI
// - src/components/chat/MafiaChat.tsx      — Mafia private chat
// - src/components/events/NightEchoBanner.tsx — Night Echo overlay
// - src/hooks/useNightActions.ts           — night action management
// - src/hooks/useChat.ts                   — Mafia chat management
// - src/hooks/useEvents.ts                — Night Echo lifecycle
// - src/engine/ResolutionEngine.ts         — 7-phase resolution
// - src/ai/NightDecision.ts               — AI target selection

// TODO: Check human player's role → show NightAction UI
// TODO: If human is Mafia → show MafiaChat alongside actions
// TODO: Run AI night decisions via NightDecision module
// TODO: Process Night Echo events
// TODO: Transition to /game/morning when night resolves
// TODO(LOW): Add night ambience/UI overlay
