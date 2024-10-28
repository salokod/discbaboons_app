// components/discs/DiscFlightGraphSection.js
import React from 'react';
import { View, Text } from 'react-native';
import DiscFlightGraph from './DiscFlightGraph';

function BaboonVision({
  theme, discSpeed, discFade, discTurn,
}) {
  return (
    <>
      <View style={{
        flex: 1, alignItems: 'flex-start', width: '93%', marginTop: 20,
      }}
      >
        <Text style={{
          color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold', fontSize: 16, textAlign: 'left',
        }}
        >
          Baboon Vision
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <DiscFlightGraph speed={discSpeed} fade={discFade} turn={discTurn} />
      </View>
    </>
  );
}

export default BaboonVision;
