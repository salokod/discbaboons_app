// components/discs/BagSelection.js
import React from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from '@rneui/themed';

function BagSelection({
  theme, userBags, selectedIndex, setIndex, setSelectedBag,
}) {
  return (
    <View style={{
      justifyContent: 'center', alignItems: 'flex-start', width: '92%', marginVertical: 10,
    }}
    >
      <Text style={{
        color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold', fontSize: 16,
      }}
      >
        Choose Bag:
      </Text>

      <View style={{ backgroundColor: theme.colors.mainScreenBackground, width: '100%' }}>
        {userBags.map((bag, index) => (
          <CheckBox
            key={bag.baboontype}
            checked={selectedIndex === index}
            onPress={() => {
              setIndex(index);
              setSelectedBag(bag);
            }}
            containerStyle={{ backgroundColor: theme.colors.mainScreenBackground, marginVertical: 0 }}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checkedColor={theme.colors.secondaryButton}
            title={bag.bagName}
          />
        ))}
      </View>
      {selectedIndex === null && <Text style={{ color: 'red', fontSize: 12 }}>Please select a bag</Text>}
    </View>
  );
}

export default BagSelection;
