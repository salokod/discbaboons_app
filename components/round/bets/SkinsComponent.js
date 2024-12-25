import React from 'react';
import { View, Text } from 'react-native';

function SkinsComponent({ consolidatedBaboons, skinShit, skinAmount }) {
  const { skinCounter } = skinShit;

  return (
    <View>
      <Text style={{
        fontSize: 18, color: 'black', marginBottom: 5, fontWeight: 'bold',
      }}
      >
        Skins ($
        {skinAmount}
        {' '}
        / hole)
      </Text>
      <Text style={{ marginBottom: 15 }}>
        {skinShit.skinCount}
        {' '}
        skins on the line
      </Text>
      {consolidatedBaboons.map((baboon) => {
        const skinsWon = skinCounter[baboon.baboonid] || 0;
        const moneyWon = skinCounter[`${baboon.baboonid}_money`] || 0;
        const formattedMoneyWon = moneyWon < 0 ? `-$${Math.abs(moneyWon).toFixed(2)}` : `$${moneyWon.toFixed(2)}`;
        const moneyColor = moneyWon < 0 ? 'red' : 'green';

        return (

          <View key={baboon.baboonid} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Text style={{ color: 'black', flex: 2 }}>
              {baboon.baboonUsername}
              {' '}
              (
              <Text style={{ color: moneyColor, fontWeight: 'bold' }}>{formattedMoneyWon}</Text>
              )
            </Text>
            <Text style={{
              color: 'black', fontWeight: 'bold', fontSize: 20, flex: 1, textAlign: 'right',
            }}
            >
              {skinsWon}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default SkinsComponent;
