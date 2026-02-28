import { router } from "expo-router";
import { startTransition } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "../src/components/layout/ScreenContainer";
import { GameButton } from "../src/components/ui/GameButton";
import { useDeviceProfile } from "../src/hooks/useDeviceProfile";
import { fireHaptic } from "../src/services/haptics";
import { useGameSettings } from "../src/store/game-settings";
import { clamp, theme } from "../src/theme";

export default function HomeScreen() {
  const device = useDeviceProfile();
  const { settings } = useGameSettings();
  const isWide = device.isLandscape || device.width >= 860;
  const isCompact = device.width < 390;
  const titleFontSize = Math.round(clamp(34 * device.textScale, 28, 38));

  function goToGame() {
    void fireHaptic(settings.haptics, "confirm");
    startTransition(() => {
      router.push("/game");
    });
  }

  function goToSettings() {
    void fireHaptic(settings.haptics, "tap");
    router.push("/settings");
  }

  function goToHowToPlay() {
    void fireHaptic(settings.haptics, "tap");
    router.push("/how-to-play");
  }

  return (
    <ScreenContainer
      scroll
      contentContainerStyle={[styles.content, isWide && styles.contentWide]}
    >
      <View style={[styles.topRow, isWide && styles.topRowWide]}>
        <View
          style={[
            styles.heroCard,
            isWide && styles.splitPanel,
            isCompact && styles.compactCard
          ]}
        >
          <Text style={styles.kicker}>Reusable Mobile Starter</Text>
          <Text
            style={[
              styles.title,
              {
                fontSize: titleFontSize,
                lineHeight: titleFontSize + 4
              }
            ]}
          >
            Ship-ready shell for touch-first games.
          </Text>
          <Text style={styles.description}>
            Includes safe-area aware layout, iOS-friendly navigation,
            orientation locking, haptics hooks, pause flow, virtual joystick
            controls, and a sample gameplay loop you can replace with your own
            game.
          </Text>
        </View>

        <View
          style={[
            styles.notesCard,
            isWide && styles.splitPanel,
            isCompact && styles.compactCard
          ]}
        >
          <Text style={styles.notesTitle}>Template Intent</Text>
          <Text style={styles.notesText}>
            Replace the sample entities inside the game world layer, keep the
            app shell intact, then brand, tune, test, and submit.
          </Text>
          <Pressable
            onPress={goToGame}
            style={({ pressed }) => [
              styles.inlineAction,
              pressed && styles.inlineActionPressed
            ]}
          >
            <Text style={styles.inlineActionText}>Play sample now</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.bottomRow, isWide && styles.bottomRowWide]}>
        <View style={[styles.featureGrid, isWide && styles.bottomPanel]}>
          <FeatureChip
            compact={isCompact}
            label="Safe Areas"
            value="Top notch + home indicator aware"
            wide={isWide}
          />
          <FeatureChip
            compact={isCompact}
            label="Orientation"
            value={
              settings.orientation === "adaptive"
                ? "Adaptive"
                : settings.orientation === "portrait"
                  ? "Portrait"
                  : "Landscape"
            }
            wide={isWide}
          />
          <FeatureChip
            compact={isCompact}
            label="Input"
            value={
              settings.handPreference === "left"
                ? "Left-handed HUD"
                : "Right-handed HUD"
            }
            wide={isWide}
          />
          <FeatureChip
            compact={isCompact}
            label="Feedback"
            value={`Haptics ${settings.haptics}`}
            wide={isWide}
          />
        </View>

        <View style={[styles.buttonStack, isWide && styles.bottomPanel]}>
          <GameButton
            label="Launch Demo Loop"
            onPress={goToGame}
            subtitle="Menu, HUD, pause, touch controls, collisions"
            tone="primary"
          />
          <GameButton
            label="Settings"
            onPress={goToSettings}
            subtitle="Rotation, handedness, haptics, keep awake"
          />
          <GameButton
            label="How To Play"
            onPress={goToHowToPlay}
            subtitle="Template conventions and replacement points"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

function FeatureChip({
  compact,
  label,
  value,
  wide
}: {
  compact?: boolean;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <View
      style={[
        styles.featureChip,
        wide && styles.featureChipWide,
        compact && styles.featureChipCompact
      ]}
    >
      <Text style={styles.featureLabel}>{label}</Text>
      <Text style={styles.featureValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    marginHorizontal: "auto",
    maxWidth: 1180,
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl
  },
  contentWide: {
    gap: theme.spacing.xl
  },
  topRow: {
    gap: theme.spacing.lg
  },
  topRowWide: {
    flexDirection: "row"
  },
  bottomRow: {
    gap: theme.spacing.lg
  },
  bottomRowWide: {
    alignItems: "flex-start",
    flexDirection: "row"
  },
  splitPanel: {
    flex: 1
  },
  bottomPanel: {
    flex: 1
  },
  heroCard: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl
  },
  compactCard: {
    padding: theme.spacing.lg
  },
  kicker: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.label,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.text,
    flexShrink: 1,
    fontFamily: theme.fonts.display,
    fontSize: 34,
    lineHeight: 38
  },
  description: {
    color: theme.colors.subtleText,
    flexShrink: 1,
    fontFamily: theme.fonts.body,
    fontSize: 16,
    lineHeight: 24
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md
  },
  featureChip: {
    backgroundColor: theme.colors.cardMuted,
    borderRadius: theme.radius.lg,
    gap: 6,
    minWidth: "47%",
    padding: theme.spacing.md
  },
  featureChipWide: {
    minWidth: "31%"
  },
  featureChipCompact: {
    minWidth: "100%"
  },
  featureLabel: {
    color: theme.colors.subtleText,
    fontFamily: theme.fonts.label,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase"
  },
  featureValue: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15
  },
  buttonStack: {
    gap: theme.spacing.md
  },
  notesCard: {
    backgroundColor: theme.colors.cardMuted,
    borderRadius: theme.radius.xl,
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  notesTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 20
  },
  notesText: {
    color: theme.colors.subtleText,
    flexShrink: 1,
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 23
  },
  inlineAction: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  inlineActionPressed: {
    opacity: 0.8
  },
  inlineActionText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 14
  }
});
