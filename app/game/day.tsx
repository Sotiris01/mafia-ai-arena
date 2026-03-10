import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useChat } from "../../src/hooks/useChat";
import PublicChat from "../../src/components/chat/PublicChat";

export default function DayScreen() {
  const router = useRouter();
  const { messages, sendMessage } = useChat("public");

  return (
    <View style={styles.container}>
      {/* Day header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>💬 Discussion</Text>
        <Pressable
          style={styles.voteBtn}
          onPress={() => router.replace("/game/vote")}
        >
          <Text style={styles.voteBtnText}>Vote →</Text>
        </Pressable>
      </View>

      {/* Chat area */}
      <PublicChat messages={messages} onSend={sendMessage} />
    </View>
  );
}

// TODO(Phase 4): Add <Timer /> for discussion countdown (config.timers.discussion_seconds)
// TODO(Phase 4): Replace manual "Vote" button with auto-transition on timer expire
// TODO(Phase 4): Wire AIEngine.runDiscussionTurn() for AI messages
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
