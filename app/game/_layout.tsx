import { Stack } from "expo-router";

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#16213e" },
        headerTintColor: "#fff",
        contentStyle: { backgroundColor: "#1a1a2e" },
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="morning" options={{ title: "🌅 Morning" }} />
      <Stack.Screen name="day" options={{ title: "💬 Day" }} />
      <Stack.Screen name="vote" options={{ title: "🗳️ Vote" }} />
      <Stack.Screen name="night" options={{ title: "🌙 Night" }} />
      <Stack.Screen name="result" options={{ title: "🏆 Result" }} />
    </Stack>
  );
}

// TODO: Disable back navigation (phases are linear)
// TODO: Pass game state context to children
// TODO(LOW): Add phase transition animation between screens
