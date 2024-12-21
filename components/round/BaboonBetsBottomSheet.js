// components/round/BaboonBetsBottomSheet.js
import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Icon, BottomSheet } from '@rneui/themed';

const screenHeight = Dimensions.get('window').height;

function BaboonBetsBottomSheet({
  isVisible, setIsVisible, bets, theme,
}) {
  return (
    <BottomSheet
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <View style={{ height: screenHeight * 0.6 }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: theme.colors.alternateBackground,
        }}
        >
          <Text style={{
            flex: 1, textAlign: 'center', fontSize: 18, color: theme.colors.font,
          }}
          >
            Baboon Bets
          </Text>
          <Icon
            name="close"
            type="material"
            onPress={() => setIsVisible(false)}
          />
        </View>
        <ScrollView>
          {bets && bets.gamesPlayed.map((game) => (
            <View key={game} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.gray }}>
              <Text style={{ fontSize: 18, color: theme.colors.font }}>{game.game === 'skins' ? 'Skins' : 'Side Bets'}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

export default BaboonBetsBottomSheet;
