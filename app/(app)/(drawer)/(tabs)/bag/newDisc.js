import {
  View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import { useSnackBar } from 'react-native-snackbar-hook';
import {
  useTheme, Text, Button, Input, Icon,
} from '@rneui/themed';

import { router } from 'expo-router';
import { DataContext } from '../../../../../context/DataContext';
import {
  speedOptions,
  glideOptions,
  turnOptions,
  fadeOptions,
} from '../../../../../constants/discOptions';
import DiscModalHeader from '../../../../../components/discs/DiscModalHeader';
import DiscDropdown from '../../../../../components/discs/DiscDropdown';
import DiscBrandInput from '../../../../../components/discs/DiscBrandInput';
import DiscNameInput from '../../../../../components/discs/DiscNameInput';
import DiscAttributesInput from '../../../../../components/discs/DiscAttributesInput';
import BagSelection from '../../../../../components/discs/BagSelection'; // Import the new component
import DateOfPurchaseInput from '../../../../../components/discs/DateOfPurchaseInput'; // Import the new component
import DiscColorPicker from '../../../../../components/discs/DiscColorPicker'; // Import the new component
import DiscPlasticInput from '../../../../../components/discs/DiscPlasticInput'; // Import the new component
import DiscWeightInput from '../../../../../components/discs/DiscWeightInput';
import DiscTypeDropdown from '../../../../../components/discs/DiscTypeDropdown';
import BaboonVision from '../../../../../components/discs/BaboonVision';

export default function Page() {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.mainBackgroundColor,
      flex: 1,
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
        router.back();
      }
    } catch (error) {
      showSnackBar(error.response.data.message, 'error');
    }
  };

  return (
    <>
      <DiscModalHeader title="Add New Disc" />
      <View style={styles.container}>
        <DiscDropdown
          loading={loading}
          discsFromDatabase={discsFromDatabase}
          discSelected={discSelected}
          handlePopulateDisc={handlePopulateDisc}
          renderDisc={renderDisc}
          renderInputSearch={renderInputSearch}
        />
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
              <DiscBrandInput discBrand={discBrand} setDiscBrand={setDiscBrand} theme={theme} />
              <DiscNameInput discName={discName} setDiscName={setDiscName} theme={theme} />
              <DiscAttributesInput
                theme={theme}
                styles={styles}
                speedOptions={speedOptions}
                glideOptions={glideOptions}
                turnOptions={turnOptions}
                fadeOptions={fadeOptions}
                discSpeed={discSpeed}
                setDiscSpeed={setDiscSpeed}
                discGlide={discGlide}
                setDiscGlide={setDiscGlide}
                discTurn={discTurn}
                setDiscTurn={setDiscTurn}
                discFade={discFade}
                setDiscFade={setDiscFade}
                speedDropdownRef={speedDropdownRef}
                glideDropdownRef={glideDropdownRef}
                turnDropdownRef={turnDropdownRef}
                fadeDropdownRef={fadeDropdownRef}
              />

              <BagSelection
                theme={theme}
                userBags={userBags}
                selectedIndex={selectedIndex}
                setIndex={setIndex}
                setSelectedBag={setSelectedBag}
              />
              <DateOfPurchaseInput
                theme={theme}
                formattedDate={formattedDate}
                showDatePicker={showDatePicker}
                isDatePickerVisible={isDatePickerVisible}
                handleConfirm={handleConfirm}
                hideDatePicker={hideDatePicker}
              />

              <DiscColorPicker
                theme={theme}
                discColor={discColor}
                onSelectColor={onSelectColor}
              />

              <DiscPlasticInput
                theme={theme}
                discPlastic={discPlastic}
                setDiscPlastic={setDiscPlastic}
              />
              <DiscWeightInput
                theme={theme}
                discWeight={discWeight}
                setDiscWeight={setDiscWeight}
              />
              <DiscTypeDropdown
                theme={theme}
                styles={styles}
                discType={discType}
                setDiscType={setDiscType}
              />
              {discSpeed !== null && discFade !== null && discTurn !== null && (
              <BaboonVision
                theme={theme}
                discSpeed={discSpeed}
                discFade={discFade}
                discTurn={discTurn}
              />
              )}
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
