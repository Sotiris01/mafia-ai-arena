// =============================================================================
// FILE: ChatInput.tsx
// PURPOSE: Text input component for human player messages
// LOCATION: src/components/chat/ChatInput.tsx
// =============================================================================

import React, { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={text}
        onChangeText={setText}
        placeholder={disabled ? "You are silenced 🔇" : placeholder}
        placeholderTextColor="#666"
        editable={!disabled}
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <Pressable
        style={[styles.sendBtn, (disabled || text.trim().length === 0) && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={disabled || text.trim().length === 0}
      >
        <Text style={styles.sendText}>➤</Text>
      </Pressable>
    </View>
  );
}

// TODO(Phase 4): Show human window countdown timer
// TODO(Phase 5): Show SilencedOverlay when disabled due to Silencer role
// TODO(LOW): Add character limit indicator

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#1a1a2e",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2a4a",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputDisabled: {
    opacity: 0.4,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1565c0",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#333",
    opacity: 0.5,
  },
  sendText: {
    color: "#fff",
    fontSize: 20,
  },
});
