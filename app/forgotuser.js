import { View, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { DataContext } from "../context/DataContext";
import { Button } from "@rneui/base";
import { Image, useTheme, Input, Icon, useThemeMode, Text } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { TouchableWithoutFeedback } from "react-native";
import { useSnackBar } from "react-native-snackbar-hook";
import validator from "validator";

export default function Page() {
  const { requestUsernameFunc, isLoggedIn, savedTheme } = useContext(DataContext);
  const { setMode } = useThemeMode();
  const { showSnackBar } = useSnackBar();
  const { theme, updateTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  //validate email
  const emailCheck = validator.isEmail(email);

  useEffect(() => {
    setMode(savedTheme);
  }, [savedTheme]);

  const handleUserRequest = async () => {
    try {
      setLoading(true);
      const response = await requestUsernameFunc(email);
      showSnackBar(response.data.message, "success");
      setLoading(false);
    } catch (error) {
      showSnackBar(error.response.data.message, "error");
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={{ flex: 1, justifyContent: "space-evenly", alignItems: "center", backgroundColor: theme.colors.background }}>
            <Image
              style={{
                height: 200,
                width: 200,
              }}
              source={require("../assets/spiro_logo_outline.png")}
            />
            <View style={{ justifyContent: "space-evenly", alignItems: "center", width: "70%" }}>
              <Text style={{ marginBottom: 3 }} h4>
                Forgot User
              </Text>
              <Text style={{ alignSelf: "center" }} h5>
                Enter your email, you baboon...
              </Text>
            </View>
            <View style={{ width: "75%" }}>
              <Input autoCapitalize="none" onChangeText={(value) => setEmail(value)} placeholder="email" leftIcon={<Icon name="user" color={theme.colors.primaryButton} type="font-awesome" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
            </View>
            <View style={{ width: "50%" }}>
              <Button
                onPress={() => {
                  handleUserRequest();
                }}
                title="Request Username"
                disabled={loading || !emailCheck}
                type="solid"
                buttonStyle={{
                  borderRadius: 30,
                }}
                color={theme.colors.primaryButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <View style={{ backgroundColor: theme.colors.background, justifyContent: "flex-start", flex: 0.25 }}>
        <Button
          onPress={() => {
            router.push("/login");
          }}
          title="Back to login..."
          type="clear"
          buttonStyle={{
            borderRadius: 30,
          }}
          style={{ marginBottom: "20%" }}
          titleStyle={{ color: theme.colors.secondaryButton, fontWeight: "bold" }}
        />
      </View>
    </>
  );
}
