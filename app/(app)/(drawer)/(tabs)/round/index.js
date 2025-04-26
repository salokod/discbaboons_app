import {
  View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  useTheme, Text, ListItem, Icon,
} from '@rneui/themed';
import { useSnackBar } from 'react-native-snackbar-hook';
import { router } from 'expo-router';
import { DataContext } from '../../../../../context/DataContext';

export default function Page() {
  const {
    getRounds, getBets, userRounds, userBets,
  } = useContext(DataContext);
  const { showSnackBar } = useSnackBar();
  const { theme } = useTheme();

  const [combinedData, setCombinedData] = useState([]);
  const [combinedData2, setCombinedData2] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedRound, setExpandedRound] = useState(null);

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
    viewMoreBox: {
      // backgroundColor: theme.colors.mainScreenBackground,
      color: theme.colors.font,
      flex: 1,
      fontSize: 14,
      fontWeight: 'normal',
      margin: 2,
      marginTop: 10,
      // minWidth: 40,
      paddingHorizontal: 8,
      // paddingVertical: 10,
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

  useEffect(() => {
    // console.log('this ran')
    const getCombineData2 = getCombinedData(userBets, userRounds);
    setCombinedData2(getCombineData2);
  }, [userBets, userRounds]);

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

    if (matchingBet && Array.isArray(matchingBet.gamesPlayed)) {
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

  // console.log('userRounds', userRounds);

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
        {combinedData2.map((round) => (
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
            <ListItem.Content
              style={{ flexDirection: 'column', width: '100%' }}
            >
              <TouchableOpacity onPress={() => router.push({
                pathname: 'round/viewRound',
                params: {
                  roundId: round.baboontype,
                },
              })}
              >
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <Icon
                    name={round.roundStatus === 'pending' ? 'running' : 'check'}
                    type="font-awesome-5"
                    color={theme.colors.font}
                    containerStyle={{ justifyContent: 'center', alignSelf: 'center', marginRight: 20 }}
                  />
                  <View style={{ flex: 0.6 }}>
                    <ListItem.Title numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight: 'bold' }}>{round.roundName}</ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">{round.roundData.parkName}</ListItem.Subtitle>
                    <ListItem.Subtitle style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">{round.dateOfRound}</ListItem.Subtitle>
                  </View>
                  <View style={{ flex: 0.4 }}>
                    <View style={{
                      flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center',
                    }}
                    >
                      <Text style={styles.textBox} numberOfLines={1}>
                        {round.betData ? `${isNaN(round.betData[`${round.baboonid}_money`]) ? '--' : `${round.betData[`${round.baboonid}_money`] < 0 ? '-' : ''}$${Math.abs(round.betData[`${round.baboonid}_money`]).toFixed(2)}`}` : '--'}
                      </Text>
                      <Text style={styles.scoreBox} numberOfLines={1}>
                        {round.scoreInfo && Number(round.scoreInfo[`${round.baboonid}_score`]) - Number(round.scoreInfo[`${round.baboonid}_par`]) === 0
                          ? <Text style={{ fontSize: 15 }}>Even</Text>
                          : `${round.scoreInfo && Number(round.scoreInfo[`${round.baboonid}_score`]) - Number(round.scoreInfo[`${round.baboonid}_par`]) > 0 ? '+' : ''}${round.scoreInfo && Number(round.scoreInfo[`${round.baboonid}_score`]) - Number(round.scoreInfo[`${round.baboonid}_par`])}`}
                      </Text>
                    </View>

                  </View>
                </View>
              </TouchableOpacity>
              { round.otherBaboons.length > 0 && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center',
                  }}
                  onPress={() => setExpandedRound(expandedRound === round.baboontype ? null : round.baboontype)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.viewMoreBox, { marginRight: 5, flex: 0 }]}>
                      {expandedRound === round.baboontype ? 'Close' : `${round.otherBaboons.length} other baboon${round.otherBaboons.length === 1 ? '' : 's'}`}
                    </Text>
                    <Icon name={expandedRound === round.baboontype ? 'angle-up' : 'angle-down'} type="font-awesome" color={theme.colors.font} style={{ marginTop: 4 }} />
                  </View>
                </TouchableOpacity>
              )}
              {expandedRound === round.baboontype && (
                <View style={{
                  flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', marginLeft: 12,
                }}
                >
                  {round.otherBaboons.map((otherBaboon) => (
                    <View
                      style={{
                        flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center',
                      }}
                      key={otherBaboon.baboonFriendId}
                    >
                      <Text
                        key={otherBaboon.baboonFriendUsername}
                        style={{
                          textAlign: 'left', width: '60%', fontSize: 16, fontWeight: 'bold',
                        }}
                      >
                        {otherBaboon.baboonFriendUsername}
                      </Text>
                      <Text style={styles.textBox}>
                        {isNaN(round.betData[`${otherBaboon.baboonFriendId}_money`])
                          ? '--'
                          : `${round.betData[`${otherBaboon.baboonFriendId}_money`] < 0 ? '-' : ''}$${Math.abs(round.betData[`${otherBaboon.baboonFriendId}_money`]).toFixed(2)}`}
                      </Text>
                      <Text style={styles.scoreBox}>
                        {Number(round.scoreInfo[`${otherBaboon.baboonFriendId}_score`]) - Number(round.scoreInfo[`${otherBaboon.baboonFriendId}_par`]) === 0
                          ? <Text style={{ fontSize: 15 }}>Even</Text>
                          : `${Number(round.scoreInfo[`${otherBaboon.baboonFriendId}_score`]) - Number(round.scoreInfo[`${otherBaboon.baboonFriendId}_par`]) > 0 ? '+' : ''}${Number(round.scoreInfo[`${otherBaboon.baboonFriendId}_score`]) - Number(round.scoreInfo[`${otherBaboon.baboonFriendId}_par`])}`}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </ScrollView>
  );
}
