import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { Link, Redirect } from "expo-router";
import { DataContext } from "../../context/DataContext";

export default function Page() {
  const { isLoggedInFunc } = useContext(DataContext);

  return <Redirect href="(drawer)/(tabs)/bag" />;
}
