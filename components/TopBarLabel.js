import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';
import { Text, useTheme } from '@rneui/themed';

function TopBarLabel({
  title,
}) {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.mainBackgroundColor,
      height: '7%',
      justifyContent: 'center',
      minHeight: 50,
    },
  });

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.font }}>{title}</Text>
      </View>
    </View>
  );
}

export default TopBarLabel;
