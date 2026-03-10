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
// TODO(HIGH): Receive WinResult from game state context
//   — WinResult type from src/types/game.types.ts
//   — Set by WinChecker (src/engine/WinChecker.ts) when game ends
//   — Contains: winningFaction, winConditionMet, survivors[]

// TODO(HIGH): Display winning faction with <FactionBanner />
//   — From src/components/shared/FactionBanner.tsx
//   — Color-coded: Town (blue), Mafia (red), Neutral (gray)

// TODO: Show all player roles (full reveal)
//   — Use <PlayerAvatar /> + <RoleCard /> for each player
//   — From src/components/shared/PlayerAvatar.tsx, RoleCard.tsx
//   — Show alive/dead status, role, personality

// TODO: Display game stats summary
//   — Days survived, total kills, votes cast, Night Echo events triggered
//   — Derived from GameState and EventState

// TODO: Reset game state on "Play Again"
//   — Clear GameState, PlayerState, ChatState, EventState
//   — Then router.replace("/")

// TODO(LOW): Add confetti/celebration animation for winner
// TODO(LOW): Add "Share Result" screenshot capability
