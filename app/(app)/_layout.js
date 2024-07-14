import { Button } from "react-native";
import React, { useContext, useEffect } from "react";
import { Stack, router, Redirect } from "expo-router";
import { DataContext } from "../../context/DataContext";
import { useThemeMode } from "@rneui/themed";

export default function _layout() {
  const { isLoggedIn, savedTheme, passwordResetCheck } = useContext(DataContext);
  const { mode, setMode } = useThemeMode();

  useEffect(() => {
    setMode(savedTheme);
  }, [savedTheme]);

  useEffect(() => {
    console.log("uef", passwordResetCheck);
  }, [passwordResetCheck]);

  console.log("reset check", isLoggedIn, passwordResetCheck);
  if (!isLoggedIn) {
    if (passwordResetCheck) {
      return <Redirect href="/passwordreset" />;
    } else {
      return <Redirect href="/login" />;
    }
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "red",
        },
        headerTintColor: "white",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerRight: () => (
            <Button
              onPress={() => {
                router.push("contact");
              }}
              title="Contact"
            />
          ),
        }}
      />
      <Stack.Screen name="about" options={{ headerTitle: "About" }} />
      <Stack.Screen name="blog/index" options={{ headerTitle: "All Blog Posts" }} />
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
    </Stack>
  );
}
