import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

import { AppProviders } from "../src/providers/AppProviders";
import { theme } from "../src/theme";

void SystemUI.setBackgroundColorAsync(theme.colors.background);

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.colors.background
          },
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background
          },
          headerTintColor: theme.colors.text,
          gestureEnabled: true
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="game" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{
            presentation: "modal",
            title: "Settings",
            headerShown: true,
            headerLargeTitle: true
          }}
        />
        <Stack.Screen
          name="how-to-play"
          options={{
            presentation: "modal",
            title: "How To Play",
            headerShown: true,
            headerLargeTitle: true
          }}
        />
      </Stack>
    </AppProviders>
  );
}
