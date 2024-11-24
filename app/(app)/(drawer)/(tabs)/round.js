import {
  View, StyleSheet, ScrollView, RefreshControl,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  useTheme, Text, ListItem,
} from '@rneui/themed';
import { useSnackBar } from 'react-native-snackbar-hook';
import { DataContext } from '../../../../context/DataContext';

export default function Page() {
  const {
    getRounds, getBets,
  } = useContext(DataContext);
  const { showSnackBar } = useSnackBar();
  const { theme } = useTheme();

  const [combinedData, setCombinedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.mainBackgroundColor,
      flex: 1,
    },
    listItemContainer: {
      marginRight: 20,
      width: '100%',
    },
    scoreBox: {
      // backgroundColor: theme.colors.mainScreenBackground,
      color: theme.colors.font,
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      margin: 2,
      // minWidth: 40,
      paddingHorizontal: 8,
      paddingVertical: 10,
      textAlign: 'center', // Ensure enough width for two-digit numbers
    },
    subtitleText: {
      fontSize: 12, // Adjust the font size as needed
    },
    textBox: {
      backgroundColor: theme.colors.mainScreenBackground,
      color: theme.colors.font,
      flex: 1,
      fontSize: 12,
      fontWeight: 'bold',
      margin: 2,
      // minWidth: 40,
      paddingHorizontal: 8,
      paddingVertical: 10,
      textAlign: 'center', // Ensure enough width for two-digit numbers
    },
  });

  useEffect(() => {
    const getRoundsAndData = async () => {
      const rounds = await getRounds();
      const bets = await getBets();
      const dataMerged = getCombinedData(bets, rounds);
      setCombinedData(dataMerged);
    };

    getRoundsAndData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const rounds = await getRounds();
      const bets = await getBets();
      const newCombinedData = getCombinedData(bets, rounds);
      setCombinedData(newCombinedData);
      showSnackBar('Round data updated', 'success');
    } catch (error) {
      showSnackBar('Round data failed to update, try again', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const getCombinedData = (bets, rounds) => rounds.map((round) => {
    const roundUUID = round.baboontype.split('-')[1];
    const matchingBet = bets.find((bet) => bet.baboontype.split('-')[1] === roundUUID);

    if (matchingBet) {
      const betData = matchingBet.gamesPlayed.reduce((acc, game) => {
        Object.entries(game.results).forEach(([key, value]) => {
          acc[key] = (acc[key] || 0) + value;
        });
        return acc;
      }, {});

      return {
        ...round,
        betData,
      };
    }

    return {
      ...round,
      betData: null,
    };
  });

  return (
    <ScrollView
      refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.font}
          title="loading your data, you baboon...."
          titleColor={theme.colors.font}
        />
      )}
      style={styles.container}
    >
      <View style={styles.container}>
        {combinedData.map((round) => (
          <ListItem
            bottomDivider
            containerStyle={[
              styles.listItemContainer,
              {
                backgroundColor: round.roundStatus === 'pending'
                  ? theme.colors.highlightedColor
                  : theme.colors.baseColor,
              },
            ]}
            key={round.baboontype}
          >
            <ListItem.Content style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ flex: 0.9 }}>
                <ListItem.Title numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight: 'bold' }}>{round.roundName}</ListItem.Title>
                <ListItem.Subtitle style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">{round.roundData.parkName}</ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">{round.dateOfRound}</ListItem.Subtitle>
              </View>
              <View style={{ flex: 0.5 }}>
                <View style={{
                  flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center',
                }}
                >
                  <Text style={styles.textBox} numberOfLines={1}>
                    {round.betData ? `${round.betData[`${round.baboonid}_money`] < 0 ? '-' : ''}$${Math.abs(round.betData[`${round.baboonid}_money`])}` : '--'}
                  </Text>
                  <Text style={styles.scoreBox} numberOfLines={1}>
                    {Number(round.scoreInfo[`${round.baboonid}_score`]) - Number(round.scoreInfo[`${round.baboonid}_par`]) === 0
                      ? <Text style={{ fontSize: 15 }}>Even</Text>
                      : `${Number(round.scoreInfo[`${round.baboonid}_score`]) - Number(round.scoreInfo[`${round.baboonid}_par`]) > 0 ? '+' : ''}${Number(round.scoreInfo[`${round.baboonid}_score`]) - Number(round.scoreInfo[`${round.baboonid}_par`])}`}
                  </Text>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </ScrollView>
  );
}
