import { StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "../components/layout/ScreenContainer";
import { useDeviceProfile } from "../hooks/useDeviceProfile";
import { theme } from "../theme";

export function HowToPlayScreen() {
  const device = useDeviceProfile();
  const isWide = device.isLandscape || device.width >= 860;
  const isCompact = device.width < 390;

  return (
    <ScreenContainer
      scroll
      contentContainerStyle={[styles.content, isWide && styles.contentWide]}
    >
      <InfoCard
        body="Use the joystick to move, hold Boost for burst speed, and tap Pulse to clear nearby hazards. Collect nodes to raise score and pressure."
        compact={isCompact}
        title="Gameplay loop"
        wide={isWide}
      />
      <InfoCard
        body="Swap the entities and update logic inside src/game/world.ts. Keep the navigation shell, settings store, and controls unless your game needs a different interaction model."
        compact={isCompact}
        title="Replace points"
        wide={isWide}
      />
      <InfoCard
        body="Safe areas, modal navigation, screen orientation control, and haptic feedback are already wired. The template assumes full-screen gameplay on iPad to keep orientation locking reliable."
        compact={isCompact}
        title="iOS behavior"
        wide={isWide}
      />
      <InfoCard
        body="Brand the app config, replace icon and splash assets, add your audio/game art, test on physical devices, and run an EAS production build."
        compact={isCompact}
        title="Before shipping"
        wide={isWide}
      />
    </ScreenContainer>
  );
}

function InfoCard({
  body,
  compact,
  title,
  wide
}: {
  body: string;
  compact?: boolean;
  title: string;
  wide?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        wide && styles.cardWide,
        compact && styles.cardCompact
      ]}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.lg,
    marginHorizontal: "auto",
    maxWidth: 1180,
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl
  },
  contentWide: {
    alignItems: "flex-start"
  },
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  cardCompact: {
    padding: theme.spacing.md
  },
  cardWide: {
    minWidth: "48%"
  },
  cardTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 20
  },
  cardBody: {
    color: theme.colors.subtleText,
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 22
  }
});
