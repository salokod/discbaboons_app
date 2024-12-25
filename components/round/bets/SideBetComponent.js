import React from 'react';
import { View, Text } from 'react-native';

function SideBetComponent({ game, theme, consolidatedBaboons }) {
  const { details } = game;

  // Separate pending and active bets
  const pendingBets = details.filter((bet) => bet.status === 'completed');
  const activeBets = details.filter((bet) => bet.status === 'active');

  const generateUniqueKey = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <View>
      <Text style={{
        fontSize: 18, color: 'black', marginBottom: 5, fontWeight: 'bold',
      }}
      >
        Side Bets
      </Text>
      {pendingBets.map((bet) => (
        <Text key={generateUniqueKey()} style={{ color: 'black', marginBottom: 5 }}>
          {bet.sideBetLabel}
        </Text>
      ))}
      {activeBets.map((bet) => (
        <Text key={generateUniqueKey()} style={{ color: 'black', marginBottom: 5 }}>
          {bet.sideBetLabel}
        </Text>
      ))}
    </View>
  );
}

export default SideBetComponent;
