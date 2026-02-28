import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../../theme";

export function GameButton({
  label,
  onPress,
  subtitle,
  tone = "secondary"
}: {
  label: string;
  onPress: () => void;
  subtitle?: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === "primary" ? styles.primary : styles.secondary,
        pressed &&
          (tone === "primary" ? styles.primaryPressed : styles.secondaryPressed)
      ]}
    >
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.xl,
    minHeight: 82,
    overflow: "hidden",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  primary: {
    backgroundColor: theme.colors.surface
  },
  primaryPressed: {
    backgroundColor: theme.colors.surfacePressed
  },
  secondary: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1
  },
  secondaryPressed: {
    backgroundColor: theme.colors.cardMuted
  },
  copy: {
    gap: 6
  },
  label: {
    color: theme.colors.text,
    flexShrink: 1,
    fontFamily: theme.fonts.bodyBold,
    fontSize: 18
  },
  subtitle: {
    color: theme.colors.subtleText,
    flexShrink: 1,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    lineHeight: 20
  }
});
