import { Dialog, Text } from '@rneui/themed';
import { View } from 'react-native';
import React from 'react';

function DeleteDiscDialog({
  visible, onBackdropPress, theme, selectedDiscs, onPress,
}) {
  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={onBackdropPress}
    >
      <Dialog.Title titleStyle={{ color: theme.colors.font }} title="Delete Discs" />

      <Text style={{ marginBottom: 10 }}>
        You sure you want to delete these discs, you baboon?
      </Text>

      {selectedDiscs.map((disc) => (
        <Text key={disc.baboontype} style={{ fontWeight: 'bold' }}>{`${disc.disc} - ${disc.brand}`}</Text>
      ))}
      <View style={{ marginTop: 20 }}>
        <Dialog.Actions>
          <Dialog.Button
            title="DELETE"
            type="solid"
            color="red"
            onPress={onPress}
          />
          <Dialog.Button
            title="CANCEL"
            color={theme.colors.primaryButton}
            type="solid"
            onPress={onBackdropPress}
          />
        </Dialog.Actions>
      </View>
    </Dialog>
  );
}

export default DeleteDiscDialog;
