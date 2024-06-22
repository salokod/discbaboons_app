import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { Stack, router, Slot, Redirect } from "expo-router";
import { DataContext } from "../../context/DataContext";

export default function _layout() {
  const { isLoggedIn } = useContext(DataContext);

  console.log("this is the value of isLoggedIn: ", isLoggedIn);
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "red",
        },
        headerTintColor: "white",
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
