import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fireHaptic } from "../../src/services/haptics";
import { useGameSettings } from "../../src/store/game-settings";
import { theme } from "../../src/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { settings } = useGameSettings();
  const tabBarHeight = Math.max(68, 60 + insets.bottom);

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
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom: Math.max(insets.bottom, 10),
            paddingTop: 10
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
            <MaterialCommunityIcons
              color={color}
              name={focused ? "view-grid" : "view-grid-outline"}
              size={focused ? 24 : 22}
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
            <MaterialCommunityIcons
              color={color}
              name={focused ? "tune-variant" : "tune"}
              size={focused ? 24 : 22}
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
            <MaterialCommunityIcons
              color={color}
              name={focused ? "controller-classic" : "controller-classic-outline"}
              size={focused ? 24 : 22}
            />
          )
        }}
      />
    </Tabs>
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
    paddingVertical: 2
  },
  tabBarLabel: {
    fontFamily: theme.fonts.label,
    fontSize: 11,
    letterSpacing: 0.4,
    paddingBottom: 1
  }
});
