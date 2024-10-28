// components/discs/DiscDropdown.js
import React from 'react';
import { View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  useTheme, Text, Icon, Skeleton,
} from '@rneui/themed';

function DiscDropdown({
  loading, discsFromDatabase, discSelected, handlePopulateDisc, renderDisc, renderInputSearch,
}) {
  const { theme } = useTheme();
  const styles = {
    buttonContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.topBarBackground,
      height: '7%',
      justifyContent: 'center',
      minHeight: 50,
    },
    dropdown: {
      backgroundColor: theme.colors.mainScreenBackground,
      elevation: 2,
      height: '100%',
      margin: 16,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      width: '100%',
    },
    iconStyle: {
      height: 20,
      width: 20,
    },
    placeholderStyle: {
      color: theme.colors.font,
      fontSize: 16,
      marginLeft: 10,
      textAlign: 'center',
    },
    selectedTextStyle: {
      color: theme.colors.font,
      fontSize: 16,
      textAlign: 'center',
    },
    inputSearchStyle: {
      fontSize: 16,
    },
  };

  return (
    <View style={styles.buttonContainer}>
      {!loading ? (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={discsFromDatabase}
          maxHeight={300}
          labelField="disc"
          valueField="id"
          placeholder={(
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%',
            }}
            >
              <Icon name="info" type="material" size={24} color={theme.colors.font} />
              <Text style={{ fontSize: 18, marginLeft: 8, textAlign: 'center' }}>Click here for pre-populated discs..</Text>
            </View>
                    )}
          searchPlaceholder="Search disc database..."
          search
          value={discSelected}
          onChange={(item) => {
            handlePopulateDisc(item);
          }}
          renderItem={renderDisc}
          renderInputSearch={renderInputSearch}
        />
      ) : <Skeleton width="100%" height="100%" animation="wave" />}
    </View>
  );
}

export default DiscDropdown;
