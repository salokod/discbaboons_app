// components/DiscModalHeader.js
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@rneui/themed';

function DiscModalHeader({ title }) {
  const { theme } = useTheme();
  return (
    <View style={{
      flex: 0.08, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.mainBackgroundColor,
    }}
    >
      <Text style={{ fontSize: 18, color: theme.colors.font }}>{title}</Text>
    </View>
  );
}

export default DiscModalHeader;
