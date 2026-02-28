import { StyleSheet, Switch, Text, View } from "react-native";

import { ScreenContainer } from "../src/components/layout/ScreenContainer";
import { OptionGroup } from "../src/components/ui/OptionGroup";
import { useGameSettings } from "../src/store/game-settings";
import {
  GameSettings,
  HandPreference,
  HapticsLevel,
  OrientationPreference
} from "../src/types/settings";
import { theme } from "../src/theme";

const orientationOptions: { label: string; value: OrientationPreference }[] = [
  { label: "Adaptive", value: "adaptive" },
  { label: "Portrait", value: "portrait" },
  { label: "Landscape", value: "landscape" }
];

const hapticsOptions: { label: string; value: HapticsLevel }[] = [
  { label: "Off", value: "off" },
  { label: "Subtle", value: "subtle" },
  { label: "Full", value: "full" }
];

const handOptions: { label: string; value: HandPreference }[] = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" }
];

export default function SettingsScreen() {
  const { settings, resetSettings, updateSetting } = useGameSettings();

  return (
    <ScreenContainer scroll contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device posture</Text>
        <Text style={styles.sectionText}>
          Rotation is applied app-wide so the game shell and menus stay
          consistent with your chosen play mode.
        </Text>
        <OptionGroup
          onChange={(value) =>
            updateSetting("orientation", value as GameSettings["orientation"])
          }
          options={orientationOptions}
          selectedValue={settings.orientation}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <Text style={styles.sectionText}>
          Tune system haptics for menus, pickups, hits, and state changes.
        </Text>
        <OptionGroup
          onChange={(value) =>
            updateSetting("haptics", value as GameSettings["haptics"])
          }
          options={hapticsOptions}
          selectedValue={settings.haptics}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Touch layout</Text>
        <Text style={styles.sectionText}>
          Swap the joystick and action cluster for left-handed or right-handed
          play.
        </Text>
        <OptionGroup
          onChange={(value) =>
            updateSetting(
              "handPreference",
              value as GameSettings["handPreference"]
            )
          }
          options={handOptions}
          selectedValue={settings.handPreference}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Runtime options</Text>
        <SettingToggle
          label="Keep screen awake during gameplay"
          onValueChange={(value) => updateSetting("keepAwake", value)}
          value={settings.keepAwake}
        />
        <SettingToggle
          label="Show touch guide labels"
          onValueChange={(value) => updateSetting("showTouchGuide", value)}
          value={settings.showTouchGuide}
        />
        <SettingToggle
          label="Reduce motion"
          onValueChange={(value) => updateSetting("reducedMotion", value)}
          value={settings.reducedMotion}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reset</Text>
        <Text style={styles.sectionText}>
          Restore template defaults before you branch this into a specific game.
        </Text>
        <Text onPress={resetSettings} style={styles.resetButton}>
          Reset settings
        </Text>
      </View>
    </ScreenContainer>
  );
}

function SettingToggle({
  label,
  onValueChange,
  value
}: {
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        onValueChange={onValueChange}
        thumbColor={value ? theme.colors.surface : "#9CA3AF"}
        trackColor={{
          false: "#38465b",
          true: theme.colors.accent
        }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl
  },
  section: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 20
  },
  sectionText: {
    color: theme.colors.subtleText,
    fontFamily: theme.fonts.body,
    fontSize: 15,
    lineHeight: 22
  },
  toggleRow: {
    alignItems: "center",
    backgroundColor: theme.colors.cardMuted,
    borderRadius: theme.radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  toggleLabel: {
    color: theme.colors.text,
    flex: 1,
    fontFamily: theme.fonts.body,
    fontSize: 15,
    marginRight: theme.spacing.md
  },
  resetButton: {
    color: theme.colors.warning,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 15
  }
});

