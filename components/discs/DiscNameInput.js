// components/discs/DiscNameInput.js
import React from 'react';
import { Input, Icon } from '@rneui/themed';

function DiscNameInput({ discName, setDiscName, theme }) {
  return (
    <Input
      containerStyle={{ marginVertical: 4 }}
      errorMessage={discName === '' ? 'Disc Name is required' : ''}
      errorStyle={{}}
      errorProps={{}}
      labelStyle={{ color: theme.colors.gray }}
      labelProps={{}}
      leftIconContainerStyle={{}}
      rightIcon={<Icon name="close" size={20} onPress={() => setDiscName('')} />}
      rightIconContainerStyle={{}}
      value={discName}
      placeholder="Disc Name"
      onChangeText={(text) => setDiscName(text)}
      textContentType="none"
      label={discName === '' ? null : 'Disc Name'}
    />
  );
}

export default DiscNameInput;
