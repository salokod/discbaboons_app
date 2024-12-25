// components/round/PendingRound.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View, TouchableOpacity, ScrollView,
} from 'react-native';
import { Button, Text } from '@rneui/themed';
import RoundHeader from './RoundHeader';
import HoleInfo from './HoleInfo';
import ScoreInfo from './ScoreInfo';
import BaboonBetsBottomSheet from './BaboonBetsBottomSheet';
import skinCalc from '../../utils/skinCalc';

function PendingRound({
  theme, round, bets,
}) {
  const [selectedHole, setSelectedHole] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      const holeHeight = 40; // Adjust this value based on your hole item height
      const scrollPosition = (selectedHole - 1) * holeHeight;
      scrollViewRef.current.scrollTo({ y: scrollPosition, animated: true });
    }
  }, [selectedHole]);

  const skinShit = skinCalc(round, bets);

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
          <ScrollView
            ref={scrollViewRef}
            bounces
            alwaysBounceVertical
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
          >
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
        <View style={{ width: '80%' }}>
          <HoleInfo theme={theme} hole={round.holeData[selectedHole - 1]} selectedHole={selectedHole} round={round} />
          <ScoreInfo round={round} theme={theme} selectedHole={selectedHole} hole={round.holeData[selectedHole - 1]} setSelectedHole={setSelectedHole} />
          {bets && (
            <Button
              title="Show Bets"
              onPress={() => setIsVisible(true)}
              buttonStyle={{ margin: 10 }}
            />
          )}
          {bets && (
            <BaboonBetsBottomSheet
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              bets={bets}
              theme={theme}
              skinShit={skinShit}
            />
          )}
        </View>
      </View>
    </View>
  );
}

export default PendingRound;
