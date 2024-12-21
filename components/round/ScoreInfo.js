import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import { Text } from '@rneui/themed';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { DataContext } from '../../context/DataContext';

function HoleScore({
  hole, theme, selectedHole, round, setSelectedHole,
}) {
  const [scores, setScores] = useState({});
  const { updateRoundFunc } = useContext(DataContext);

  useEffect(() => {
    const initialScores = {
      [round.baboonid]: hole[round.baboonid],
      ...round.otherBaboons.reduce((acc, baboon) => {
        acc[baboon.baboonFriendId] = hole[baboon.baboonFriendId];
        return acc;
      }, {}),
    };
    setScores(initialScores);
  }, [selectedHole]);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const updateScoreOnServer = async (newScores) => {
    const updatedRound = { ...round };
    Object.keys(newScores).forEach((baboonId) => {
      updatedRound.holeData[selectedHole - 1][baboonId] = newScores[baboonId];
    });

    const payload = {
      otherBaboons: updatedRound.otherBaboons,
      baboontype: updatedRound.baboontype,
      holeData: updatedRound.holeData,
      scoreInfo: updatedRound.scoreInfo,
    };
    await updateRoundFunc(payload);
  };

  const debouncedUpdateScoreOnServer = useCallback(debounce(updateScoreOnServer, 2000), [selectedHole]);

  const handleScoreChange = (baboonId, score, isIncrement) => {
    let newScore = score;
    if (newScore < 0) newScore = 0;
    if (newScore > 20) newScore = 20;
    if (scores[baboonId] === 0) {
      newScore = isIncrement ? hole.par : hole.par - 1;
    }
    const newScores = { ...scores, [baboonId]: newScore };
    setScores(newScores);
    debouncedUpdateScoreOnServer(newScores);
  };

  return (
    <View style={{ flex: 0.75 }}>
      <ScrollView style={{ margin: 10 }}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
        }}
        >
          <Text style={{ fontSize: 17 }}>{round.baboonUsername}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => handleScoreChange(round.baboonid, Number(scores[round.baboonid]) - 1, false)}
              style={{
                padding: 10,
                backgroundColor: theme.colors.primaryButton,
                borderRadius: 5,
                marginHorizontal: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>-</Text>
            </TouchableOpacity>
            <View style={{ width: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>{scores[round.baboonid]}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleScoreChange(round.baboonid, Number(scores[round.baboonid]) + 1, true)}
              style={{
                padding: 10,
                backgroundColor: theme.colors.primaryButton,
                borderRadius: 5,
                marginHorizontal: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        {round.otherBaboons.map((baboon) => (
          <View
            key={baboon.baboonFriendId}
            style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 17 }}>{baboon.baboonFriendUsername}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => handleScoreChange(baboon.baboonFriendId, Number(scores[baboon.baboonFriendId]) - 1, false)}
                style={{
                  padding: 10,
                  backgroundColor: theme.colors.primaryButton,
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
              >
                <Text style={{ color: 'white', fontSize: 20 }}>-</Text>
              </TouchableOpacity>
              <View style={{ width: 40, alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>{scores[baboon.baboonFriendId]}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleScoreChange(baboon.baboonFriendId, Number(scores[baboon.baboonFriendId]) + 1, true)}
                style={{
                  padding: 10,
                  backgroundColor: theme.colors.primaryButton,
                  borderRadius: 5,
                  marginHorizontal: 5,
                }}
              >
                <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 10,
      }}
      >
        <TouchableOpacity
          onPress={() => setSelectedHole((prev) => Math.max(prev - 1, 1))}
          style={{
            padding: 10,
            backgroundColor: theme.colors.primaryButton,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>Previous Hole</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedHole((prev) => Math.min(prev + 1, round.holeData.length))}
          style={{
            padding: 10,
            backgroundColor: theme.colors.primaryButton,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>Next Hole</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HoleScore;
