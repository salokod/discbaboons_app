// components/discs/DiscWeightInput.js
import React from 'react';
import { Input, Icon } from '@rneui/themed';

function DiscWeightInput({ theme, discWeight, setDiscWeight }) {
  return (
    <Input
      containerStyle={{ marginVertical: 4 }}
      errorStyle={{}}
      errorProps={{}}
      labelStyle={{ color: theme.colors.gray }}
      labelProps={{}}
      leftIconContainerStyle={{}}
      rightIcon={<Icon name="close" size={20} onPress={() => setDiscWeight('')} />}
      rightIconContainerStyle={{}}
      value={discWeight}
      placeholder="Disc Weight"
      onChangeText={(text) => setDiscWeight(text)}
      label={discWeight === '' ? null : 'Disc Weight'}
    />
  );
}

export default DiscWeightInput;
