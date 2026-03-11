import { useEffect } from "react";
import { BackHandler } from "react-native";
import { Stack } from "expo-router";
import { useGame } from "../../src/contexts/GameContext";

export default function GameLayout() {
  const { gameState } = useGame();

  // Block Android hardware back button during gameplay
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, []);

  const dayLabel = gameState ? `Day ${gameState.day}` : "";

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#16213e" },
        headerTintColor: "#fff",
        contentStyle: { backgroundColor: "#1a1a2e" },
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="morning" options={{ title: `🌅 Morning — ${dayLabel}` }} />
      <Stack.Screen name="day" options={{ title: `💬 Day — ${dayLabel}` }} />
      <Stack.Screen name="vote" options={{ title: `🗳️ Vote — ${dayLabel}` }} />
      <Stack.Screen name="night" options={{ title: `🌙 Night — ${dayLabel}` }} />
      <Stack.Screen name="result" options={{ title: `🏆 Result` }} />
    </Stack>
  );
}

// TODO(Phase 4): Derive current screen from game phase automatically
//   — When PhaseManager advances phase, router.replace to the correct screen
// TODO(LOW): Add phase transition animation between screens
