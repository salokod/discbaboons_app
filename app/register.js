import { View, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { DataContext } from "../context/DataContext";
import { Button } from "@rneui/base";
import { Image, useTheme, Input, Icon, useThemeMode, Text } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { TouchableWithoutFeedback } from "react-native";
import validator from "validator";
import { useSnackBar } from "react-native-snackbar-hook";

export default function Page() {
  const { registeringFunc, isLoggedIn, savedTheme } = useContext(DataContext);
  const { mode, setMode } = useThemeMode();

  const { theme, updateTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackBar } = useSnackBar();

  const router = useRouter();

  const validatePassword = (password) => {
    // Regular expression to match the password criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

    // Check if the password matches the criteria
    return validator.isLength(password, { min: 8, max: 32 }) && validator.matches(password, passwordRegex);
  };

  const emailCheck = validator.isEmail(email);
  const usernameCheck = validator.isLength(username, { min: 3, max: 30 });
  const isValidPassword = validatePassword(password);
  const isPasswordMatch = password === confirmPassword;
  const allValid = emailCheck && usernameCheck && isValidPassword && isPasswordMatch;

  useEffect(() => {
    setMode(savedTheme);
  }, [savedTheme]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await registeringFunc(username, password, email);
      router.push("/");
      showSnackBar(response.data.message, "success");

      setLoading(false);
    } catch (error) {
      console.log("error", error);
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
                height: 100,
                width: 100,
              }}
              source={require("../assets/spiro_logo_outline.png")}
            />

            <View style={{ width: "75%" }}>
              <Input autoCapitalize="none" errorStyle={{ color: "red" }} errorMessage={!emailCheck && email.length > 0 ? "Enter valid email" : null} onChangeText={(value) => setEmail(value)} placeholder="email" leftIcon={<Icon name="email" color={theme.colors.primaryButton} type="MaterialCommunityIcons" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
              <Input autoCapitalize="none" errorStyle={{ color: "red" }} errorMessage={!usernameCheck && username.length > 0 ? "Username must be greater than 3 characters and less than 30" : null} onChangeText={(value) => setUsername(value)} placeholder="username" leftIcon={<Icon name="user" color={theme.colors.primaryButton} type="font-awesome" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
              <Input autoCapitalize="none" errorStyle={{ color: "red" }} errorMessage={!isValidPassword && password.length > 0 ? "Password must be 8-32 characters long, include at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, !, %, *, ?, &)" : null} onChangeText={(value) => setPassword(value)} secureTextEntry={!showPassword} placeholder="password" leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35 }} />} rightIcon={<Icon name={showPassword ? "eye-off" : "eye"} color={theme.colors.primaryButton} type="ionicon" onPress={() => setShowPassword(!showPassword)} size={25} style={{ paddingRight: 5, width: 35 }} />} />
              <Input autoCapitalize="none" errorStyle={{ color: "red" }} errorMessage={!isPasswordMatch && confirmPassword.length > 0 ? "Passwords must match" : null} onChangeText={(value) => setConfirmPassword(value)} secureTextEntry={!showConfirmPassword} placeholder="password again..." leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35 }} />} rightIcon={<Icon name={showConfirmPassword ? "eye-off" : "eye"} color={theme.colors.primaryButton} type="ionicon" onPress={() => setShowConfirmPassword(!showConfirmPassword)} size={25} style={{ paddingRight: 5, width: 35 }} />} />
            </View>
            <View style={{ width: "50%" }}>
              <Button
                onPress={() => {
                  handleRegister();
                }}
                title="Register"
                disabled={loading || !allValid}
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
      <View style={{ backgroundColor: theme.colors.background }}>
        <Button
          onPress={() => {
            router.push("/login");
          }}
          title="Back to login page, you baboon..."
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
