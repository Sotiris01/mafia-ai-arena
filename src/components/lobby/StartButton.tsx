// =============================================================================
// FILE: StartButton.tsx
// PURPOSE: Game start button in lobby — validates settings and starts game
// LOCATION: src/components/lobby/StartButton.tsx
// =============================================================================

import React from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StartButtonProps {
  onStart: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StartButton({
  onStart,
  disabled = false,
  loading = false,
}: StartButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={onStart}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.text, isDisabled && styles.textDisabled]}>
          Start Game
        </Text>
      )}
    </Pressable>
  );
}

// TODO(LOW): Add dramatic "game is starting" animation transition
// TODO(LOW): Haptic feedback on press (expo-haptics)

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#e94560",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
    minHeight: 56,
  },
  buttonDisabled: {
    backgroundColor: "#4a2030",
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
  },
  textDisabled: {
    color: "#999",
  },
});
