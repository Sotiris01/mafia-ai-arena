import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "../../src/contexts/GameContext";
import Timer from "../../src/components/shared/Timer";

/** Night phase is a placeholder transition in Phase 4 — auto-advances after timer */
const NIGHT_SECONDS = 5;

export default function NightScreen() {
  const router = useRouter();
  const { goToDay, gameState } = useGame();

  /** Advance to the next morning */
  const handleAdvance = useCallback(() => {
    goToDay();
    router.replace("/game/morning");
  }, [goToDay, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌙</Text>
      <Text style={styles.title}>
        Night Falls…
      </Text>
      <Text style={styles.info}>
        {`The town sleeps. Day ${gameState?.day ?? 1} has ended.`}
      </Text>

      <Timer seconds={NIGHT_SECONDS} onExpire={handleAdvance} />

      <Pressable style={styles.button} onPress={handleAdvance}>
        <Text style={styles.buttonText}>
          Skip to Morning →
        </Text>
      </Pressable>
    </View>
  );
}

// TODO(Phase 5): Wire useNightActions hook — human selects night action target
// TODO(Phase 5): Run 7-phase Night Resolution via ResolutionEngine
// TODO(Phase 5): Show MafiaChat if human is Mafia alignment
// TODO(Phase 5): Check WinChecker after night resolution → /game/result if game over
// TODO(LOW): Add night ambience animation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f23",
    padding: 24,
    gap: 16,
  },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  info: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 16 },
  button: {
    backgroundColor: "#533483",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center" },
});
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
