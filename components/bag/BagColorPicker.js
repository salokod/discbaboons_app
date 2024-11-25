import React from 'react';
import { View, Text } from 'react-native';
import ColorPicker, {
  Panel1, HueSlider,
} from 'reanimated-color-picker';

function BagColorPicker({ theme, bagColor, onSelectColor }) {
  return (
    <View style={{
      justifyContent: 'center', alignItems: 'flex-start', width: '92%', marginTop: 20, marginBottom: 10,
    }}
    >
      <Text style={{
        color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold', fontSize: 16,
      }}
      >
        Choose Bag Color:
      </Text>
      <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
        <ColorPicker style={{ width: '70%' }} value={bagColor} onComplete={onSelectColor}>
          <Panel1 />
          <HueSlider style={{ marginVertical: 10 }} />
        </ColorPicker>
      </View>
    </View>
  );
}

export default BagColorPicker;
