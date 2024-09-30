import { Button, Image } from 'react-native';
import React from 'react';
import { Tabs, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useTheme, Text } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import spiroLogoOutline from '../../../../assets/spiro_logo_outline.png'; // Import the image

export default function _layout() {
  const theme = useTheme();
  const isDark = theme.theme.mode === 'dark';

  return (
    <Tabs screenOptions={{
      headerLeft: () => <DrawerToggleButton tintColor={isDark ? 'white' : 'black'} />, headerStyle: { backgroundColor: isDark ? 'black' : 'white' }, headerTitleStyle: { color: isDark ? 'white' : 'black' }, tabBarStyle: { backgroundColor: isDark ? 'black' : 'white' }, tabBarActiveTintColor: isDark ? '#ff8bcf' : '#fe00f6', tabBarInactiveTintColor: isDark ? 'white' : 'black',
    }}
    >
      <Tabs.Screen
        name="bag"
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bag-personal" size={24} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text h5 style={{ color, fontWeight: 'bold' }}>
              My Bag
            </Text>
          ),
          headerTitle: () => (
            <Image
              source={spiroLogoOutline} // Use the imported image
              style={{ width: 35, height: 35 }}
            />
          ),
          headerRight: () => <Button onPress={() => router.push('bag/new')} title="Add Post" />,
        }}
      />
      <Tabs.Screen
        name="round"
        options={{
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
          tabBarLabel: ({ color }) => (
            <Text h5 style={{ color, fontWeight: 'bold' }}>
              Rounds
            </Text>
          ),
          headerTitle: 'Rounds',
        }}
      />
    </Tabs>
  );
}
