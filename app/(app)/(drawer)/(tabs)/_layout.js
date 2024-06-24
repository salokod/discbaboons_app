import { Button } from "react-native";
import React from "react";
import { Tabs, router } from "expo-router";
import { Feather, AntDesign } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { useTheme } from "@rneui/themed";

export default function _layout() {
  const theme = useTheme();
  const isDark = theme.theme.mode === "dark";

  return (
    <Tabs screenOptions={{ headerLeft: () => <DrawerToggleButton tintColor={isDark ? "white" : "black"} />, headerStyle: { backgroundColor: isDark ? "black" : "white" }, headerTitleStyle: { color: isDark ? "white" : "black" } }}>
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />,
          tabBarLabel: "Feed",
          headerTitle: "Feed",
          headerRight: () => <Button onPress={() => router.push("feed/new")} title="Add Post" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
          tabBarLabel: "Profile",
          headerTitle: "Profile",
        }}
      />
    </Tabs>
  );
}
