import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// TODO: Wrap children in a GameProvider context (from src/state/GameState.ts)
//   — All game screens need access to shared game state
//   — Provider should load/save state via AsyncStorage or expo-file-system

// TODO: Load user settings (language, timers, AI provider) from AsyncStorage
//   — Pass settings down via context or a SettingsProvider
//   — See src/data/config.json for default values

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1a1a2e" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#1a1a2e" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Mafia AI Arena" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

