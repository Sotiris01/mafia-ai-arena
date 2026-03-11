// =============================================================================
// FILE: useChat.ts
// PURPOSE: Chat interaction hook — public + Mafia chat management
// LOCATION: src/hooks/useChat.ts
// =============================================================================

// Phase 3 — Human-only public chat.
// Phase 4 — AI discussion integration: human messages are analyzed,
//           AI messages injected via addAIMessages().

import { useState, useCallback } from "react";
import type { Message, Channel } from "../types/chat.types";
import * as ChatState from "../state/ChatState";
import { analyzeHumanMessage } from "../engine/ChatAnalyzer";
import { runDiscussionRound } from "../engine/AIEngine";
import type { DiscussionResult } from "../engine/AIEngine";

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
  /** Trigger one round of AI discussion — returns generated messages */
  runAIDiscussion: () => Promise<DiscussionResult>;
  /** Inject AI messages into local state (for staggered display) */
  addAIMessages: (msgs: Message[]) => void;
  /** Whether AI discussion is currently running */
  isAITalking: boolean;
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
  const [isAITalking, setIsAITalking] = useState(false);

  /**
   * Send a human player message. The message is:
   *   1. Persisted to ChatState for AI context
   *   2. Analyzed by ChatAnalyzer to produce a ChatEvent → updates AI memory
   *   3. Added to local state for immediate UI render
   */
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

      // Persist to ChatState for AI context
      ChatState.addMessage(msg);

      // Analyze human text → ChatEvent → update AI memories
      analyzeHumanMessage(trimmed, "human");

      // Update local state for immediate UI render
      setMessages((prev) => [...prev, msg]);
    },
    [channel],
  );

  /**
   * Trigger one round of AI discussion. Returns generated messages.
   * The caller can use addAIMessages() to inject them with delays.
   */
  const runAIDiscussion = useCallback(async (): Promise<DiscussionResult> => {
    setIsAITalking(true);
    try {
      const result = await runDiscussionRound();
      return result;
    } finally {
      setIsAITalking(false);
    }
  }, []);

  /**
   * Inject AI-generated messages into local state.
   * Called by the game loop to stagger AI messages into the chat.
   */
  const addAIMessages = useCallback((msgs: Message[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  // TODO(Phase 5): Support "mafia" channel for Mafia chat sub-phase
  // TODO(Phase 5): Add isSilenced check — block sendMessage when human is silenced
  // TODO(LOW): Add typing indicator state for AI players

  return { messages, sendMessage, channel, runAIDiscussion, addAIMessages, isAITalking };
}
