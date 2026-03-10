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

// TODO(HIGH): Wire useVoting hook (src/hooks/useVoting.ts)
//   — Manages accusation, defense, voting phases
//   — Handles Mayor ×2 weight, Zombie voting restriction
//   — AI votes via VoteDecision (src/ai/VoteDecision.ts)

// TODO(HIGH): Replace placeholder with voting sub-phase UI:
//   1. Accusation — show player list, allow nominating suspect
//   2. Trial — accused defends, show <Timer /> for defense countdown
//   3. Vote — render <VotePanel /> from src/components/voting/VotePanel.tsx
//      — Guilty / Innocent / Abstain buttons
//      — Show <MayorBadge /> for Mayor's ×2 indicator

// TODO: Show <VoteResult /> after tally
//   — From src/components/voting/VoteResult.tsx
//   — Shows vote counts, outcome (lynch / acquit)

// TODO: If lynched → check Last Wish (40% chance)
//   — Via LastWishEngine (src/engine/LastWishEngine.ts)
//   — Show <LastWishBanner /> from src/components/voting/LastWishBanner.tsx
//   — 4 possible actions: Reveal, Curse, Pardon, Silence

// TODO: Check WinChecker after lynch
//   — Jester wins if lynched (immediate game end)
//   — Executioner wins if their target is lynched

// TODO: Transition to /game/night when vote concludes
//   — Remove manual button once engine is wired

// TODO(LOW): Add dramatic vote reveal animation
