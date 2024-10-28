// components/discs/DiscBrandInput.js
import React from 'react';
import { Input, Icon } from '@rneui/themed';

function DiscBrandInput({ discBrand, setDiscBrand, theme }) {
  return (
    <Input
      containerStyle={{ marginVertical: 4 }}
      errorMessage={discBrand === '' ? 'Disc Brand is required' : ''}
      errorStyle={{}}
      errorProps={{}}
      labelStyle={{ color: theme.colors.gray }}
      labelProps={{}}
      leftIconContainerStyle={{}}
      rightIcon={<Icon name="close" size={20} onPress={() => setDiscBrand('')} />}
      rightIconContainerStyle={{}}
      value={discBrand}
      placeholder="Disc Brand"
      onChangeText={(text) => setDiscBrand(text)}
      label={discBrand === '' ? null : 'Disc Brand'}
    />
  );
}

export default DiscBrandInput;
