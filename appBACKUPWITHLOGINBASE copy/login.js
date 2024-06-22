import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { useRouter } from "expo-router";
import { DataContext } from "../context/DataContext";

export default function Page() {
  const { isLoggedInFunc } = useContext(DataContext);
  const router = useRouter();

  const handleLogin = () => {
    isLoggedInFunc(true);
    router.push("/");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18 }}>Login Page</Text>
      <Button
        onPress={() => {
          handleLogin();
        }}
        title="Login"
      />
    </View>
  );
}
