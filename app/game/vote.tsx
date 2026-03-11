import { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useVoting } from "../../src/hooks/useVoting";
import VotePanel from "../../src/components/voting/VotePanel";
import VoteResult from "../../src/components/voting/VoteResult";
import * as PlayerState from "../../src/state/PlayerState";
import config from "../../src/data/config.json";

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function VoteScreen() {
  const router = useRouter();
  const voting = useVoting();
  const [showResult, setShowResult] = useState(false);

  const humanPlayer = PlayerState.getHumanPlayer();
  const timerSeconds = (config.timers as Record<string, number>).voting_seconds ?? 30;

  /**
   * After human votes (or timer expires), collect AI votes and resolve.
   */
  const handleResolve = useCallback(() => {
    if (!voting.hasHumanVoted) {
      // Timer expired without voting — auto-abstain
      voting.abstain();
    }
    voting.resolveVoting();
    setShowResult(true);
  }, [voting]);

  /**
   * Navigate after result is shown.
   */
  const handleContinue = useCallback(() => {
    if (voting.result?.winResult) {
      router.replace("/game/result");
    } else {
      router.replace("/game/night");
    }
  }, [voting.result, router]);

  // ---- Result phase ----
  if (showResult && voting.result) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <VoteResult
            lynchedPlayerName={voting.result.lynchedPlayer?.player_name ?? null}
            tallies={voting.result.tallies}
          />
        </ScrollView>

        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>
            {voting.result.winResult
              ? "See Results"
              : "Proceed to Night →"}
          </Text>
        </Pressable>
      </View>
    );
  }

  // ---- Voting phase ----
  return (
    <View style={styles.container}>
      <VotePanel
        votes={voting.votes}
        hasHumanVoted={voting.hasHumanVoted}
        isHumanZombie={humanPlayer.is_zombie}
        timerSeconds={timerSeconds}
        onVote={voting.castVote}
        onAbstain={voting.abstain}
        onTimerExpire={handleResolve}
      />

      {/* Manual resolve after voting */}
      {voting.hasHumanVoted && !showResult && (
        <Pressable style={styles.resolveButton} onPress={handleResolve}>
          <Text style={styles.resolveText}>
            Reveal Votes
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// TODO(Phase 5): Trigger LastWishEngine after lynch (40% chance)
// TODO(Phase 5): Check Jester/Executioner win via WinChecker after lynch
// TODO(LOW): Add dramatic vote reveal animation

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  resultScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  continueButton: {
    backgroundColor: "#e94560",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 32,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resolveButton: {
    backgroundColor: "#533483",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 24,
  },
  resolveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
