import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSettings } from "../src/contexts/SettingsContext";
import config from "../src/data/config.json";

// ---------------------------------------------------------------------------
// Setting row components
// ---------------------------------------------------------------------------

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowValue}>{children}</View>
    </View>
  );
}

function ToggleButton({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          style={[
            styles.toggleBtn,
            value === opt.value && styles.toggleBtnActive,
          ]}
          onPress={() => onChange(opt.value)}
        >
          <Text
            style={[
              styles.toggleText,
              value === opt.value && styles.toggleTextActive,
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

const MIN = config.total_players.min;
const MAX = config.total_players.max;

export default function SettingsScreen() {
  const { settings, updateSettings, resetToDefaults } = useSettings();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Default player count */}
      <SettingRow label="Default Players">
        <View style={styles.stepper}>
          <Pressable
            style={[styles.stepBtn, settings.defaultPlayerCount <= MIN && styles.stepBtnDisabled]}
            onPress={() =>
              settings.defaultPlayerCount > MIN &&
              updateSettings({ defaultPlayerCount: settings.defaultPlayerCount - 1 })
            }
            disabled={settings.defaultPlayerCount <= MIN}
          >
            <Text style={styles.stepBtnText}>−</Text>
          </Pressable>
          <Text style={styles.stepValue}>{settings.defaultPlayerCount}</Text>
          <Pressable
            style={[styles.stepBtn, settings.defaultPlayerCount >= MAX && styles.stepBtnDisabled]}
            onPress={() =>
              settings.defaultPlayerCount < MAX &&
              updateSettings({ defaultPlayerCount: settings.defaultPlayerCount + 1 })
            }
            disabled={settings.defaultPlayerCount >= MAX}
          >
            <Text style={styles.stepBtnText}>+</Text>
          </Pressable>
        </View>
      </SettingRow>

      {/* Reset */}
      <Pressable style={styles.resetBtn} onPress={resetToDefaults}>
        <Text style={styles.resetText}>
          Reset to Defaults
        </Text>
      </Pressable>

      <Text style={styles.version}>Mafia AI Arena v0.1.0</Text>
    </ScrollView>
  );
}

// TODO(Phase 4): Add timer duration overrides (discussion, trial, vote, night)
// TODO(Phase 6): Add AI provider selector (Template / API / Local)
// TODO(Phase 6): Add API key input field
// TODO(LOW): Add game speed multiplier (affects all timers proportionally)

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  content: {
    padding: 24,
    gap: 24,
  },
  row: {
    gap: 10,
  },
  rowLabel: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  rowValue: {
    flexDirection: "row",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#2a2a4a",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  toggleBtnActive: {
    backgroundColor: "#1565c0",
    borderColor: "#1565c0",
  },
  toggleText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a4a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  stepBtnDisabled: {
    opacity: 0.3,
  },
  stepBtnText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  stepValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    minWidth: 40,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  resetBtn: {
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e94560",
    marginTop: 16,
  },
  resetText: {
    color: "#e94560",
    fontSize: 14,
    fontWeight: "600",
  },
  version: {
    color: "#444",
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
  },
});

