import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView, RefreshControl,
} from 'react-native';
import {
  useTheme, Text, ListItem, Button,
} from '@rneui/themed';
import { useSnackBar } from 'react-native-snackbar-hook';
import { router } from 'expo-router';
import { DataContext } from '../../../../../context/DataContext';
import DeleteDiscDialog from '../../../../../components/discs/DeleteDiscDialog';
import MoveDiscDialog from '../../../../../components/discs/MoveDiscDialog';
import BagDropdown from '../../../../../components/bag/BagDropdown';

export default function Page() {
  const { showSnackBar } = useSnackBar();
  const {
    userBags, userDiscs, findAllDiscs, removeDiscs, sendDiscsToBag,
  } = useContext(DataContext);
  const { theme } = useTheme();
  const [bagSelected, setBagSelected] = useState({ baboontype: null });
  const [filteredDiscs, setFilteredDiscs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [checked, setChecked] = useState({});
  const [anyChecked, setAnyChecked] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [moveDiscDialog, setMoveDiscDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedDiscs = userDiscs
    .filter((disc) => checked[disc.baboontype])
    .sort((a, b) => a.disc.localeCompare(b.disc));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.mainBackgroundColor,
      flex: 1,
    },
    listItemContainer: {
      marginRight: 20,
      width: '100%',
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
      paddingHorizontal: 8,
      paddingVertical: 10,
      textAlign: 'center', // Ensure enough width for two-digit numbers
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
      setChecked({});
    } else {
      setFilteredDiscs([]);
    }
  }, [bagSelected, userDiscs]);

  useEffect(() => {
    setAnyChecked(Object.values(checked).some((value) => value === true));
  }, [checked]);

  const toggleDeleteDialog = () => {
    setDeleteDialog(!deleteDialog);
  };

  const toggleMoveDiscDialog = () => {
    setMoveDiscDialog(!moveDiscDialog);
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

  const removeDiscsFunc = async () => {
    const response = await removeDiscs(selectedDiscs);
    try {
      showSnackBar(response.data.message, 'success');
      setDeleteDialog(false);
      setChecked({});
    } catch (error) {
      setDeleteDialog(false);

      showSnackBar(error.response.data.message, 'error');
    }
  };

  const sendDiscsFunc = async (discsToMove, selectedRadioBag) => {
    setLoading(true);
    const response = await sendDiscsToBag(discsToMove, selectedRadioBag);
    try {
      showSnackBar(response.data.message, 'success');
      setMoveDiscDialog(false);
      setChecked({});
    } catch (error) {
      setMoveDiscDialog(false);
      showSnackBar(error.response.data.message, 'error');
    } finally {
      setLoading(false);
    }
  };

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
      onPress={() => handleCheck(item)}
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
        // onPress={() => handleCheck(item)}
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
      <BagDropdown bagSelected={bagSelected} userBags={userBags} setBagSelected={setBagSelected} theme={theme} />
      <ScrollView refreshControl={(
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.font}
          title="loading your data, you baboon...."
          titleColor={theme.colors.font}
        />
      )}
      >
        {filteredDiscs && filteredDiscs.map((disc, index) => renderDisc(disc, index))}

        <DeleteDiscDialog
          visible={deleteDialog}
          onBackdropPress={toggleDeleteDialog}
          theme={theme}
          selectedDiscs={selectedDiscs}
          onPress={() => {
            removeDiscsFunc(selectedDiscs);
          }}
        />
        <MoveDiscDialog
          visible={moveDiscDialog}
          onBackdropPress={toggleMoveDiscDialog}
          theme={theme}
          selectedDiscs={selectedDiscs}
          userBags={userBags}
          selectedBag={bagSelected}
          sendDiscsFunc={sendDiscsFunc}
          loading={loading}
        />

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
            onPress={() => setDeleteDialog(true)}
            titleStyle={{ fontSize: 16, color: 'white' }}
            containerStyle={{ flex: 1 }}
          />

          {selectedDiscs.length > 1 ? (
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
          )
            : (
              <Button
                title="Edit"
                icon={{
                  name: 'clear',
                  type: 'material',
                  size: 25,
                  color: 'white',
                }}
                onPress={() => router.push({
                  pathname: 'bag/editDisc',
                  params: {
                    baboonid: selectedDiscs[0].baboonid,
                    baboontype: selectedDiscs[0].baboontype,
                    bagId: selectedDiscs[0].bagId,
                    brand: selectedDiscs[0].brand,
                    dateOfPurchase: selectedDiscs[0].dateOfPurchase,
                    disc: selectedDiscs[0].disc,
                    discColor: selectedDiscs[0].discColor,
                    discPlastic: selectedDiscs[0].discPlastic,
                    discStatus: selectedDiscs[0].discStatus,
                    discType: selectedDiscs[0].discType,
                    fade: selectedDiscs[0].fade,
                    glide: selectedDiscs[0].glide,
                    lastUsed: selectedDiscs[0].lastUsed,
                    speed: selectedDiscs[0].speed,
                    throws: JSON.stringify(selectedDiscs[0].throws), // Convert array to string
                    turn: selectedDiscs[0].turn,
                    weight: selectedDiscs[0].weight,
                  },
                })}
                buttonStyle={{ backgroundColor: theme.colors.secondaryButton }}
                titleStyle={{ fontSize: 16 }}
                containerStyle={{ flex: 1, marginHorizontal: 5 }}
              />
            )}

          <Button
            title="Send to"
            icon={{
              name: 'send',
              type: 'material',
              size: 25,
              color: 'white',
            }}
            onPress={() => setMoveDiscDialog(true)}
            titleStyle={{ fontSize: 16 }}
            containerStyle={{ flex: 1 }}
          />
        </View>
      </View>
      )}
    </View>
  );
}
