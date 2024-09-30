import React, { useContext, useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  useTheme, Text, ListItem, Avatar,
} from '@rneui/themed';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DataContext } from '../../../../../context/DataContext';

export default function Page() {
  const { userBags, userDiscs } = useContext(DataContext);
  const { theme } = useTheme();
  const [bagSelected, setBagSelected] = useState(null);
  const [filteredDiscs, setFilteredDiscs] = useState([]);

  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.topBarBackground,
      height: '7%',
      justifyContent: 'center',
      minHeight: 50,
    },
    container: {
      backgroundColor: theme.colors.mainScreenBackground,
      flex: 1,
    },
    // contentContainer: {
    //   alignItems: 'center',
    //   backgroundColor: theme.colors.topBarBackground,
    //   flex: 1,
    //   justifyContent: 'center',
    //   // borderStyle: 'solid',
    //   // borderWidth: 1,
    // },
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
    listItemContainer: {
      marginRight: 20,
      width: '100%',
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      color: theme.colors.font,
      fontSize: 16,
      textAlign: 'center',
    },
    subtitleText: {
      fontSize: 12, // Adjust the font size as needed
    },
    textBox: {
      backgroundColor: theme.colors.mainScreenBackground,
      color: theme.colors.font,
      flex: 1,
      fontSize: 12,
      fontWeight: 'bold',
      margin: 5,
      // minWidth: 40,
      padding: 10,
      textAlign: 'center', // Ensure enough width for two-digit numbers
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

  useEffect(() => {
    if (bagSelected) {
      const filtered = userDiscs.filter((disc) => disc.bagId === bagSelected.baboontype);
      setFilteredDiscs(filtered);
    } else {
      setFilteredDiscs([]);
    }
  }, [bagSelected, userDiscs]);

  const renderBag = (item) => (
    <View style={styles.item}>
      <Text style={[styles.textItem, styles.labelText]}>{item.bagName}</Text>
    </View>
  );

  const renderDisc = (item, index) => (
    <ListItem
      bottomDivider
      containerStyle={[
        styles.listItemContainer,
        index % 2 === 0 && styles.alternateBackground,
      ]}
      key={item.baboontype}
    >
      <Avatar
        rounded
        containerStyle={{ backgroundColor: item.discColor }}
      />
      <ListItem.Content style={{ flexDirection: 'row', width: '100%' }}>
        <View style={{ flex: 0.35 }}>
          <ListItem.Title>{item.disc}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitleText}>{item.brand}</ListItem.Subtitle>
        </View>
        <View style={{ flex: 0.65 }}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Text style={styles.textBox} numberOfLines={1}>{item.speed}</Text>
            <Text style={styles.textBox} numberOfLines={1}>{item.glide}</Text>
            <Text style={styles.textBox} numberOfLines={1}>{item.turn}</Text>
            <Text style={styles.textBox} numberOfLines={1}>{item.fade}</Text>
          </View>
        </View>
      </ListItem.Content>
    </ListItem>
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
          renderItem={renderBag}
        />
        )}
      </View>
      <ScrollView>
        {filteredDiscs && filteredDiscs.map((disc, index) => renderDisc(disc, index))}
      </ScrollView>
    </View>
  );
}
