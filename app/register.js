import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18 }}>Register Page</Text>
    </View>
  );
}
