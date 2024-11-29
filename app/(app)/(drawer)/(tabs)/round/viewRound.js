import React, { useContext } from 'react';
import {
  useTheme,
} from '@rneui/themed';
import { useLocalSearchParams } from 'expo-router';
import { DataContext } from '../../../../../context/DataContext';
import PendingRound from '../../../../../components/round/PendingRound';
import CompletedRound from '../../../../../components/round/CompletedRound';

export default function Page() {
  const { theme } = useTheme();
  const {
    userRounds, userBets,
  } = useContext(DataContext);
  const { roundId } = useLocalSearchParams();

  const uuid = roundId.replace('#round-', '');

  const round = userRounds.find((r) => r.baboontype === `#round-${uuid}`);
  const bets = userBets.find((r) => r.baboontype === `#baboonbet-${uuid}`);

  return (
    <>
      {
        round.roundStatus === 'pending'
          ? <PendingRound round={round} bets={bets} theme={theme} uuid={uuid} />
          : <CompletedRound round={round} bets={bets} theme={theme} uuid={uuid} />
      }
    </>
  );
}
