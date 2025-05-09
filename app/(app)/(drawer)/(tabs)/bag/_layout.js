import React from 'react';
import { Stack } from 'expo-router';

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="newDisc"
        options={{ presentation: 'formSheet' }}
      />
      <Stack.Screen
        name="editDisc"
        options={{ presentation: 'formSheet' }}
      />
    </Stack>
  );
}
