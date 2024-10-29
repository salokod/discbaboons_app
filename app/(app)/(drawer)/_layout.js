import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import React, { useContext } from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import {
  Feather, AntDesign, Ionicons,
} from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import {
  useThemeMode, useTheme,
} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../context/DataContext';
import spiroLogoOutline from '../../../assets/spiro_logo_outline.png';

const styles = StyleSheet.create({
  navItemLabel: {
    fontSize: 18,
    marginLeft: -20,
  },
  userDetailsWrapper: {
    marginLeft: 10,
    marginTop: 25,
  },
  userEmail: {
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  // eslint-disable-next-line react-native/no-color-literals
  userInfoWrapper: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

function CustomDrawerContent(props) {
  const {
    loggedOutFunc, toggedThemeContextFunc, userName, userEmail,
  } = useContext(DataContext);
  const { mode, setMode } = useThemeMode();

  const pathname = usePathname();

  const toggleThemeFunc = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
    toggedThemeContextFunc();
  };

  return (
  // eslint-disable-next-line react/jsx-props-no-spreading
    <DrawerContentScrollView
        // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <View style={styles.userInfoWrapper}>
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>
      </View>
      <DrawerItem
          // eslint-disable-next-line max-len
          // eslint-disable-next-line react-native/no-color-literals, react/no-unstable-nested-components
        icon={({ size }) => <Feather name="list" size={size} color={pathname === '/bag' ? '#fff' : '#000'} />}
        label="My Bag"
          // eslint-disable-next-line react-native/no-color-literals
        labelStyle={[styles.navItemLabel, { color: pathname === '/bag' ? '#fff' : '#000' }]}
          // eslint-disable-next-line react-native/no-color-literals
        style={{ backgroundColor: pathname === '/bag' ? '#333' : '#fff' }}
        onPress={() => {
          router.push('/(drawer)/(tabs)/bag');
        }}
      />
      <DrawerItem
          // eslint-disable-next-line max-len
          // eslint-disable-next-line react-native/no-color-literals, react/no-unstable-nested-components
        icon={({ size }) => <AntDesign name="user" size={size} color={pathname === '/round' ? '#fff' : '#000'} />}
        label="Round"
          // eslint-disable-next-line react-native/no-color-literals
        labelStyle={[styles.navItemLabel, { color: pathname === '/round' ? '#fff' : '#000' }]}
          // eslint-disable-next-line react-native/no-color-literals
        style={{ backgroundColor: pathname === '/round' ? '#333' : '#fff' }}
        onPress={() => {
          router.push('/(drawer)/(tabs)/round');
        }}
      />
      <DrawerItem
          // eslint-disable-next-line max-len
          // eslint-disable-next-line react-native/no-color-literals, react/no-unstable-nested-components, max-len
        icon={({ size }) => <MaterialCommunityIcons name="chart-scatter-plot" size={size} color={pathname === '/baboonview' ? '#fff' : '#000'} />}
        label="Baboon View"
          // eslint-disable-next-line react-native/no-color-literals
        labelStyle={[styles.navItemLabel, { color: pathname === '/baboonview' ? '#fff' : '#000' }]}
          // eslint-disable-next-line react-native/no-color-literals
        style={{ backgroundColor: pathname === '/baboonview' ? '#333' : '#fff' }}
        onPress={() => {
          router.push('/baboonview');
        }}

      />
      <DrawerItem
          // eslint-disable-next-line react/no-unstable-nested-components
        icon={({ size }) => <Ionicons name="settings-outline" size={size} color={pathname === '/settings' ? '#fff' : '#000'} />}
        label="Settings"
          // eslint-disable-next-line react-native/no-color-literals
        labelStyle={[styles.navItemLabel, { color: pathname === '/settings' ? '#fff' : '#000' }]}
        // eslint-disable-next-line react-native/no-color-literals
        style={{ backgroundColor: pathname === '/settings' ? '#333' : '#fff' }}
        onPress={() => {
          router.push('/settings');
        }}
      />
      <DrawerItem
          // eslint-disable-next-line react/no-unstable-nested-components
        icon={({ size }) => <Ionicons name="toggle" size={size} color={pathname === '/toggle' ? '#fff' : '#000'} />}
        label="Toggle Theme"
        // eslint-disable-next-line react-native/no-color-literals
        labelStyle={[styles.navItemLabel, { color: pathname === '/toggle' ? '#fff' : '#000' }]}
        // eslint-disable-next-line react-native/no-color-literals
        style={{ backgroundColor: pathname === '/toggle' ? '#333' : '#fff' }}
        onPress={() => {
          toggleThemeFunc();
        }}
      />
      <DrawerItem
          // eslint-disable-next-line react/no-unstable-nested-components
        icon={({ size }) => <Ionicons name="log-out" size={size} color={pathname === '/logout' ? '#fff' : '#000'} />}
        label="Logout"
          // eslint-disable-next-line react-native/no-color-literals
        labelStyle={[styles.navItemLabel, { color: pathname === '/logout' ? '#fff' : '#000' }]}
          // eslint-disable-next-line react-native/no-color-literals
        style={{ backgroundColor: pathname === '/logout' ? '#333' : '#fff' }}
        onPress={() => {
          loggedOutFunc();
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  const theme = useTheme();
  const isDark = theme.theme.mode === 'dark';

  return (
    <Drawer
        // eslint-disable-next-line
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, headerStyle: { backgroundColor: isDark ? 'black' : 'white' }, headerTitleStyle: { color: isDark ? 'white' : 'black' }, headerTintColor: isDark ? 'white' : 'black',
      }}
    >
      <Drawer.Screen
        name="baboonview"
        options={{
          headerShown: true,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={spiroLogoOutline}
                style={{ width: 35, height: 35 }}
              />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          headerShown: true,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerTitle: () => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={spiroLogoOutline}
                style={{ width: 35, height: 35 }}
              />
            </View>
          ),
        }}
      />
    </Drawer>
  );
}
