// =============================================================================
// FILE: day.tsx
// PURPOSE: Day Phase screen — Discussion + Mid-Day events
// LOCATION: app/game/day.tsx
// =============================================================================

// TODO(APPROACH): Day Phase has sub-phases:
//   1. Discussion (timed) — public chat, AI players speak/accuse/defend
//   2. Mid-Day Events — Night Echo reveals, Last Wish results
//   3. (Then transitions to vote.tsx for Trial & Voting)
//
// Key mechanics:
//   - Silenced players: overlay via SilencedOverlay
//   - Mayor can reveal during Discussion
//   - AI players speak based on SpeakProbability + MessageGenerator
//   - Chat analysis via ChatAnalyzer
//
// Collaborating files:
// - src/components/chat/PublicChat.tsx     — public discussion chat
// - src/components/chat/ChatInput.tsx      — human player input
// - src/components/chat/SilencedOverlay.tsx — if human is silenced
// - src/components/events/NightEchoBanner.tsx — mid-day event banners
// - src/components/shared/Timer.tsx        — discussion timer
// - src/hooks/useChat.ts                  — chat management
// - src/hooks/useGameLoop.ts              — phase transitions
// - src/hooks/useEvents.ts                — Night Echo events
// - src/engine/PhaseManager.ts            — sub-phase sequencing
// - src/ai/SpeakProbability.ts            — AI speak decisions
// - src/ai/MessageGenerator.ts            — AI message content

// TODO: Render PublicChat + ChatInput
// TODO: Show Timer for discussion countdown
// TODO: Handle sub-phase transitions (Discussion → Mid-Day Events)
// TODO: Show NightEchoBanner during Mid-Day Events
// TODO: Check if human player is silenced → show SilencedOverlay
// TODO: Transition to /game/vote when day ends
// TODO(LOW): Add Mayor reveal button if human is Mayor
