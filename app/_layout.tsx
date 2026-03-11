import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GameProvider } from "../src/contexts/GameContext";
import { SettingsProvider } from "../src/contexts/SettingsContext";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <GameProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#1a1a2e" },
            headerTintColor: "#fff",
            contentStyle: { backgroundColor: "#1a1a2e" },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Mafia AI Arena" }} />
          <Stack.Screen
            name="settings"
            options={{ title: "Settings" }}
          />
          <Stack.Screen name="game" options={{ headerShown: false }} />
        </Stack>
      </GameProvider>
    </SettingsProvider>
  );
}

// TODO(Phase 5): Add game state persistence via AsyncStorage for resume-after-close

