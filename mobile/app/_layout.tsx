import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { theme } from "../src/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Runaway" }} />
        <Stack.Screen name="gps-test" options={{ title: "GPS test" }} />
      </Stack>
    </>
  );
}
