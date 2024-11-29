import React from 'react';
import { Text } from '@rneui/themed';
import { View } from 'react-native';

function RoundHeader({ round, theme }) {
  const date = new Date(round.dateOfRound);
  const options = {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  };
  const formattedDate = date.toLocaleDateString('en-US', options);

  return (
    <View style={{ marginHorizontal: 25, marginTop: 25, marginBottom: 10 }}>
      <Text style={{
        color: theme.colors.font, fontWeight: 'bold', fontSize: 20, textAlign: 'left',
      }}
      >
        {round.roundName}
      </Text>
      <Text>{round.roundData.parkName}</Text>
      <Text>{`${round.roundData.city}, ${round.roundData.stateAbbr}`}</Text>
      <Text>{formattedDate}</Text>
    </View>
  );
}

export default RoundHeader;
