import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MorningScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌅</Text>
      <Text style={styles.title}>Morning Report</Text>
      <Text style={styles.info}>Deaths, events, and Full Moon status will appear here</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/game/day")}
      >
        <Text style={styles.buttonText}>Continue to Day →</Text>
      </Pressable>
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
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  info: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 48 },
  button: {
    backgroundColor: "#f0a500",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: "#1a1a2e", fontSize: 18, fontWeight: "bold" },
});
// TODO(LOW): Add death reveal animation
