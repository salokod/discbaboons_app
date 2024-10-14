import {
  View, ScrollView, StyleSheet, TouchableOpacity
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useSnackBar } from 'react-native-snackbar-hook';
import {
  useTheme, Text, Button, Skeleton, Input, Icon, CheckBox,
} from '@rneui/themed';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
  const { getDiscsFromDatabase, userBags } = useContext(DataContext);
  const [discsFromDatabase, setDiscsFromDatabase] = useState([]);
  const [originalDiscs, setOriginalDiscs] = useState([]);
  const [discSelected, setDiscSelected] = useState({ baboontype: null });
  const [loading, setLoading] = useState(false);
  const [discBrand, setDiscBrand] = useState('');
  const [discName, setDiscName] = useState('');
  const [discSpeed, setDiscSpeed] = useState(null);
  const [discGlide, setDiscGlide] = useState(null);
  const [discTurn, setDiscTurn] = useState(null);
  const [discFade, setDiscFade] = useState(null);
  const [selectedIndex, setIndex] = useState(null);
  const [selectedBag, setSelectedBag] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateOfPurchase, setDateOfPurchase] = useState(new Date());

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDateOfPurchase(date);
    hideDatePicker();
  };

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

  const speedOptions = Array.from({ length: 13 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));
  const glideOptions = Array.from({ length: 7 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));
  const turnOptions = Array.from({ length: 29 }, (_, i) => {
    const value = -7 + i * 0.5;
    return { label: value.toString(), value };
  });

  const fadeOptions = Array.from({ length: 29 }, (_, i) => {
    const value = -7 + i * 0.5;
    return { label: value.toString(), value };
  });

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

    const formattedDate = dateOfPurchase.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

  return (
    <>
      <View style={{
        flex: 0.08, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.mainBackgroundColor,
      }}
      >
        <Text style={{ fontSize: 18 }}>Add New Disc Page</Text>
      </View>
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
                setDiscSelected(item);
              }}
              renderItem={renderDisc}
              renderInputSearch={renderInputSearch}
            />
          ) : <Skeleton width="100%" height="100%" animation="wave" />}
        </View>
        <ScrollView style={{ marginBottom: 60 }}>
          <View style={{
            flex: 0.9, alignItems: 'center', justifyContent: 'center', marginVertical: 10,
          }}
          >
            <Input
              containerStyle={{ marginVertical: 4 }}
              errorMessage={discBrand === '' ? 'Disc Brand is required' : ''}
              errorStyle={{}}
              errorProps={{}}
              labelStyle={{ color: theme.colors.gray }}
              labelProps={{}}
              leftIconContainerStyle={{}}
              rightIcon={<Icon name="close" size={20} onPress={() => setDiscBrand('')} />}
              rightIconContainerStyle={{}}
              value={discBrand}
              placeholder="Disc Brand"
              onChangeText={(text) => setDiscBrand(text)}
              label={discBrand === '' ? null : 'Disc Brand'}
            />

            <Input
              containerStyle={{ marginVertical: 4 }}
              errorMessage={discName === '' ? 'Disc Name is required' : ''}
              errorStyle={{}}
              errorProps={{}}
              labelStyle={{ color: theme.colors.gray }}
              labelProps={{}}
              leftIconContainerStyle={{}}
              rightIcon={<Icon name="close" size={20} onPress={() => setDiscName('')} />}
              rightIconContainerStyle={{}}
              value={discName}
              placeholder="Disc Name"
              onChangeText={(text) => setDiscName(text)}
              textContentType="none"
              label={discName === '' ? null : 'Disc Name'}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 16 }}>
              <View style={{ alignItems: 'flex-start', marginHorizontal: 8 }}>
                <Text style={{ color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold' }}>Speed</Text>
                <Dropdown
                  style={{
                    backgroundColor: theme.colors.mainScreenBackground,
                    elevation: 2,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    width: 120, // Increase width to 120
                    height: 120, // Increase height to 120
                  }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
                  data={speedOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder=""
                  value={discSpeed}
                  onChange={(item) => {
                    setDiscSpeed(item.value);
                  }}
                />
              </View>
              <View style={{ alignItems: 'flex-start', marginHorizontal: 8 }}>
                <Text style={{ color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold' }}>Glide</Text>
                <Dropdown
                  style={{
                    backgroundColor: theme.colors.mainScreenBackground,
                    elevation: 2,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    width: 120, // Increase width to 120
                    height: 120, // Increase height to 120
                  }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
                  data={glideOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder=""
                  value={discGlide}
                  onChange={(item) => {
                    setDiscGlide(item.value);
                  }}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 16 }}>
              <View style={{ alignItems: 'flex-start', marginHorizontal: 8 }}>
                <Text style={{ color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold' }}>Turn</Text>
                <Dropdown
                  style={{
                    backgroundColor: theme.colors.mainScreenBackground,
                    elevation: 2,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    width: 120, // Increase width to 120
                    height: 120, // Increase height to 120
                  }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
                  data={turnOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder=""
                  value={discTurn}
                  onChange={(item) => {
                    setDiscTurn(item.value);
                  }}
                />
              </View>
              <View style={{ alignItems: 'flex-start', marginHorizontal: 8 }}>
                <Text style={{ color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold' }}>Fade</Text>
                <Dropdown
                  style={{
                    backgroundColor: theme.colors.mainScreenBackground,
                    elevation: 2,
                    padding: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    width: 120, // Increase width to 120
                    height: 120, // Increase height to 120
                  }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
                  data={fadeOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder=""
                  value={discFade}
                  onChange={(item) => {
                    setDiscFade(item.value);
                  }}
                />
              </View>
            </View>

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
                    key={index}
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
                      <Text style={{ fontSize: 26, textAlign: 'left', marginRight: 8, marginLeft: 15 }}>{formattedDate}</Text>
                      <Icon name="edit" type="material" size={24} color={theme.colors.secondaryButton}/>
                  </TouchableOpacity>
              </View>
              <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
              />
            </View>
        </ScrollView>
      </View>
    </>
  );
}
