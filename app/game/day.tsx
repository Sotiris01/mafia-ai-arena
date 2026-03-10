import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function DayScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💬</Text>
      <Text style={styles.title}>Day Phase</Text>
      <Text style={styles.info}>Discussion, accusations, and mid-day events will appear here</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/game/vote")}
      >
        <Text style={styles.buttonText}>Proceed to Vote →</Text>
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
    backgroundColor: "#4a9eff",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

// TODO(HIGH): Wire useChat hook (src/hooks/useChat.ts)
//   — Manages public chat message exchange with AI generation
//   — AI messages generated via MessageGenerator (src/ai/MessageGenerator.ts)
//   — Speak timing via SpeakProbability (src/ai/SpeakProbability.ts)

// TODO(HIGH): Replace placeholder with <PublicChat /> + <ChatInput />
//   — From src/components/chat/PublicChat.tsx, ChatInput.tsx
//   — PublicChat: scrollable message list with player avatars
//   — ChatInput: text field for human player messages

// TODO: Add <Timer /> component for discussion countdown
//   — From src/components/shared/Timer.tsx
//   — Duration from config.json → timer_durations.discussion

// TODO: Handle sub-phase transitions
//   — Discussion → Mid-Day Events → Transition to vote
//   — Mid-Day Events: show <NightEchoBanner /> if events queued
//   — From src/components/events/NightEchoBanner.tsx

// TODO: Check if human player is Silenced
//   — Silencer role (src/data/roles.json) blocks target from speaking
//   — Show SilencedOverlay on ChatInput, disable sending

// TODO: Transition to /game/vote when discussion timer expires
//   — Remove manual "Proceed to Vote" button once timer is wired

// TODO(LOW): Add Mayor reveal button if human is Mayor
//   — Mayor reveal doubles vote weight in next phase
