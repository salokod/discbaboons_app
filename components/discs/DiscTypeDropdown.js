// components/discs/DiscTypeDropdown.js
import React from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const discTypesArray = [
  'Approach',
  'Control Driver',
  'Distance Driver',
  'Hybrid Driver',
  'Midrange Driver',
  'Putter',
  'Putter & Approach',
].map((type) => ({ item: type, value: type }));

function DiscTypeDropdown({
  theme, styles, discType, setDiscType,
}) {
  return (
    <View style={{ alignItems: 'flex-start', marginHorizontal: 8, width: '93%' }}>
      <Text style={{
        color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold', fontSize: 16,
      }}
      >
        Disc Type
      </Text>
      <Dropdown
        style={{
          backgroundColor: theme.colors.mainScreenBackground,
          elevation: 2,
          padding: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          width: '100%',
        }}
        dropdownPosition="auto"
        placeholderStyle={{ ...styles.placeholderStyle, color: theme.colors.font }}
        selectedTextStyle={{ fontSize: 20, textAlign: 'center', color: theme.colors.font }}
        inputSearchStyle={{ color: theme.colors.font }}
        data={discTypesArray}
        maxHeight={300}
        labelField="item"
        valueField="value"
        placeholder="Pick a disc type...."
        value={discType}
        onChange={(item) => {
          setDiscType(item.value);
        }}
      />
    </View>
  );
}

export default DiscTypeDropdown;
