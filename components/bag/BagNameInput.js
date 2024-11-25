// components/discs/BagNameInput.js
import React from 'react';
import { Input, Icon } from '@rneui/themed';

function BagNameInput({ theme, bagName, setBagName }) {
  return (
    <Input
      containerStyle={{ marginVertical: 4 }}
      errorStyle={{}}
      errorProps={{}}
      labelStyle={{ color: theme.colors.gray }}
      labelProps={{}}
      leftIconContainerStyle={{}}
      rightIcon={<Icon name="close" size={20} onPress={() => setBagName('')} />}
      rightIconContainerStyle={{}}
      value={bagName}
      placeholder="Bag Name"
      onChangeText={(text) => setBagName(text)}
      label={bagName === '' ? null : 'Disc Name'}
      inputStyle={{ color: 'black' }}
    />
  );
}

export default BagNameInput;
