// =============================================================================
// FILE: ChatBubble.tsx
// PURPOSE: Single message bubble component — renders one chat message
//          with sender name, text, and timestamp
// LOCATION: src/components/chat/ChatBubble.tsx
// =============================================================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Message } from "../../types/chat.types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChatBubbleProps {
  message: Message;
  /** True if this message was sent by the human player */
  isHumanPlayer: boolean;
  // TODO(Phase 4): personalityType?: PersonalityType — color styling per personality
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatBubble({ message, isHumanPlayer }: ChatBubbleProps) {
  return (
    <View
      style={[
        styles.row,
        isHumanPlayer ? styles.rowRight : styles.rowLeft,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isHumanPlayer ? styles.bubbleHuman : styles.bubbleAI,
        ]}
      >
        {!isHumanPlayer && (
          <Text style={styles.senderName}>{message.sender_name}</Text>
        )}
        <Text style={styles.text}>{message.text}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
      </View>
    </View>
  );
}

// TODO(Phase 4): Add personality-based bubble color coding
// TODO(LOW): Add message appear animation (fade-in or slide)

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 12,
    marginVertical: 3,
  },
  rowLeft: {
    alignItems: "flex-start",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "78%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleHuman: {
    backgroundColor: "#1565c0",
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: "#2a2a4a",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    color: "#8ab4f8",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    color: "#888",
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 2,
  },
});
