import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// TODO(HIGH): Import and render lobby components:
//   — <PlayerCount /> from src/components/lobby/PlayerCount.tsx
//   — <RolePreview /> from src/components/lobby/RolePreview.tsx
//   — <StartButton /> from src/components/lobby/StartButton.tsx

// TODO(HIGH): Wire useGameLoop hook (src/hooks/useGameLoop.ts)
//   — On "Start Game": call useGameLoop.startGame(playerCount)
//   — Assigns roles + personalities via src/state/PlayerState.ts
//   — Then router.push("/game/morning") for first morning

// TODO: Add playerCount state (7–16) managed locally
//   — Pass to PlayerCount and RolePreview components
//   — Validate minimum count before enabling StartButton

// TODO: Show the human player's assigned role after game starts
//   — Use <RoleCard /> from src/components/shared/RoleCard.tsx
//   — Brief reveal screen before transitioning to Morning

export default function LobbyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎭</Text>
      <Text style={styles.title}>Mafia AI Arena</Text>
      <Text style={styles.subtitle}>Single-Player AI Edition</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/game/morning")}
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </Pressable>

      <Pressable
        style={styles.linkButton}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.linkText}>⚙️ Settings</Text>
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
  emoji: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#888", marginBottom: 48 },
  button: {
    backgroundColor: "#e94560",
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  linkButton: { padding: 12 },
  linkText: { color: "#4a9eff", fontSize: 16 },
});

