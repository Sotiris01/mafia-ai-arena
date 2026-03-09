// =============================================================================
// FILE: ChatState.ts
// PURPOSE: chat_events.json manager — stores and retrieves structured chat data
// LOCATION: src/state/ChatState.ts
// =============================================================================

// TODO(APPROACH): Manages the chat_events.json file that stores all ChatEvent
// objects produced by ChatAnalyzer. Also manages the raw message log for
// UI display. Separates public chat from Mafia private chat.
//
// Two data stores:
//   1. ChatEvent[] — structured semantic events (for AI memory)
//   2. Message[] — raw display messages (for UI rendering)
//
// Public chat: visible to all players
// Mafia chat: visible only to Mafia-aligned players during mafia_chat sub-phase
//
// Collaborating files:
// - src/types/chat.types.ts           — ChatEvent, Message, ActionType
// - src/engine/ChatAnalyzer.ts        — produces ChatEvent objects → addChatEvent()
// - src/state/MemoryManager.ts        — reads ChatEvents for relationship updates
// - src/ai/MessageGenerator.ts        — generates Message objects → addMessage()
// - src/ai/VoteDecision.ts            — reads chat history for recent accusations
// - src/hooks/useChat.ts              — subscribes to messages for UI updates
// - src/components/chat/PublicChat.tsx — renders public message list
// - src/components/chat/MafiaChat.tsx  — renders Mafia-only message list

// TODO(HIGH): Implement addChatEvent(event) — store structured ChatEvent
// TODO(HIGH): Implement addMessage(message) — store raw Message for UI
// TODO(HIGH): Implement getEventsByDay(day) — filter ChatEvents by day number
// TODO: Implement getMessagesByChannel(channel) — "public" or "mafia"
// TODO: Implement getEventsForPlayer(playerId) — all events where player is speaker/target
// TODO: Implement getRecentEvents(count) — last N events for AI context window
// TODO: Implement clearDayEvents() — archive previous day (keep for voting history)
// TODO: Implement reset() — clear all chat data for new game

// TODO(LOW): Consider message pagination for long games
