import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function NightScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌙</Text>
      <Text style={styles.title}>Night Phase</Text>
      <Text style={styles.info}>Night actions, Mafia chat, and resolution will appear here</Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.button}
          onPress={() => router.replace("/game/morning")}
        >
          <Text style={styles.buttonText}>Next Morning →</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.endButton]}
          onPress={() => router.replace("/game/result")}
        >
          <Text style={styles.buttonText}>End Game</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f23",
    padding: 24,
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  info: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 48 },
  buttonRow: { gap: 16 },
  button: {
    backgroundColor: "#533483",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
  },
  endButton: { backgroundColor: "#c0392b" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center" },
});

// TODO: Check human player's role → show NightAction UI
// TODO: If human is Mafia → show MafiaChat alongside actions
// TODO: Run AI night decisions via NightDecision module
// TODO: Process Night Echo events
// TODO: Transition to /game/morning when night resolves
// TODO(LOW): Add night ambience/UI overlay
