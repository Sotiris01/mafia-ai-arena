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

// TODO(HIGH): Wrap Stack in a GameProvider or consume root-level context
//   — Game phase screens need: current phase, player list, day number
//   — Source: src/state/GameState.ts

// TODO: Disable hardware back button (Android)
//   — gestureEnabled: false covers swipe, but Android back button still works
//   — Use BackHandler from react-native in a useEffect

// TODO: Derive current screen from game phase automatically
//   — When PhaseManager (src/engine/PhaseManager.ts) advances phase,
//     this layout should router.replace to the correct screen
//   — Prevents manual "Continue" buttons once engine is wired

// TODO(LOW): Add phase transition animation between screens
//   — e.g., fade-to-black for night, sunrise gradient for morning
