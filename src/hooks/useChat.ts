// =============================================================================
// FILE: useChat.ts
// PURPOSE: Chat interaction hook — public + Mafia chat management
// LOCATION: src/hooks/useChat.ts
// =============================================================================

// TODO(APPROACH): Manages the chat experience during Discussion and Mafia Chat
// sub-phases. Handles:
//   - Displaying messages in order (public or Mafia channel)
//   - Human player text input → ChatAnalyzer processing
//   - AI player message generation (via AIEngine)
//   - Message timing and delays (Human Window)
//   - Silenced player overlay
//
// Collaborating files:
// - src/state/ChatState.ts            — reads/writes messages + chat events
// - src/engine/ChatAnalyzer.ts        — analyzes human messages
// - src/engine/AIEngine.ts            — generates AI messages during discussion
// - src/state/MemoryManager.ts        — updates memory from chat events
// - src/data/config.json              — human_window_seconds, max_messages
// - src/components/chat/PublicChat.tsx — renders public chat
// - src/components/chat/MafiaChat.tsx  — renders Mafia chat
// - src/components/chat/ChatInput.tsx  — human text input
// - src/components/chat/ChatBubble.tsx — individual message rendering
// - src/components/chat/SilencedOverlay.tsx — when human is silenced
// - app/game/day.tsx                  — uses this hook for Discussion sub-phase
// - app/game/night.tsx                — uses this hook for Mafia Chat sub-phase

// TODO(HIGH): Implement useChat(channel) hook — "public" or "mafia"
// TODO(HIGH): Implement sendMessage(text) — human player sends message
// TODO: Implement getMessages(channel) — return Message[] for display
// TODO: Implement handleAIMessages() — trigger AI message generation with delays
// TODO: Implement isSilenced(playerId) — check if player is currently silenced
// TODO: Implement getHumanWindowTimer() — countdown for human input opportunity

// TODO(REVIEW): Message ordering — timestamp-based or queue-based?
// TODO(LOW): Add typing indicator for AI players (immersion)
