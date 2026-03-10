import React, { useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useGame } from "../src/contexts/GameContext";
import { useSettings } from "../src/contexts/SettingsContext";
import PlayerCount from "../src/components/lobby/PlayerCount";
import RolePreview from "../src/components/lobby/RolePreview";
import StartButton from "../src/components/lobby/StartButton";
import RoleCard from "../src/components/shared/RoleCard";

// ---------------------------------------------------------------------------
// Lobby phases: select → reveal → play
// ---------------------------------------------------------------------------

type LobbyPhase = "select" | "reveal";

export default function LobbyScreen() {
  const router = useRouter();
  const { startGame, humanPlayer, resetGame } = useGame();
  const { settings } = useSettings();

  const [playerCount, setPlayerCount] = useState(settings.defaultPlayerCount);
  const [phase, setPhase] = useState<LobbyPhase>("select");
  const [loading, setLoading] = useState(false);

  /** Start game → show role reveal */
  const handleStart = useCallback(() => {
    setLoading(true);
    // Small delay so the loading indicator renders before sync work
    setTimeout(() => {
      startGame(playerCount);
      setLoading(false);
      setPhase("reveal");
    }, 50);
  }, [playerCount, startGame]);

  /** After role reveal, navigate to first game screen */
  const handleContinue = useCallback(() => {
    router.push("/game/morning");
  }, [router]);

  /** Back to lobby from role reveal */
  const handleBack = useCallback(() => {
    resetGame();
    setPhase("select");
  }, [resetGame]);

  // -------------------------------------------------------------------------
  // Role Reveal Screen
  // -------------------------------------------------------------------------

  if (phase === "reveal" && humanPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.revealTitle}>Your Role</Text>

        <View style={styles.roleCardWrapper}>
          <RoleCard player={humanPlayer} startRevealed={false} />
        </View>

        <Pressable style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Continue →</Text>
        </Pressable>

        <Pressable style={styles.linkButton} onPress={handleBack}>
          <Text style={styles.linkText}>← Back to Lobby</Text>
        </Pressable>
      </View>
    );
  }

  // -------------------------------------------------------------------------
  // Lobby Select Screen
  // -------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎭</Text>
      <Text style={styles.title}>Mafia AI Arena</Text>
      <Text style={styles.subtitle}>Single-Player AI Edition</Text>

      <View style={styles.playerCountSection}>
        <PlayerCount value={playerCount} onChange={setPlayerCount} />
      </View>

      <StartButton onStart={handleStart} loading={loading} />

      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>Roles in this game</Text>
        <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
          <RolePreview playerCount={playerCount} />
        </ScrollView>
      </View>

      <Pressable
        style={styles.linkButton}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.linkText}>⚙️ Settings</Text>
      </Pressable>
    </View>
  );
}

// TODO(Phase 4): Navigate to /game/day instead of /game/morning once day flow works
// TODO(Phase 5): Add "Resume Game" button if a game is in progress (AsyncStorage)

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 24,
    paddingTop: 48,
  },
  emoji: { fontSize: 60, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 24 },
  playerCountSection: {
    marginBottom: 24,
  },
  previewSection: {
    flex: 1,
    width: "100%",
    marginTop: 20,
    marginBottom: 8,
  },
  previewTitle: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: "center",
  },
  previewScroll: {
    flex: 1,
  },
  linkButton: { padding: 12 },
  linkText: { color: "#4a9eff", fontSize: 16 },
  // Role reveal screen
  revealTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 40,
    marginBottom: 24,
  },
  roleCardWrapper: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  continueBtn: {
    backgroundColor: "#43a047",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  continueBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

