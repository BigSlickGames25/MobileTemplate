import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fireHaptic } from "../../src/services/haptics";
import { useGameSettings } from "../../src/store/game-settings";
import { theme } from "../../src/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { settings } = useGameSettings();
  const tabBarBottomPadding = Math.max(insets.bottom, 12);
  const tabBarHeight = 74 + tabBarBottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.background
        },
        tabBarActiveTintColor: theme.colors.surface,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: theme.colors.subtleText,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: tabBarBottomPadding,
            paddingTop: 8
          }
        ]
      }}
    >
      <Tabs.Screen
        listeners={{
          tabPress: () => {
            void fireHaptic(settings.haptics, "tap");
          }
        }}
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabItemVisual
              color={color}
              focused={focused}
              icon={focused ? "view-grid" : "view-grid-outline"}
              label="Home"
            />
          )
        }}
      />
      <Tabs.Screen
        listeners={{
          tabPress: () => {
            void fireHaptic(settings.haptics, "tap");
          }
        }}
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabItemVisual
              color={color}
              focused={focused}
              icon={focused ? "tune-variant" : "tune"}
              label="Settings"
            />
          )
        }}
      />
      <Tabs.Screen
        listeners={{
          tabPress: () => {
            void fireHaptic(settings.haptics, "tap");
          }
        }}
        name="how-to-play"
        options={{
          title: "Guide",
          tabBarIcon: ({ color, focused }) => (
            <TabItemVisual
              color={color}
              focused={focused}
              icon={
                focused
                  ? "controller-classic"
                  : "controller-classic-outline"
              }
              label="Guide"
            />
          )
        }}
      />
    </Tabs>
  );
}

function TabItemVisual({
  color,
  focused,
  icon,
  label
}: {
  color: string;
  focused: boolean;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
}) {
  return (
    <View style={styles.tabVisual}>
      <MaterialCommunityIcons color={color} name={icon} size={focused ? 24 : 22} />
      <Text
        numberOfLines={1}
        style={[styles.tabLabelText, { color }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(7, 17, 31, 0.96)",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    elevation: 0,
    paddingHorizontal: theme.spacing.sm
  },
  tabBarItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 0
  },
  tabVisual: {
    alignItems: "center",
    gap: 2,
    justifyContent: "center",
    minWidth: 64
  },
  tabLabelText: {
    fontFamily: theme.fonts.label,
    fontSize: 10,
    letterSpacing: 0.3,
    lineHeight: 12,
    textAlign: "center"
  }
});
