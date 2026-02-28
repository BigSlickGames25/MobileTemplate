import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { theme } from "../../theme";
import { AppBackdrop } from "./AppBackdrop";

export function ScreenContainer({
  children,
  contentContainerStyle,
  scroll = false
}: {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
}) {
  return (
    <View style={styles.root}>
      <AppBackdrop />
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        {scroll ? (
          <ScrollView
            bounces={false}
            contentContainerStyle={contentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fill, contentContainerStyle]}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  fill: {
    flex: 1
  }
});
