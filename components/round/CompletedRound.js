import React from 'react';
import {
  Text,
} from '@rneui/themed';
import { View } from 'react-native';
import RoundHeader from './RoundHeader';

function CompletedRound({
  theme, round,
}) {
  return (
    <View style={{
      flex: 1, alignItems: 'flex-start', width: '100%', marginTop: 0, backgroundColor: theme.colors.mainBackgroundColor,
    }}
    >
      <RoundHeader round={round} theme={theme} />
      <Text>Complete shit here</Text>
    </View>
  );
}

export default CompletedRound;
