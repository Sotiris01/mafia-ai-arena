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

// TODO(HIGH): Wire useNightActions hook (src/hooks/useNightActions.ts)
//   — Determines human player's available night action based on role
//   — Shows <NightAction /> from src/components/night/NightAction.tsx
//   — Submits human action, then triggers AI decisions

// TODO(HIGH): Run 7-phase Night Resolution after all actions submitted
//   — Via ResolutionEngine (src/engine/ResolutionEngine.ts)
//   — Phase order: Passive → Info-Alter → Investigate → Kill&Protect
//     → Post-Kill → Passive-Info → Cleanup

// TODO: If human is Mafia → show <MafiaChat /> component
//   — From src/components/chat/MafiaChat.tsx
//   — Wire via useChat hook (src/hooks/useChat.ts)

// TODO: Process Night Echo events via NightEchoEngine
//   — src/engine/NightEchoEngine.ts — max 2 events per night
//   — Show <NightEchoBanner /> from src/components/events/NightEchoBanner.tsx

// TODO: Run AI night decisions via NightDecision module
//   — src/ai/NightDecision.ts — calculates targets for each AI player

// TODO: Remove manual "End Game" button once WinChecker is wired
//   — Game end should be automatic via WinChecker after resolution

// TODO: Transition to /game/morning automatically when night resolves

// TODO(LOW): Add night ambience/UI overlay (darker background, stars)
