// =============================================================================
// FILE: PlayerCount.tsx
// PURPOSE: Player count selector (7–16) in game lobby
// LOCATION: src/components/lobby/PlayerCount.tsx
// =============================================================================

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import config from "../../data/config.json";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PlayerCountProps {
  value: number;
  onChange: (count: number) => void;
}

// ---------------------------------------------------------------------------
// Tier label helper
// ---------------------------------------------------------------------------

const TIER_LABELS: { min: number; label: string }[] = [
  { min: 13, label: "Expanded" },
  { min: 10, label: "Advanced" },
  { min: 8, label: "Important" },
  { min: 7, label: "Core" },
];

function getTierLabel(count: number): string {
  for (const t of TIER_LABELS) {
    if (count >= t.min) return t.label;
  }
  return "Core";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MIN = config.total_players.min; // 7
const MAX = config.total_players.max; // 16

export default function PlayerCount({ value, onChange }: PlayerCountProps) {
  const canDecrement = value > MIN;
  const canIncrement = value < MAX;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Players</Text>

      <View style={styles.stepper}>
        <Pressable
          style={[styles.btn, !canDecrement && styles.btnDisabled]}
          onPress={() => canDecrement && onChange(value - 1)}
          disabled={!canDecrement}
        >
          <Text style={[styles.btnText, !canDecrement && styles.btnTextDisabled]}>−</Text>
        </Pressable>

        <Text style={styles.value}>{value}</Text>

        <Pressable
          style={[styles.btn, !canIncrement && styles.btnDisabled]}
          onPress={() => canIncrement && onChange(value + 1)}
          disabled={!canIncrement}
        >
          <Text style={[styles.btnText, !canIncrement && styles.btnTextDisabled]}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.tier}>Tier: {getTierLabel(value)}</Text>
      <Text style={styles.range}>{MIN}–{MAX} players</Text>
    </View>
  );
}

// TODO(LOW): Add player count recommendation based on first-time vs experienced

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2a2a4a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  btnTextDisabled: {
    color: "#666",
  },
  value: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "800",
    minWidth: 64,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  tier: {
    color: "#4a9eff",
    fontSize: 13,
    fontWeight: "600",
  },
  range: {
    color: "#666",
    fontSize: 11,
  },
});
