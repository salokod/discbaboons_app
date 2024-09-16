import { View, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { DataContext } from "../context/DataContext";
import { Button } from "@rneui/base";
import { Image, useTheme, Input, Icon, useThemeMode, Text } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { TouchableWithoutFeedback } from "react-native";
import { useSnackBar } from "react-native-snackbar-hook";

export default function Page() {
  const { isLoggedInFunc, isLoggedIn, savedTheme } = useContext(DataContext);
  const { mode, setMode } = useThemeMode();
  const { showSnackBar } = useSnackBar();

  const { theme, updateTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMode(savedTheme);
  }, [savedTheme]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await isLoggedInFunc(username, passwordInput);
      router.push("/");
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
                height: 175,
                width: 175,
              }}
              source={require("../assets/spiro_logo_outline.png")}
            />
            <Text style={{}} h4>
              Login
            </Text>
            <View style={{ width: "75%" }}>
              <Input autoCapitalize="none" onChangeText={(value) => setUsername(value)} placeholder="username" leftIcon={<Icon name="user" color={theme.colors.primaryButton} type="font-awesome" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
              <Input autoCapitalize="none" onChangeText={(value) => setPasswordInput(value)} secureTextEntry={!showPassword} placeholder="password" leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35 }} />} rightIcon={<Icon name={showPassword ? "eye-off" : "eye"} color={theme.colors.primaryButton} type="ionicon" onPress={() => setShowPassword(!showPassword)} size={25} style={{ paddingRight: 5, width: 35 }} />} />
            </View>
            <View style={{ width: "50%" }}>
              <Button
                onPress={() => {
                  handleLogin();
                }}
                title="Login"
                disabled={loading || username.length < 3 || passwordInput.length < 8}
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
      <View style={{ backgroundColor: theme.colors.background, justifyContent: "flex-start", flex: 0.35 }}>
        <Button
          onPress={() => {
            router.push("/forgotuser");
          }}
          title="Forgot username?"
          type="clear"
          buttonStyle={{
            borderRadius: 30,
          }}
          style={{ marginBottom: 10 }}
          titleStyle={{ color: theme.colors.secondaryButton, fontWeight: "bold" }}
        />
        <Button
          onPress={() => {
            router.push("/forgotpass");
          }}
          title="Forgot password?"
          type="clear"
          buttonStyle={{
            borderRadius: 30,
          }}
          style={{ marginBottom: 10 }}
          titleStyle={{ color: theme.colors.secondaryButton, fontWeight: "bold" }}
        />
        <Button
          onPress={() => {
            router.push("/register");
          }}
          title="New baboon? Sign up here!"
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
