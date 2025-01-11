// components/round/BaboonBetsBottomSheet.js
import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Icon, BottomSheet } from '@rneui/themed';
import SkinsComponent from './bets/SkinsComponent';
import SideBetComponent from './bets/SideBetComponent';

const screenHeight = Dimensions.get('window').height;

function BaboonBetsBottomSheet({
  isVisible, setIsVisible, bets, theme, skinShit,
}) {
  const consolidatedBaboons = [
    {
      baboonid: bets.baboonid,
      baboonUsername: bets.baboonUsername,
    },
    ...bets.otherBaboons.map((baboon) => ({
      baboonid: baboon.baboonFriendId,
      baboonUsername: baboon.baboonFriendUsername,
    })),
  ].sort((a, b) => a.baboonUsername.localeCompare(b.baboonUsername));

  return (
    <BottomSheet
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <View style={{ height: screenHeight * 0.6, backgroundColor: theme.colors.baboonBetBackground }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: theme.colors.baboonBetBackground,
        }}
        >
          <Text style={{
            flex: 1, textAlign: 'center', fontSize: 20, color: 'black',
          }}
          >
            Baboon Bets
          </Text>
          <Icon
            color="black"
            name="close"
            type="material"
            onPress={() => setIsVisible(false)}
          />
        </View>
        <ScrollView style={{ marginBottom: 50 }}>
          {bets && bets.gamesPlayed
            .sort((a) => (a.game === 'skins' ? -1 : 1))
            .map((game) => (
              <View key={`${Math.random()}`} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.gray }}>
                {game.game === 'skins' ? (
                  <SkinsComponent consolidatedBaboons={consolidatedBaboons} skinShit={skinShit} skinAmount={bets.skinsAmount} />
                ) : (
                  <SideBetComponent game={game} theme={theme} consolidatedBaboons={consolidatedBaboons} />
                )}
              </View>
            ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

export default BaboonBetsBottomSheet;
