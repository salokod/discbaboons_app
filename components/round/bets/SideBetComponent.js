import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, ListItem } from '@rneui/themed';

function SideBetComponent({ game, theme }) {
  const { details } = game;

  // Separate pending and active bets
  const completedBets = details.filter((bet) => bet.status === 'completed');
  const activeBets = details.filter((bet) => bet.status === 'active');

  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  function calculateCompletedBetsTotalAndBaboons() {
    const totals = completedBets.reduce((acc, bet) => {
      if (bet.status === 'completed') {
        const totalBetAmount = (bet.sideBetBaboons.length - 1) * bet.sideBetAmount;
        bet.sideBetBaboons.forEach((baboon) => {
          if (!acc[baboon.baboonId]) {
            acc[baboon.baboonId] = { baboonUsername: baboon.baboonUsername, total: 0 };
          }
          if (baboon.baboonId === bet.winnerId) {
            acc[baboon.baboonId].total += totalBetAmount;
          } else {
            acc[baboon.baboonId].total -= bet.sideBetAmount;
          }
        });
      }
      return acc;
    }, {});

    return Object.values(totals);
  }

  const completedBetsTotals = calculateCompletedBetsTotalAndBaboons(completedBets);

  return (
    <View>
      <Text style={{
        fontSize: 18, color: 'black', marginBottom: 15, fontWeight: 'bold',
      }}
      >
        Side Bets
      </Text>
      {completedBetsTotals.map((baboon) => (
        <View key={baboon.baboonId} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text style={{ color: 'black', flex: 2, marginVertical: 4 }}>
            {baboon.baboonUsername}
            {' '}
            (
            <Text style={{ color: baboon.total < 0 ? 'red' : 'green', fontWeight: 'bold' }}>
              {baboon.total < 0 ? `-$${Math.abs(baboon.total).toFixed(2)}` : `$${baboon.total.toFixed(2)}`}
            </Text>
            )
          </Text>
        </View>
      ))}

      <View style={{ marginBottom: 20, marginTop: 10 }}>
        <Text style={{
          fontSize: 14, color: 'black', marginBottom: 5, fontWeight: 'bold',
        }}
        >
          Active Bets
        </Text>
        {activeBets.map((bet, index) => (
          <ListItem.Accordion
            key={Math.floor(Math.random() * 100000).toString()}
            content={(
              <ListItem.Content>
                <Text style={{ fontSize: 12, color: theme.colors.primary }}>
                  {bet.typeOfSideBet === 'hole' ? `Hole ${bet.hole}` : 'Full Round'}
                </Text>
                <ListItem.Title style={{ fontWeight: 'bold', color: 'black' }}>
                  <Text>
                    {bet.sideBetLabel}
                    {' '}
                    - $
                    {bet.sideBetAmount}
                    {' '}
                    / baboon
                  </Text>
                </ListItem.Title>
              </ListItem.Content>
                          )}
            isExpanded={expanded[index]}
            onPress={() => toggleExpand(index)}
            containerStyle={{
              backgroundColor: theme.colors.secondaryBackgroundColor,
              borderWidth: 1,
              borderColor: 'black',
              elevation: 2,
              marginBottom: 5,
              borderBottomWidth: expanded[index] ? 0 : 1,
            }}
          >
            <View style={{
              padding: 10,
              backgroundColor: theme.colors.secondaryBackgroundColor,
              borderWidth: 1,
              borderColor: 'black',
              elevation: 2,
              borderTopWidth: 0,
              marginTop: -5, // Ensures the border connects seamlessly
            }}
            >
              <Text style={{ fontSize: 13, color: 'black', marginBottom: 5 }}>
                Choose the winner:
              </Text>
              {bet.sideBetBaboons.map((baboon) => (
                <Button
                  key={baboon.baboonId}
                  title={baboon.baboonUsername}
                  onPress={() => console.log(`Selected winner: ${baboon.baboonUsername}`)}
                  containerStyle={{ marginBottom: 5 }}
                  buttonStyle={{ backgroundColor: theme.colors.primaryButton }}
                />
              ))}
              <Button
                title="No Winner"
                onPress={() => console.log('No winner selected')}
                containerStyle={{ marginBottom: 5 }}
                buttonStyle={{ backgroundColor: theme.colors.secondaryButton }}
              />
            </View>
          </ListItem.Accordion>
        ))}
      </View>

      <Text style={{
        fontSize: 14, color: 'black', marginBottom: 5, fontWeight: 'bold',
      }}
      >
        Completed Bets
      </Text>
      {completedBets.map((bet, index) => (
        <ListItem.Accordion
          key={`completed_${Math.random().toString(36).substr(2, 9)}`}
          content={(
            <ListItem.Content>
              <Text style={{ fontSize: 12, color: theme.colors.primary }}>
                {bet.typeOfSideBet === 'hole' ? `Hole ${bet.hole} (Winner: ${bet.winnerUsername})` : `Full Round (Winner: ${bet.winnerUsername})`}
              </Text>
              <ListItem.Title style={{ fontWeight: 'bold', color: 'black' }}>
                <Text>
                  {bet.sideBetLabel}
                  {' '}
                  - $
                  {bet.sideBetAmount}
                  {' '}
                  / baboon
                </Text>
              </ListItem.Title>
            </ListItem.Content>
                      )}
          isExpanded={expanded[`completed_${index}`]}
          onPress={() => toggleExpand(`completed_${index}`)}
          containerStyle={{
            backgroundColor: theme.colors.secondaryBackgroundColor,
            borderWidth: 1,
            borderColor: 'black',
            elevation: 2,
            marginBottom: 5,
            borderBottomWidth: expanded[`completed_${index}`] ? 0 : 1,
          }}
        >
          <View style={{
            padding: 10,
            backgroundColor: theme.colors.secondaryBackgroundColor,
            borderWidth: 1,
            borderColor: 'black',
            elevation: 2,
            borderTopWidth: 0,
            marginTop: -5, // Ensures the border connects seamlessly
          }}
          >
            <Text style={{ fontSize: 13, color: 'black', marginBottom: 5 }}>
              Baboons who bet:
            </Text>
            {bet.sideBetBaboons.map((baboon) => (
              <Text
                key={baboon.baboonId}
                style={{
                  color: 'black',
                  marginBottom: 5,
                  textDecorationLine: baboon.baboonId !== bet.winnerId ? 'line-through' : 'none',
                }}
              >
                {baboon.baboonUsername}
              </Text>
            ))}
          </View>
        </ListItem.Accordion>
      ))}
    </View>
  );
}

export default SideBetComponent;
