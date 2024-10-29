// components/discs/DateOfPurchaseInput.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

function DateOfPurchaseInput({
  theme, formattedDate, showDatePicker, isDatePickerVisible, handleConfirm, hideDatePicker,
}) {
  return (
    <>
      <View style={{
        justifyContent: 'center', alignItems: 'flex-start', width: '92%', marginVertical: 10,
      }}
      >
        <Text style={{
          color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold', fontSize: 16,
        }}
        >
          Date of Purchase:
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
        <TouchableOpacity onPress={showDatePicker} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{
            fontSize: 26, textAlign: 'left', marginRight: 8, marginLeft: 15, color: theme.colors.font,
          }}
          >
            {formattedDate}
          </Text>
          <Icon name="edit" type="material" size={24} color={theme.colors.secondaryButton} />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
}

export default DateOfPurchaseInput;
