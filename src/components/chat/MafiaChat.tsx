// =============================================================================
// FILE: MafiaChat.tsx
// PURPOSE: Private Mafia chat container — visible only to Mafia players
// LOCATION: src/components/chat/MafiaChat.tsx
// =============================================================================

// TODO(APPROACH): Similar to PublicChat but for the Mafia private channel.
// Only visible during the mafia_chat sub-phase to Mafia-aligned players.
// If human player is Town, they see a "waiting" screen instead.
//
// Collaborating files:
// - src/hooks/useChat.ts              — provides messages for "mafia" channel
// - src/components/chat/ChatBubble.tsx — renders Mafia messages
// - src/components/chat/ChatInput.tsx  — Mafia chat input
// - src/state/PlayerState.ts          — check if human is Mafia
// - app/game/night.tsx                — parent screen during night

// TODO(HIGH): Implement MafiaChat component
// TODO: Show "Mafia is planning..." wait screen for non-Mafia human
// TODO: Show Mafia chat for Mafia-aligned human player
// TODO: Include Mafia kill target voting UI
// TODO(LOW): Add visual distinction from public chat (dark theme?)
