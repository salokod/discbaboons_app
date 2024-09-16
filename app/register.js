import {
  View, Keyboard, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { useRouter, Redirect } from 'expo-router';
import { Button } from '@rneui/base';
import {
  Image, useTheme, Input, Icon, useThemeMode, Text,
} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import validator from 'validator';
import { useSnackBar } from 'react-native-snackbar-hook';
import { DataContext } from '../context/DataContext';
import spiroLogo from '../assets/spiro_logo_outline.png';

export default function Page() {
  const { registeringFunc, isLoggedIn, savedTheme } = useContext(DataContext);
  const { setMode } = useThemeMode();

  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackBar } = useSnackBar();

  const router = useRouter();

  const validatePassword = (pass) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

    // Check if the password matches the criteria
    return validator.isLength(pass, { min: 8, max: 32 })
        && validator.matches(pass, passwordRegex);
  };

  const emailCheck = validator.isEmail(email);
  const usernameCheck = validator.isLength(username, { min: 3, max: 30 });
  const isValidPassword = validatePassword(password);
  const isPasswordMatch = password === confirmPassword;
  const allValid = emailCheck && usernameCheck && isValidPassword && isPasswordMatch;

  useEffect(() => {
    setMode(savedTheme);
  }, [savedTheme, setMode]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await registeringFunc(username, password, email);
      router.push('/');
      showSnackBar(response.data.message, 'success');

      setLoading(false);
    } catch (error) {
      showSnackBar(error.response.data.message, 'error');
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={{
            flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: theme.colors.background,
          }}
          >
            <Image
              style={{
                height: 100,
                width: 100,
              }}
              source={spiroLogo}
            />
            <Text style={{}} h4>
              Register below
            </Text>
            <View style={{ width: '75%' }}>
              {/* eslint-disable-next-line react-native/no-color-literals */}
              <Input autoCapitalize="none" errorStyle={{ color: '#FF0000' }} errorMessage={!emailCheck && email.length > 0 ? 'Enter valid email' : null} onChangeText={(value) => setEmail(value)} placeholder="email" leftIcon={<Icon name="email" color={theme.colors.primaryButton} type="MaterialCommunityIcons" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
              {/* eslint-disable-next-line react-native/no-color-literals */}
              <Input autoCapitalize="none" errorStyle={{ color: '#FF0000' }} errorMessage={!usernameCheck && username.length > 0 ? 'Username must be greater than 3 characters and less than 30' : null} onChangeText={(value) => setUsername(value)} placeholder="username" leftIcon={<Icon name="user" color={theme.colors.primaryButton} type="font-awesome" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
              {/* eslint-disable-next-line react-native/no-color-literals */}
              <Input autoCapitalize="none" errorStyle={{ color: '#FF0000' }} errorMessage={!isValidPassword && password.length > 0 ? 'Password must be 8-32 characters long, include at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, !, %, *, ?, &)' : null} onChangeText={(value) => setPassword(value)} secureTextEntry={!showPassword} placeholder="password" leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35 }} />} rightIcon={<Icon name={showPassword ? 'eye-off' : 'eye'} color={theme.colors.primaryButton} type="ionicon" onPress={() => setShowPassword(!showPassword)} size={25} style={{ paddingRight: 5, width: 35 }} />} />
              {/* eslint-disable-next-line react-native/no-color-literals */}
              <Input autoCapitalize="none" errorStyle={{ color: '#FF0000' }} errorMessage={!isPasswordMatch && confirmPassword.length > 0 ? 'Passwords must match' : null} onChangeText={(value) => setConfirmPassword(value)} secureTextEntry={!showConfirmPassword} placeholder="password again..." leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35 }} />} rightIcon={<Icon name={showConfirmPassword ? 'eye-off' : 'eye'} color={theme.colors.primaryButton} type="ionicon" onPress={() => setShowConfirmPassword(!showConfirmPassword)} size={25} style={{ paddingRight: 5, width: 35 }} />} />
            </View>
            <View style={{ width: '50%' }}>
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
            router.push('/login');
          }}
          title="Back to login page, you baboon..."
          type="clear"
          buttonStyle={{
            borderRadius: 30,
          }}
          style={{ marginBottom: '20%' }}
          titleStyle={{ color: theme.colors.secondaryButton, fontWeight: 'bold' }}
        />
      </View>
    </>
  );
}
