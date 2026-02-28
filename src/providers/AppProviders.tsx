import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  GameSettingsProvider,
  useGameSettings
} from "../store/game-settings";
import { theme } from "../theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <GameSettingsProvider>
          <BootstrapGate>{children}</BootstrapGate>
        </GameSettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function BootstrapGate({ children }: { children: React.ReactNode }) {
  const { isReady } = useGameSettings();

  if (isReady) {
    return <>{children}</>;
  }

  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator color={theme.colors.accent} size="large" />
      <Text style={styles.loadingText}>Loading mobile runtime...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  loadingScreen: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: "center"
  },
  loadingText: {
    color: theme.colors.subtleText,
    fontFamily: theme.fonts.body,
    fontSize: 16
  }
});

