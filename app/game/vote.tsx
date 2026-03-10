import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function VoteScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🗳️</Text>
      <Text style={styles.title}>Trial & Vote</Text>
      <Text style={styles.info}>Accusations, defense, and lynch voting will appear here</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/game/night")}
      >
        <Text style={styles.buttonText}>Proceed to Night →</Text>
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
    backgroundColor: "#e94560",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

// TODO: Show nomination/accusation sub-phase UI
// TODO: Show defense timer during trial
// TODO: Render VotePanel for voting
// TODO: Handle Mayor ×2, Zombie restriction
// TODO: Show VoteResult with outcome
// TODO: If lynched → check Last Wish → show LastWishBanner
// TODO: Transition to /game/night when vote concludes
// TODO(LOW): Add dramatic vote reveal animation
