// =============================================================================
// FILE: ChatState.ts
// PURPOSE: chat_events.json manager — stores and retrieves structured chat data
// LOCATION: src/state/ChatState.ts
// =============================================================================

import type { ChatEvent, Message, Channel } from "../types/chat.types";

// TODO: Consider message pagination for long games (Phase 6 — PublicChat.tsx)

// ---------------------------------------------------------------------------
// Internal stores
// ---------------------------------------------------------------------------

let chatEvents: ChatEvent[] = [];
let messages: Message[] = [];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Store a structured ChatEvent produced by ChatAnalyzer */
export function addChatEvent(event: ChatEvent): void {
  chatEvents.push(event);
}

/** Store a raw Message for UI rendering */
export function addMessage(message: Message): void {
  messages.push(message);
}

/** Filter ChatEvents by day number */
export function getEventsByDay(day: number): ChatEvent[] {
  return chatEvents.filter((e) => e.day === day);
}

/** Filter messages by channel ("public" or "mafia") */
export function getMessagesByChannel(channel: Channel): Message[] {
  return messages.filter((m) => m.channel === channel);
}

/** All events where playerId is speaker or target */
export function getEventsForPlayer(playerId: string): ChatEvent[] {
  return chatEvents.filter(
    (e) =>
      e.speaker === playerId ||
      e.target === playerId ||
      e.indirect_targets.some((t) => t.player_id === playerId),
  );
}

/** Last N events for AI context window */
export function getRecentEvents(count: number): ChatEvent[] {
  return chatEvents.slice(-count);
}

/** Last N messages for a given channel */
export function getRecentMessages(channel: Channel, count: number): Message[] {
  return messages.filter((m) => m.channel === channel).slice(-count);
}

/** Get all chat events */
export function getAllEvents(): ChatEvent[] {
  return chatEvents;
}

/** Clear all chat data for new game */
export function reset(): void {
  chatEvents = [];
  messages = [];
}
