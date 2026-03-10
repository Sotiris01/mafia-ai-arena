// =============================================================================
// FILE: useChat.ts
// PURPOSE: Chat interaction hook — public + Mafia chat management
// LOCATION: src/hooks/useChat.ts
// =============================================================================

// Phase 3 — Minimal implementation: human-only public chat.
// AI messages + Mafia channel + silenced overlay added in Phase 4–5.

import { useState, useCallback } from "react";
import type { Message, Channel } from "../types/chat.types";
import * as ChatState from "../state/ChatState";
import * as GameState from "../state/GameState";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseChatReturn {
  /** Messages for the active channel */
  messages: Message[];
  /** Send a human player message to the active channel */
  sendMessage: (text: string) => void;
  /** Active channel */
  channel: Channel;
}

// ---------------------------------------------------------------------------
// Counter for unique message IDs
// ---------------------------------------------------------------------------

let messageCounter = 0;

/** Reset counter when a new game starts */
export function resetMessageCounter(): void {
  messageCounter = 0;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useChat(channel: Channel = "public"): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length === 0) return;

      const msg: Message = {
        id: `msg_${++messageCounter}`,
        sender_id: "human",
        sender_name: "Player",
        text: trimmed,
        timestamp: Date.now(),
        channel,
        is_human: true,
      };

      // Persist to ChatState for AI context later
      ChatState.addMessage(msg);

      // Update local state for immediate UI render
      setMessages((prev) => [...prev, msg]);
    },
    [channel],
  );

  // TODO(Phase 4): Integrate AIEngine.runDiscussionTurn() — AI messages appear with delays
  // TODO(Phase 4): Add ChatAnalyzer.analyzeMessage() on human text → ChatEvent → memory updates
  // TODO(Phase 5): Support "mafia" channel for Mafia chat sub-phase
  // TODO(Phase 5): Add isSilenced check — block sendMessage when human is silenced
  // TODO(LOW): Add typing indicator state for AI players

  return { messages, sendMessage, channel };
}
