import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useContext } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather, AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { DataContext } from "../../../context/DataContext";
import { useThemeMode, useTheme } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";

const CustomDrawerContent = (props) => {
  const { isLoggedInFunc, loggedOutFunc, toggedThemeContextFunc } = useContext(DataContext);
  const { mode, setMode } = useThemeMode();

  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  const toggleThemeFunc = () => {
    setMode(mode === "dark" ? "light" : "dark");
    toggedThemeContextFunc();
  };

  return (
    <DrawerContentScrollView {...props}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <View style={styles.userInfoWrapper}>
        <Image source={{ uri: "https://randomuser.me/api/portraits/women/26.jpg" }} width={80} height={80} style={styles.userImg} />
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@email.com</Text>
        </View>
      </View>
      <DrawerItem
        icon={({ color, size }) => <Feather name="list" size={size} color={pathname == "/bag" ? "#fff" : "#000"} />}
        label={"My Bag"}
        labelStyle={[styles.navItemLabel, { color: pathname == "/bag" ? "#fff" : "#000" }]}
        style={{ backgroundColor: pathname == "/bag" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/bag");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => <AntDesign name="user" size={size} color={pathname == "/round" ? "#fff" : "#000"} />}
        label={"Round"}
        labelStyle={[styles.navItemLabel, { color: pathname == "/round" ? "#fff" : "#000" }]}
        style={{ backgroundColor: pathname == "/round" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/round");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => <MaterialIcons name="favorite-outline" size={size} color={pathname == "/favourites" ? "#fff" : "#000"} />}
        label={"Favourites"}
        labelStyle={[styles.navItemLabel, { color: pathname == "/favourites" ? "#fff" : "#000" }]}
        style={{ backgroundColor: pathname == "/favourites" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/favourites");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={pathname == "/settings" ? "#fff" : "#000"} />}
        label={"Settings"}
        labelStyle={[styles.navItemLabel, { color: pathname == "/settings" ? "#fff" : "#000" }]}
        style={{ backgroundColor: pathname == "/settings" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/settings");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => <Ionicons name="toggle" size={size} color={pathname == "/toggle" ? "#fff" : "#000"} />}
        label={"Toggle Theme"}
        labelStyle={[styles.navItemLabel, { color: pathname == "/toggle" ? "#fff" : "#000" }]}
        style={{ backgroundColor: pathname == "/toggle" ? "#333" : "#fff" }}
        onPress={() => {
          toggleThemeFunc();
        }}
      />
      <DrawerItem
        icon={({ color, size }) => <Ionicons name="log-out" size={size} color={pathname == "/logout" ? "#fff" : "#000"} />}
        label={"Logout"}
        labelStyle={[styles.navItemLabel, { color: pathname == "/logout" ? "#fff" : "#000" }]}
        style={{ backgroundColor: pathname == "/logout" ? "#333" : "#fff" }}
        onPress={() => {
          loggedOutFunc();
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const theme = useTheme();
  const isDark = theme.theme.mode === "dark";

  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ headerShown: false, headerStyle: { backgroundColor: isDark ? "black" : "white" }, headerTitleStyle: { color: isDark ? "white" : "black" }, headerTintColor: isDark ? "white" : "black" }}>
      <Drawer.Screen name="favourites" options={{ headerShown: true }} />
      <Drawer.Screen name="settings" options={{ headerShown: true }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});
