import { View, Text, StyleSheet } from "react-native";

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

