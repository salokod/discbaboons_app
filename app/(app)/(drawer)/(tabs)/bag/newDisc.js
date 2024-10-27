import {
  View, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useSnackBar } from 'react-native-snackbar-hook';
import {
  useTheme, Text, Button, Skeleton, Input, Icon, CheckBox,
} from '@rneui/themed';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ColorPicker, {
  Panel1, Swatches, HueSlider,
} from 'reanimated-color-picker';
import { router } from 'expo-router';
import { DataContext } from '../../../../../context/DataContext';
import {
  speedOptions,
  glideOptions,
  turnOptions,
  fadeOptions,
} from '../../../../../constants/discOptions';

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
  const { getDiscsFromDatabase, userBags, addDiscFunc } = useContext(DataContext);
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
  const [selectedIndex, setIndex] = useState(0);
  const [selectedBag, setSelectedBag] = useState(userBags[0]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateOfPurchase, setDateOfPurchase] = useState(new Date());
  const [discColor, setDiscColor] = useState(theme.colors.primary);
  const [discPlastic, setDiscPlastic] = useState('');
  const [discType, setDiscType] = useState(null);
  const [discWeight, setDiscWeight] = useState('');

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

  const onSelectColor = ({ hex }) => {
    // do something with the selected color.
    setDiscColor(hex);
  };

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

  const discTypesArray = [
    'Approach',
    'Control Driver',
    'Distance Driver',
    'Hybrid Driver',
    'Midrange Driver',
    'Putter',
    'Putter & Approach',
  ].map((type) => ({ item: type, value: type }));

  const speedDropdownRef = useRef(null);
  const glideDropdownRef = useRef(null);
  const turnDropdownRef = useRef(null);
  const fadeDropdownRef = useRef(null);

  const handlePopulateDisc = (item) => {
    setDiscSelected(item);
    setDiscBrand(item.brand);
    setDiscName(item.disc);
    setDiscSpeed(item.speed);
    setDiscGlide(item.glide);
    setDiscTurn(item.turn);
    setDiscFade(item.fade);
    setDiscType(item.type);
  };

  const payload = {
    bagId: selectedBag.baboontype,
    brand: discBrand,
    dateOfPurchase: dateOfPurchase.toISOString(),
    disc: discName,
    discColor,
    discPlastic,
    discType,
    fade: discFade,
    glide: discGlide,
    speed: discSpeed,
    turn: discTurn,
    weight: discWeight,
  };

  const handleSaveDisc = async () => {
    try {
      const response = await addDiscFunc(payload);
      if (response.status === 200) {
        showSnackBar('Disc added successfully', 'success');
        setDiscBrand('');
        setDiscName('');
        setDiscSpeed(null);
        setDiscGlide(null);
        setDiscTurn(null);
        setDiscFade(null);
        setDiscType(null);
        setDiscWeight('');
        setDiscPlastic('');
        router.back(); // Go back to the previous screen
      }
    } catch (error) {
      showSnackBar(error.response.data.message, 'error');
    }
  };

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
                handlePopulateDisc(item);
              }}
              renderItem={renderDisc}
              renderInputSearch={renderInputSearch}
            />
          ) : <Skeleton width="100%" height="100%" animation="wave" />}
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={50} // Adjust this value as needed
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{
              flex: 0.9, alignItems: 'center', justifyContent: 'center', marginVertical: 10, marginBottom: 20,
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
                  <TouchableOpacity onPress={() => speedDropdownRef.current.open()}>
                    <Dropdown
                      ref={speedDropdownRef}
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
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-start', marginHorizontal: 8 }}>
                  <Text style={{ color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold' }}>Glide</Text>
                  <TouchableOpacity onPress={() => glideDropdownRef.current.open()}>
                    <Dropdown
                      ref={glideDropdownRef}
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
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 16 }}>
                <View style={{ alignItems: 'flex-start', marginHorizontal: 8 }}>
                  <Text style={{ color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold' }}>Turn</Text>
                  <TouchableOpacity onPress={() => turnDropdownRef.current.open()}>
                    <Dropdown
                      ref={turnDropdownRef}
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
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'flex-start', marginHorizontal: 8 }}>
                  <Text style={{ color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold' }}>Fade</Text>
                  <TouchableOpacity onPress={() => fadeDropdownRef.current.open()}>
                    <Dropdown
                      ref={fadeDropdownRef}
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
                  </TouchableOpacity>
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
                      key={bag.baboontype}
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
                  <Text style={{
                    fontSize: 26, textAlign: 'left', marginRight: 8, marginLeft: 15,
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

              <View style={{
                justifyContent: 'center', alignItems: 'flex-start', width: '92%', marginTop: 20, marginBottom: 10,
              }}
              >
                <Text style={{
                  color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold', fontSize: 16,
                }}
                >
                  Choose Disc Color:
                </Text>
                <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
                  <ColorPicker style={{ width: '70%' }} value={discColor} onComplete={onSelectColor}>
                    <Panel1 />
                    <HueSlider style={{ marginVertical: 10 }} />
                    <Swatches />
                  </ColorPicker>
                </View>
              </View>
              <Input
                containerStyle={{ marginVertical: 4 }}
                errorStyle={{}}
                errorProps={{}}
                labelStyle={{ color: theme.colors.gray }}
                labelProps={{}}
                leftIconContainerStyle={{}}
                rightIcon={<Icon name="close" size={20} onPress={() => setDiscPlastic('')} />}
                rightIconContainerStyle={{}}
                value={discPlastic}
                placeholder="Disc Plastic"
                onChangeText={(text) => setDiscPlastic(text)}
                label={discPlastic === '' ? null : 'Disc Plastic'}
              />
              <Input
                containerStyle={{ marginVertical: 4 }}
                errorStyle={{}}
                errorProps={{}}
                labelStyle={{ color: theme.colors.gray }}
                labelProps={{}}
                leftIconContainerStyle={{}}
                rightIcon={<Icon name="close" size={20} onPress={() => setDiscWeight('')} />}
                rightIconContainerStyle={{}}
                value={discWeight}
                placeholder="Disc Weight"
                onChangeText={(text) => setDiscWeight(text)}
                label={discWeight === '' ? null : 'Disc Weight'}
              />
              <View style={{ alignItems: 'flex-start', marginHorizontal: 8, width: '93%' }}>
                <Text style={{
                  color: theme.colors.gray, marginBottom: 4, fontWeight: 'bold', fontSize: 16,
                }}
                >
                  Disc Type
                </Text>
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
                    width: '100%',
                  }}
                  dropdownPosition="top"
                  placeholderStyle={{ ...styles.placeholderStyle, color: theme.colors.font }}
                  selectedTextStyle={{ fontSize: 20, textAlign: 'center', color: theme.colors.font }}
                  inputSearchStyle={{ color: theme.colors.font }}
                  // itemTextStyle={{ color: theme.colors.font }}
                  data={discTypesArray}
                  maxHeight={300}
                  labelField="item"
                  valueField="value"
                  placeholder="Pick a disc type...."
                  value={discType}
                  onChange={(item) => {
                    setDiscType(item.value);
                  }}
                />
              </View>
              <View style={{ marginBottom: 20, marginTop: 40 }}>
                <Button
                  disabled={
                  !discBrand
                  || !discName
                  || discSpeed === null
                  || discGlide === null
                  || discTurn === null
                  || discFade === null
              }
                  onPress={handleSaveDisc}
                >
                  <Text style={{ color: 'white' }}>Save Disc</Text>
                  <Icon name="save" color="white" style={{ marginLeft: 5 }} />
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}
