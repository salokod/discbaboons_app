import React, { useState } from 'react';
import { Dialog, Text } from '@rneui/themed';
import { View, TouchableOpacity } from 'react-native';

function MoveDiscDialog({
  visible, onBackdropPress, theme, selectedDiscs, userBags, selectedBag, sendDiscsFunc, loading,
}) {
  const [selectedRadioBag, setSelectedRadioBag] = useState(null);
  const updatedUserBags = userBags.filter((bag) => bag.baboontype !== selectedBag.baboontype);

  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={onBackdropPress}
    >
      <Dialog.Title titleStyle={{ color: theme.colors.font }} title="Move Discs to New Bag" />

      <Text style={{ marginBottom: 10 }}>
        Which bag do you want to move these discs to?
      </Text>

      {updatedUserBags.map((bag) => (
        <TouchableOpacity
          key={bag.baboontype}
          onPress={() => setSelectedRadioBag(bag.baboontype)}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: theme.colors.font,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            {selectedRadioBag === bag.baboontype && (
            <View
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: theme.colors.font,
              }}
            />
            )}
          </View>
          <Text style={{ fontWeight: 'bold' }}>{bag.bagName}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ marginTop: 20 }}>
        <Dialog.Actions>
          <Dialog.Button
            disabled={loading}
            title="SEND TO BAG"
            type="solid"
            color={theme.colors.primaryButton}
            onPress={() => sendDiscsFunc(selectedRadioBag, selectedDiscs)}
          />
          <Dialog.Button
            title="CANCEL"
            color={theme.colors.secondaryButton}
            type="solid"
            onPress={onBackdropPress}
          />
        </Dialog.Actions>
      </View>
    </Dialog>
  );
}

export default MoveDiscDialog;
