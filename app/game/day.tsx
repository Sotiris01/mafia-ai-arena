import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function DayScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💬</Text>
      <Text style={styles.title}>Day Phase</Text>
      <Text style={styles.info}>Discussion, accusations, and mid-day events will appear here</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/game/vote")}
      >
        <Text style={styles.buttonText}>Proceed to Vote →</Text>
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
    backgroundColor: "#4a9eff",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

// TODO: Render PublicChat + ChatInput
// TODO: Show Timer for discussion countdown
// TODO: Handle sub-phase transitions (Discussion → Mid-Day Events)
// TODO: Show NightEchoBanner during Mid-Day Events
// TODO: Check if human player is silenced → show SilencedOverlay
// TODO: Transition to /game/vote when day ends
// TODO(LOW): Add Mayor reveal button if human is Mayor
