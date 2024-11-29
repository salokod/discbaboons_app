import React, { useState } from 'react';
import { Text } from '@rneui/themed';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import RoundHeader from './RoundHeader';
import HoleInfo from './HoleInfo';

function PendingRound({
  theme, round, bets, uuid,
}) {
  const [selectedHole, setSelectedHole] = useState(1);

  return (
    <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.mainBackgroundColor }}>
      <View style={{ width: '100%' }}>
        <RoundHeader round={round} theme={theme} />
      </View>
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <View style={{
          width: '20%', backgroundColor: theme.colors.secondaryBackgroundColor, marginTop: 10, marginBottom: 100,
        }}
        >
          <ScrollView bounces alwaysBounceVertical contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
            {Array.from({ length: round.holeData.length }, (_, i) => i + 1).map((hole) => (
              <TouchableOpacity
                key={hole}
                onPress={() => setSelectedHole(hole)}
                style={{
                  padding: 10,
                  paddingVertical: 15,
                  backgroundColor: selectedHole === hole ? theme.colors.highlightedColor : 'transparent',
                }}
              >
                <Text style={{ color: theme.colors.font, textAlign: 'center' }}>{hole}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={{
          width: '80%', backgroundColor: theme.colors.secondaryBackgroundColor,
        }}
        >
          <HoleInfo theme={theme} hole={round.holeData[selectedHole - 1]} selectedHole={selectedHole} round={round} />
        </View>
      </View>
    </View>
  );
}

export default PendingRound;
