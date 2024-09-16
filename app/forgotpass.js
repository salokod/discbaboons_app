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
import { DataContext } from '../context/DataContext';
import spiroLogo from '../assets/spiro_logo_outline.png';

export default function Page() {
  const {
    requestPasswordFunc,
    passwordResetCheck,
    isLoggedIn,
    savedTheme,
  } = useContext(DataContext);
  const { setMode } = useThemeMode();
  const { showSnackBar } = useSnackBar();

  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMode(savedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedTheme]);

  useEffect(() => {
    if (passwordResetCheck) {
      router.push('/passwordreset');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordResetCheck]);

  const handlePasswordRequest = async () => {
    try {
      setLoading(true);
      const response = await requestPasswordFunc(username);
      showSnackBar(response.data.message, 'success');
      router.push('/');
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
                height: 200,
                width: 200,
              }}
              source={spiroLogo}
            />
            <View style={{ justifyContent: 'space-evenly', alignItems: 'center', width: '70%' }}>
              <Text style={{ marginBottom: 3 }} h4>
                Forgot password
              </Text>
              <Text style={{ alignSelf: 'center' }} h5>
                Enter your username, you baboon...
              </Text>
            </View>
            <View style={{ width: '75%' }}>
              <Input autoCapitalize="none" onChangeText={(value) => setUsername(value)} placeholder="username" leftIcon={<Icon name="user" color={theme.colors.primaryButton} type="font-awesome" size={25} style={{ paddingRight: 5, width: 35, color: theme.colors.background }} />} />
            </View>
            <View style={{ width: '50%' }}>
              <Button
                onPress={() => {
                  handlePasswordRequest();
                }}
                title="Request Password"
                disabled={loading || username.length < 3}
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
