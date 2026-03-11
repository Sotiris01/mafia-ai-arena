import { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "../../src/contexts/GameContext";
import Timer from "../../src/components/shared/Timer";

/** Morning report auto-advances after a brief reveal period */
const MORNING_SECONDS = 5;

// TODO(Phase 5): Wire useMorningReport hook — deaths, events, Full Moon
// TODO(Phase 5): Replace placeholder with <MorningReport /> sequential reveals
// TODO(Phase 5): Show <FullMoonOverlay /> if Full Moon stage changed
// TODO(Phase 5): Check WinChecker before advancing — /game/result if game over
// TODO(Phase 5): On Day 1, skip death announcements — show game-start flavor

export default function MorningScreen() {
  const router = useRouter();
  const { advancePhase, gameState } = useGame();

  /** Advance to the day discussion screen */
  const handleAdvance = useCallback(() => {
    // Sub-phase should already be morning_report; advance to discussion
    advancePhase();
    router.replace("/game/day");
  }, [advancePhase, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌅</Text>
      <Text style={styles.title}>
        {`Day ${gameState?.day ?? 1}`}
      </Text>
      <Text style={styles.subtitle}>
        A new day begins
      </Text>
      <Text style={styles.info}>
        {(gameState?.day ?? 1) === 1
          ? "No deaths to report. The town gathers to discuss."
          : "The town awakens…"}
      </Text>

      <Timer seconds={MORNING_SECONDS} onExpire={handleAdvance} />

      <Pressable style={styles.button} onPress={handleAdvance}>
        <Text style={styles.buttonText}>
          Continue to Discussion →
        </Text>
      </Pressable>
    </View>
  );
}

// TODO(LOW): Add death reveal animation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 24,
    gap: 16,
  },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 18, color: "#f0a500", fontWeight: "600" },
  info: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 16 },
  button: {
    backgroundColor: "#f0a500",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  buttonText: { color: "#1a1a2e", fontSize: 18, fontWeight: "bold" },
});
