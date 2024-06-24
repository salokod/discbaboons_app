import { View, Text } from "react-native";
import React, { useContext } from "react";
import { useRouter, Redirect } from "expo-router";
import { DataContext } from "../context/DataContext";
import { ThemeConsumer } from "@rneui/themed";
import { Button } from "@rneui/base";
import { useThemeMode } from "@rneui/themed";

export default function Page() {
  const { isLoggedInFunc, isLoggedIn } = useContext(DataContext);
  const { mode, setMode } = useThemeMode();

  const router = useRouter();

  const handleLogin = () => {
    isLoggedInFunc();
    router.push("/");
  };

  if (isLoggedIn) {
    console.log("this should fire");
    return <Redirect href="/" />;
  }

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 18 }}>Login Page</Text>
          <Button
            onPress={() => {
              handleLogin();
            }}
            title="Login"
            color={theme.colors.primary}
          />
          <Button onPress={() => setMode(mode === "dark" ? "light" : "dark")} title={mode} />
        </View>
      )}
    </ThemeConsumer>
  );
}
