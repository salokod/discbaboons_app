import { View, Text, ScrollView } from 'react-native';
import React, { useContext } from 'react';
import { ListItem, useTheme } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../../../context/DataContext';
import TopBarLabel from '../../../components/TopBarLabel';

export default function Page() {
  const { userBags, userDiscs } = useContext(DataContext);
  const { theme } = useTheme();

  const getActiveDiscsCountByBagId = (bagId) => userDiscs.filter((disc) => disc.bagId === bagId && disc.discStatus === 'active').length;

  return (
    <>
      <TopBarLabel title="Manage Bags" />
      <ScrollView style={{ backgroundColor: theme.colors.background, paddingTop: 10 }}>

        <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.colors.background }}>
          {userBags.map((bag) => (
            <>
              <ListItem
                key={bag.baboontype}
                containerStyle={{
                  width: '100%',
                }}
              >
                <MaterialCommunityIcons name="bag-personal" size={30} color={bag.bagColor} />
                <ListItem.Content style={{ flexDirection: 'column', width: '100%' }}>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={{ color: theme.colors.font, fontSize: 16, fontWeight: 'bold' }}>{bag.bagName}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Text style={{ color: theme.colors.font, fontSize: 12, fontWeight: 'normal' }}>
                      {getActiveDiscsCountByBagId(bag.baboontype)}
                      {' '}
                      {getActiveDiscsCountByBagId(bag.baboontype) === 1 ? 'disc' : 'discs'}
                    </Text>
                  </View>
                </ListItem.Content>
              </ListItem>
              <View style={{
                width: '80%', height: 0.5, backgroundColor: theme.colors.divider, marginVertical: 10,
              }}
              />
            </>
          ))}
        </View>
      </ScrollView>

    </>
  );
}
