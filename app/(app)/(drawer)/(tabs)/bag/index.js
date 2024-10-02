import React, { useContext, useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  StyleSheet, View, ScrollView, RefreshControl,
} from 'react-native';
import {
  useTheme, Text, ListItem, Button, Dialog,
} from '@rneui/themed';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSnackBar } from 'react-native-snackbar-hook';
import { DataContext } from '../../../../../context/DataContext';

export default function Page() {
  const { showSnackBar } = useSnackBar();
  const { userBags, userDiscs, findAllDiscs } = useContext(DataContext);
  const { theme } = useTheme();
  const [bagSelected, setBagSelected] = useState(null);
  const [filteredDiscs, setFilteredDiscs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [checked, setChecked] = useState({});
  const [anyChecked, setAnyChecked] = useState(false);
  const [visible6, setVisible6] = useState(false);

  const selectedDiscs = userDiscs
    .filter((disc) => checked[disc.baboontype])
    .sort((a, b) => a.disc.localeCompare(b.disc));

  const styles = StyleSheet.create({
    buttonContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.topBarBackground,
      height: '7%',
      justifyContent: 'center',
      minHeight: 50,
    },
    container: {
      backgroundColor: theme.colors.mainBackgroundColor,
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
      margin: 2,
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

  useEffect(() => {
    setAnyChecked(Object.values(checked).some((value) => value === true));
  }, [checked]);

  const toggleDialog6 = () => {
    setVisible6(!visible6);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await findAllDiscs();
      showSnackBar(response.data.message, 'success');
      setRefreshing(false);
    } catch (error) {
      showSnackBar(error.response.data.message, 'error');
      setRefreshing(false);
    }
  };

  const renderBag = (item) => (
    <View style={styles.item}>
      <Text style={[styles.textItem, styles.labelText]}>{item.bagName}</Text>
    </View>
  );

  const handleCheck = (item) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [item.baboontype]: !prevChecked[item.baboontype],
    }));
  };

  const renderDisc = (item) => (
    <ListItem
      bottomDivider
      containerStyle={[
        styles.listItemContainer,
        {
          backgroundColor: checked[item.baboontype]
            ? theme.colors.highlightedColor
            : theme.colors.baseColor,
        },
      ]}
      key={item.baboontype}
    >
      <ListItem.CheckBox
          // Use ThemeProvider to change the defaults of the checkbox
        iconType="material-community"
        checkedIcon="checkbox-marked-circle"
        uncheckedIcon="checkbox-blank-circle"
        containerStyle={{
          backgroundColor: theme.colors.baseColor,
          borderRadius: 25,
        }}
        uncheckedColor={item.discColor}
        checkedColor={item.discColor}
        size={30}
        checked={checked[item.baboontype] || false}
        onPress={() => handleCheck(item)}
      />
      <ListItem.Content style={{ flexDirection: 'row', width: '100%' }}>
        <View style={{ flex: 0.4 }}>
          <ListItem.Title numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight: 'bold' }}>{item.disc}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitleText} numberOfLines={1} ellipsizeMode="tail">{item.brand}</ListItem.Subtitle>
        </View>
        <View style={{ flex: 0.6 }}>
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
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.font} title="loading your data, you baboon...." titleColor={theme.colors.font} />
      }
      >
        {filteredDiscs && filteredDiscs.map((disc, index) => renderDisc(disc, index))}

        <Dialog
          isVisible={visible6}
          onBackdropPress={toggleDialog6}
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
                onPress={() => {
                  toggleDialog6();
                }}
              />
              <Dialog.Button
                title="CANCEL"
                color={theme.colors.primaryButton}
                type="solid"
                onPress={toggleDialog6}
              />
            </Dialog.Actions>
          </View>
        </Dialog>
      </ScrollView>
      {anyChecked && (
      <View style={{ alignItems: 'center', width: '100%', marginBottom: 10 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '95%',
        }}
        >
          <Button
            title="Delete"
            type="Solid"
            icon={{
              name: 'delete',
              type: 'material',
              size: 25,
              color: 'white',
            }}
            buttonStyle={{ backgroundColor: 'red' }}
            onPress={toggleDialog6}
            titleStyle={{ fontSize: 16, color: 'white' }}
            containerStyle={{ flex: 1 }}
          />

          <Button
            title="Clear"
            icon={{
              name: 'clear',
              type: 'material',
              size: 25,
              color: 'white',
            }}
            onPress={() => setChecked({})}
            buttonStyle={{ backgroundColor: theme.colors.secondaryButton }}
            titleStyle={{ fontSize: 16 }}
            containerStyle={{ flex: 1, marginHorizontal: 5 }}
          />
          <Button
            title="Send to"
            icon={{
              name: 'send',
              type: 'material',
              size: 25,
              color: 'white',
            }}
            titleStyle={{ fontSize: 16 }}
            containerStyle={{ flex: 1 }}
          />
        </View>
      </View>
      )}
    </View>
  );
}
