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
import { useSnackBar } from 'react-native-snackbar-hook';
import validator from 'validator';
import { DataContext } from '../context/DataContext';
import spiroLogo from '../assets/spiro_logo_outline.png';

export default function Page() {
  const {
    changePasswordFunc,
    passwordResetTTL,
    passwordUrlUuid,
    validateResetTokenFunc,
    savedTheme,
    passwordResetCheck,
    testFunc,
  } = useContext(DataContext);
  const { setMode } = useThemeMode();
  const { showSnackBar } = useSnackBar();
  const { theme } = useTheme();
  const [passwordResetCode, setPasswordResetCode] = useState(null);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  useEffect(() => {
    setMode(savedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedTheme]);

  const handleUserRequest = async () => {
    const validateCode = await validateResetTokenFunc(passwordResetCode, passwordUrlUuid);

    if (validateCode) {
      setLoading(true);
      showSnackBar('Good job baboon, enter new password', 'success');
      setIsCodeValid(true);
      setLoading(false);
    } else {
      showSnackBar('Incorrect code, try again', 'error');
      setIsCodeValid(false);
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const changePassword = await changePasswordFunc(passwordResetCode, passwordUrlUuid, password);

    if (changePassword) {
      setLoading(true);
      showSnackBar('Password changed successfully, taking you back to login', 'success');
      setLoading(false);
      router.push('/login');
    } else {
      showSnackBar('Password not changed, try again later', 'error');
      setLoading(false);
    }
  };

  if (!passwordResetCheck) {
    return <Redirect href="/forgotpass" />;
  }

  const minutes = Math.floor((passwordResetTTL - Date.now() / 1000) / 60);

  if (minutes <= 0) {
    testFunc();
    return <Redirect href="/forgotpass" />;
  }

  const validatePassword = (pass) => {
    // Regular expression to match the password criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

    // Check if the password matches the criteria
    return validator.isLength(pass, { min: 8, max: 32 })
        && validator.matches(pass, passwordRegex);
  };

  const isValidPassword = validatePassword(password);
  const isPasswordMatch = password === confirmPassword;

  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {!isCodeValid ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{
              flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: theme.colors.background,
            }}
            >
              <Image
                style={{
                  height: 200,
                  width: 200,
                }}
                source={spiroLogo}
              />
              <View style={{ justifyContent: 'space-evenly', alignItems: 'center', width: '70%' }}>
                <Text style={{ marginBottom: 3 }} h4>
                  Enter reset code
                </Text>
                <Text style={{ alignSelf: 'center' }} h5>
                  Code sent to email. Expires in
                  {' '}
                  {minutes + 1}
                  {' '}
                  {minutes === 0 ? 'minute' : 'minutes'}
                  .
                </Text>
              </View>
              <View style={{ width: '75%' }}>
                <Input inputMode="numeric" autoCapitalize="none" value={passwordResetCode} onChangeText={(value) => setPasswordResetCode(value)} placeholder="reset code from email" leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
              </View>
              <View style={{ width: '50%' }}>
                <Button
                  onPress={() => {
                    handleUserRequest();
                  }}
                  title="Reset Password"
                  disabled={loading}
                  type="solid"
                  buttonStyle={{
                    borderRadius: 30,
                  }}
                  color={theme.colors.primaryButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{
              flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: theme.colors.background,
            }}
            >
              <Image
                style={{
                  height: 200,
                  width: 200,
                }}
                source={spiroLogo}
              />
              <View style={{ justifyContent: 'space-evenly', alignItems: 'center', width: '70%' }}>
                <Text style={{ marginBottom: 3 }} h4>
                  Enter new password below
                </Text>
                <Text style={{ alignSelf: 'center' }} h5>
                  Code sent to email. Expires in
                  {' '}
                  {minutes + 1}
                  {' '}
                  {minutes === 0 ? 'minute' : 'minutes'}
                  .
                </Text>
              </View>
              <View style={{ width: '75%' }}>
                {/* eslint-disable-next-line react-native/no-color-literals */}
                <Input autoCapitalize="none" errorStyle={{ color: 'red' }} errorMessage={!isValidPassword && password.length > 0 ? 'Password must be 8-32 characters long, include at least one lowercase letter, one uppercase letter, one digit, and one special character (@, $, !, %, *, ?, &)' : null} onChangeText={(value) => setPassword(value)} secureTextEntry={!showPassword} placeholder="password" leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35 }} />} rightIcon={<Icon name={showPassword ? 'eye-off' : 'eye'} color={theme.colors.primaryButton} type="ionicon" onPress={() => setShowPassword(!showPassword)} size={25} style={{ paddingRight: 5, width: 35 }} />} />
                {/* eslint-disable-next-line react-native/no-color-literals */}
                <Input autoCapitalize="none" errorStyle={{ color: 'red' }} errorMessage={!isPasswordMatch && confirmPassword.length > 0 ? 'Passwords must match' : null} onChangeText={(value) => setConfirmPassword(value)} secureTextEntry={!showConfirmPassword} placeholder="password again..." leftIcon={<Icon name="password" color={theme.colors.primaryButton} type="MaterialIcons" size={25} style={{ paddingRight: 5, width: 35 }} />} rightIcon={<Icon name={showConfirmPassword ? 'eye-off' : 'eye'} color={theme.colors.primaryButton} type="ionicon" onPress={() => setShowConfirmPassword(!showConfirmPassword)} size={25} style={{ paddingRight: 5, width: 35 }} />} />
              </View>
              <View style={{ width: '50%' }}>
                <Button
                  onPress={() => {
                    handlePasswordChange();
                  }}
                  title="Reset Password"
                  disabled={loading || !isValidPassword || !isPasswordMatch}
                  type="solid"
                  buttonStyle={{
                    borderRadius: 30,
                  }}
                  color={theme.colors.primaryButton}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </TouchableWithoutFeedback>
      <View style={{ backgroundColor: theme.colors.background, justifyContent: 'flex-start', flex: 0.25 }}>
        <Button
          onPress={() => {
            router.push('/login');
          }}
          title="Back to login..."
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
