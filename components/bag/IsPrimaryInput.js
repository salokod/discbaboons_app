import React from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from '@rneui/themed';

function IsPrimaryInput({ theme, isPrimary, setIsPrimary }) {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{
        color: theme.colors.gray, fontSize: 18, fontWeight: 'bold', marginBottom: 5, textAlign: 'left',
      }}
      >
        Primary Bag?
      </Text>
      <CheckBox
        title="Yes"
        checked={isPrimary === true}
        onPress={() => setIsPrimary(true)}
        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, marginBottom: -5 }}
        textStyle={{ color: 'black' }}
      />
      <CheckBox
        title="No"
        checked={isPrimary === false}
        onPress={() => setIsPrimary(false)}
        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0 }}
        textStyle={{ color: 'black' }}
      />
    </View>
  );
}

export default IsPrimaryInput;
