// components/discs/DiscPlasticInput.js
import React from 'react';
import { Input, Icon } from '@rneui/themed';

function DiscPlasticInput({ theme, discPlastic, setDiscPlastic }) {
  return (
    <Input
      containerStyle={{ marginVertical: 4 }}
      errorStyle={{}}
      errorProps={{}}
      labelStyle={{ color: theme.colors.gray }}
      labelProps={{}}
      leftIconContainerStyle={{}}
      rightIcon={<Icon name="close" size={20} onPress={() => setDiscPlastic('')} />}
      rightIconContainerStyle={{}}
      value={discPlastic}
      placeholder="Disc Plastic"
      onChangeText={(text) => setDiscPlastic(text)}
      label={discPlastic === '' ? null : 'Disc Plastic'}
    />
  );
}

export default DiscPlasticInput;
