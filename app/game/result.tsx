import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ResultScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.info}>Winning faction, role reveals, and stats will appear here</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Play Again</Text>
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
  title: { fontSize: 28, fontWeight: "bold", color: "#ffd700", marginBottom: 12 },
  info: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 48 },
  button: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
// - app/_layout.tsx                       — navigation back to lobby

// TODO: Receive WinResult from WinChecker
// TODO: Display winning faction with FactionBanner
// TODO: Show all player roles (full reveal)
// TODO: Display game stats summary
// TODO: "Play Again" button → router.replace("/")
// TODO(LOW): Add confetti/celebration animation for winner
