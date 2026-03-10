import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

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

