import { View, Text, StyleSheet } from "react-native";

// TODO(HIGH): Define settings state from config.json defaults
//   — Timer durations: discussion, trial, vote, night (src/data/config.json → timer_durations)
//   — AI provider selector: Template / Gemma API / Gemma Local
//   — Language toggle: English / Greek (drives messageTemplates.json key)
//   — Night Echo frequency: slider mapped to config.events.night_echo.probability
//   — Full Moon threshold: slider mapped to fullMoonConfig.json

// TODO: Load saved settings from AsyncStorage on mount
// TODO: Save settings to AsyncStorage on change
// TODO: Add "Reset to defaults" button
//   — Reset values from src/data/config.json

// TODO(LOW): Add game speed multiplier (affects all timers proportionally)

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚙️</Text>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.placeholder}>Coming soon — timer durations, AI provider, language</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 24,
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  placeholder: { fontSize: 14, color: "#666", textAlign: "center" },
});

