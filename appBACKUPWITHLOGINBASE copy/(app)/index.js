import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { Link } from "expo-router";
import { DataContext } from "../../context/DataContext";

export default function Page() {
  const { isLoggedInFunc } = useContext(DataContext);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>Welcome to our app</Text>
      <Link href={"/about"}>
        <Text style={{ fontSize: 18 }}>Go to About Page</Text>
      </Link>
      <Link href={"/blog"} asChild>
        <Button title="Go to Blog Page" />
      </Link>
      <Link href={"/blog"} asChild>
        <Button title="Go to Contact Page" />
      </Link>
      <Button title="Logout" onPress={() => isLoggedInFunc()} />
      <Link href={"(drawer)/(tabs)/feed"} asChild>
        <Button title="Go to Tabs" />
      </Link>
    </View>
  );
}
