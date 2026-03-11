import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useChat } from "../../src/hooks/useChat";
import { useGame } from "../../src/contexts/GameContext";
import PublicChat from "../../src/components/chat/PublicChat";
import Timer from "../../src/components/shared/Timer";
import config from "../../src/data/config.json";

const DISCUSSION_SECONDS = (config.timers as Record<string, number>).discussion_seconds ?? 120;
/** Delay between AI messages appearing in chat (ms) */
const AI_MESSAGE_DELAY_MS = 1500;

export default function DayScreen() {
  const router = useRouter();
  const { messages, sendMessage, runAIDiscussion, addAIMessages, isAITalking } =
    useChat("public");
  const { advancePhase, refreshState } = useGame();
  const aiRanRef = useRef(false);

  // Run one AI discussion round when the screen mounts
  useEffect(() => {
    if (aiRanRef.current) return;
    aiRanRef.current = true;

    let cancelled = false;

    (async () => {
      const result = await runAIDiscussion();
      if (cancelled || result.messages.length === 0) return;

      // Stagger AI messages into the chat
      for (let i = 0; i < result.messages.length; i++) {
        if (cancelled) break;
        await new Promise((r) => setTimeout(r, AI_MESSAGE_DELAY_MS));
        if (!cancelled) {
          addAIMessages([result.messages[i]]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [runAIDiscussion, addAIMessages]);

  /** Move to the voting sub-phase */
  const handleGoToVote = useCallback(() => {
    advancePhase(); // discussion → midday_events (auto)
    advancePhase(); // midday_events → trial (auto)
    advancePhase(); // trial → voting
    refreshState();
    router.replace("/game/vote");
  }, [advancePhase, refreshState, router]);

  return (
    <View style={styles.container}>
      {/* Day header with timer */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          💬 Discussion
        </Text>
        <Timer
          seconds={DISCUSSION_SECONDS}
          onExpire={handleGoToVote}
          paused={isAITalking}
        />
        <Pressable style={styles.voteBtn} onPress={handleGoToVote}>
          <Text style={styles.voteBtnText}>
            Vote →
          </Text>
        </Pressable>
      </View>

      {/* Chat area */}
      <PublicChat messages={messages} onSend={sendMessage} />
    </View>
  );
}

// TODO(Phase 5): Check if human is silenced → pass isSilenced to PublicChat
// TODO(Phase 5): Handle mid-day NightEcho events (pause chat, show banner)
// TODO(LOW): Add Mayor reveal button if human is Mayor

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  voteBtn: {
    backgroundColor: "#4a9eff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  voteBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
