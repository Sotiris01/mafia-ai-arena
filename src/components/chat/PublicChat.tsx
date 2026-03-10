// =============================================================================
// FILE: PublicChat.tsx
// PURPOSE: Public chat container — renders public message list + input
// LOCATION: src/components/chat/PublicChat.tsx
// =============================================================================

import React, { useRef } from "react";
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import type { Message } from "../../types/chat.types";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PublicChatProps {
  messages: Message[];
  onSend: (text: string) => void;
  /** True if the human player is silenced this day */
  isSilenced?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PublicChat({
  messages,
  onSend,
  isSilenced = false,
}: PublicChatProps) {
  const listRef = useRef<FlatList<Message>>(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            isHumanPlayer={item.is_human}
          />
        )}
        contentContainerStyle={styles.list}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
      />

      <ChatInput onSend={onSend} disabled={isSilenced} />
    </KeyboardAvoidingView>
  );
}

// TODO(Phase 4): Show AI typing indicators between messages
// TODO(Phase 5): Show SilencedOverlay component when isSilenced
// TODO(Phase 5): Handle mid-day event interruption (pause chat, show event)
// TODO(LOW): Add pull-to-scroll history for older messages

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  list: {
    paddingVertical: 8,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
