import { View, Text, Button } from 'react-native';
import React, { useContext } from 'react';
import { DataContext } from '../../../../../context/DataContext';

export default function Page() {
  const {
    findAllBags,
  } = useContext(DataContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>Feed Page</Text>
      <Button title="Find All Bags" onPress={findAllBags} />
    </View>
  );
}
