import React, { useContext, useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View } from 'react-native';
import { useTheme, Text } from '@rneui/themed';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DataContext } from '../../../../../context/DataContext';

export default function Page() {
  const { userBags } = useContext(DataContext);
  const { theme } = useTheme();
  const [bagSelected, setBagSelected] = useState(null);

  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.topBarBackground,
      flex: 0.07,
      justifyContent: 'center',
    },
    container: {
      flex: 1,
    },
    contentContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.topBarBackground,
      flex: 0.93,
      justifyContent: 'center',
      // borderStyle: 'solid',
      // borderWidth: 1,
    },
    dropdown: {
      backgroundColor: theme.colors.mainScreenBackground,
      elevation: 2,
      height: 50,
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
    inputSearchStyle: {
      fontSize: 16,
      height: 40,
    },
    item: {
      alignItems: 'center',
      backgroundColor: theme.colors.mainScreenBackground,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,

    },
    labelText: {
      color: theme.colors.font,
      textAlign: 'center',
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      color: theme.colors.font,
      fontSize: 16,
      textAlign: 'center',
    },
    textItem: {
      color: theme.colors.font,
      flex: 1,
      fontSize: 16,
    },
  });

  useEffect(() => {
    if (userBags && userBags.length > 0) {
      const primaryBag = userBags.find((bag) => bag.isPrimary);
      if (primaryBag) {
        setBagSelected(primaryBag);
      }
    }
  }, [userBags]);

  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={[styles.textItem, styles.labelText]}>{item.bagName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {userBags && (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={userBags}
          maxHeight={300}
          labelField="bagName"
          valueField="baboontype"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={bagSelected}
          onChange={(item) => {
            setBagSelected(item);
          }}
          renderLeftIcon={() => (
            <MaterialIcons name="backpack" size={24} color={theme.colors.font} />)}
          renderItem={renderItem}
        />
        )}
      </View>
      <View style={styles.contentContainer}>
        <Text style={{ fontSize: 18 }}>Feed Page</Text>
        {userBags && userBags.map((bag) => (
          <Text style={{ color: theme.colors.font }} key={bag.baboontype}>{bag.bagName}</Text>
        ))}
      </View>
    </View>
  );
}
