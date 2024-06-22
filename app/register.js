import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { useRouter } from "expo-router";
import { DataContext } from "../context/DataContext";

export default function Page() {
  const { isLoggedInFunc, isLoggedIn } = useContext(DataContext);

  if (isLoggedIn) {
    console.log("this should fire");
    return <Redirect href="/" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18 }}>Register Page</Text>
    </View>
  );
}
