import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { DataContext } from '../../../../../context/DataContext';

export default function Page() {
  const {
    userToken, userRtToken, tokenTTL,
  } = useContext(DataContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Feed Page</Text>
      <Text style={{ fontSize: 18 }}>{userToken}</Text>
      <Text style={{ fontSize: 18 }}>{tokenTTL}</Text>
      <Text style={{ fontSize: 18 }}>{userRtToken}</Text>
    </View>
  );
}
