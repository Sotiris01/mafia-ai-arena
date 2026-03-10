import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// TODO(HIGH): Wire useMorningReport hook (src/hooks/useMorningReport.ts)
//   — Assembles: night deaths, Night Echo results, Full Moon status,
//     zombie infections, special announcements

// TODO(HIGH): Replace placeholder with <MorningReport /> component
//   — From src/components/night/MorningReport.tsx
//   — Sequential reveal: deaths → events → Full Moon → zombie notices

// TODO: Show <FullMoonOverlay /> if Full Moon stage changed
//   — From src/components/events/FullMoonOverlay.tsx

// TODO: Check WinChecker (src/engine/WinChecker.ts) before advancing
//   — If game ended overnight → router.replace("/game/result") instead of day

// TODO: On first morning (Day 1), skip death announcements
//   — Show role assignment recap or game-start flavor text

export default function MorningScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌅</Text>
      <Text style={styles.title}>Morning Report</Text>
      <Text style={styles.info}>Deaths, events, and Full Moon status will appear here</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/game/day")}
      >
        <Text style={styles.buttonText}>Continue to Day →</Text>
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
    backgroundColor: "#f0a500",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: "#1a1a2e", fontSize: 18, fontWeight: "bold" },
});
// TODO(LOW): Add death reveal animation
