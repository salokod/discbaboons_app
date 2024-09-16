import React from 'react';
import { Stack } from 'expo-router';

// eslint-disable-next-line no-underscore-dangle
export default function _layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
