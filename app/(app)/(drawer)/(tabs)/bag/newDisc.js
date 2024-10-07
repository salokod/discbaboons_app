import {
  View, ScrollView, StyleSheet,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import { useSnackBar } from 'react-native-snackbar-hook';
import {
  useTheme, Text, Button, Skeleton, Input,
} from '@rneui/themed';
import { DataContext } from '../../../../../context/DataContext';

export default function Page() {
  const { theme } = useTheme();
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
    textItem: {
      color: theme.colors.font,
      flex: 1,
      fontSize: 16,
    },
  });
  const { showSnackBar } = useSnackBar();
  const { getDiscsFromDatabase } = useContext(DataContext);

  const [discsFromDatabase, setDiscsFromDatabase] = useState([]);
  const [originalDiscs, setOriginalDiscs] = useState([]);
  const [discSelected, setDiscSelected] = useState({ baboontype: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDiscs = async () => {
      try {
        const response = await getDiscsFromDatabase();
        setDiscsFromDatabase(response.data.discs);
        setOriginalDiscs(response.data.discs);
      } catch (error) {
        showSnackBar(error.response.data.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDiscs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDisc = (item) => (
    <View style={styles.item}>
      <Text style={[styles.textItem, styles.labelText]}>
        {item.disc}
        {' '}
        -
        {' '}
        {item.brand}
      </Text>
    </View>
  );

  const customSearch = (text) => {
    if (text) {
      const filteredData = originalDiscs.filter((item) => {
        const disc = item.disc ? item.disc.toLowerCase() : '';
        const brand = item.brand ? item.brand.toLowerCase() : '';
        return disc.includes(text.toLowerCase()) || brand.includes(text.toLowerCase());
      });
      setDiscsFromDatabase(filteredData);
    } else {
      setDiscsFromDatabase(originalDiscs);
    }
  };

  // useEffect(() => {
  //   if (discsFromDatabase.length === 0 && searchTerm.length === 1) {
  //     setDiscsFromDatabase(originalDiscs);
  //   }
  // }, [discsFromDatabase]);

  const renderInputSearch = () => (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Input
        placeholder="Search disc database..."
        onChangeText={customSearch}
        style={styles.inputSearchStyle}
        containerStyle={{ height: 40, backgroundColor: theme.colors.baseColor }}
        inputContainerStyle={{ borderBottomWidth: 0 }}
        inputStyle={{ textAlign: 'center', color: theme.colors.font }}
      />
    </View>
  );

  return (
    <View style={styles.container}>

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
            labelField="discName"
            valueField="baboontype"
            placeholder="Click here for pre-populated discs"
            searchPlaceholder="Search disc database..."
            search
            value={discSelected}
            onChange={(item) => {
              setDiscSelected(item);
            }}
            renderItem={renderDisc}
            renderInputSearch={renderInputSearch}
          />
        ) : <Skeleton width="100%" height="100%" animation="wave" />}
      </View>
      <ScrollView>
        <View style={{
          flex: 1, justifyContent: 'flexStart', alignItems: 'center', marginVertical: 10,
        }}
        >
          <Text style={{ fontSize: 18 }}>Add New Disc Page</Text>
          <Button onPress={() => router.back()} title="Go Back" />
        </View>
      </ScrollView>
    </View>
  );
}
