import {
  View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import React, {
  useContext, useState, useRef,
} from 'react';
import { useSnackBar } from 'react-native-snackbar-hook';
import {
  useTheme, Text, Button, Icon,
} from '@rneui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import { DataContext } from '../../../../../context/DataContext';
import {
  speedOptions,
  glideOptions,
  turnOptions,
  fadeOptions,
} from '../../../../../constants/discOptions';
import DiscModalHeader from '../../../../../components/discs/DiscModalHeader';
import DiscBrandInput from '../../../../../components/discs/DiscBrandInput';
import DiscNameInput from '../../../../../components/discs/DiscNameInput';
import DiscAttributesInput from '../../../../../components/discs/DiscAttributesInput';
import BagSelection from '../../../../../components/discs/BagSelection';
import DateOfPurchaseInput from '../../../../../components/discs/DateOfPurchaseInput';
import DiscColorPicker from '../../../../../components/discs/DiscColorPicker';
import DiscPlasticInput from '../../../../../components/discs/DiscPlasticInput';
import DiscWeightInput from '../../../../../components/discs/DiscWeightInput';
import DiscTypeDropdown from '../../../../../components/discs/DiscTypeDropdown';
import BaboonVision from '../../../../../components/discs/BaboonVision';

export default function Page() {
  const { theme } = useTheme();
  const {
    baboontype, bagId, brand, dateOfPurchase: purchaseDate, disc, discColor: colorOfDisc, discPlastic: discPlasticParam, discType: discTypeParam, fade, glide, speed, turn, weight,
  } = useLocalSearchParams();

  const {
    userBags, editDiscFunc,
  } = useContext(DataContext);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.mainBackgroundColor,
      flex: 1,
    },
  });
  const { showSnackBar } = useSnackBar();
  const [loading, setLoading] = useState(false);
  const [discBrand, setDiscBrand] = useState(brand);
  const [discName, setDiscName] = useState(disc);
  const [discSpeed, setDiscSpeed] = useState(Number(speed));
  const [discGlide, setDiscGlide] = useState(Number(glide));
  const [discTurn, setDiscTurn] = useState(Number(turn));
  const [discFade, setDiscFade] = useState(Number(fade));
  const [selectedIndex, setIndex] = useState(userBags.findIndex((bag) => bag.baboontype === bagId));
  const [selectedBag, setSelectedBag] = useState(userBags.find((bag) => bag.baboontype === bagId));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateOfPurchase, setDateOfPurchase] = useState(new Date(purchaseDate));
  const [discColor, setDiscColor] = useState(colorOfDisc);
  const [discPlastic, setDiscPlastic] = useState(discPlasticParam);
  const [discType, setDiscType] = useState(discTypeParam);
  const [discWeight, setDiscWeight] = useState(weight);

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

  const onSelectColor = ({ hex }) => {
    const hexWithoutAlpha = hex.slice(0, 7); // Extract the first 7 characters including the '#'
    setDiscColor(hexWithoutAlpha);
  };

  const formattedDate = dateOfPurchase.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const speedDropdownRef = useRef(null);
  const glideDropdownRef = useRef(null);
  const turnDropdownRef = useRef(null);
  const fadeDropdownRef = useRef(null);

  const payload = {
    baboontype,
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

  const handleEditDisc = async () => {
    setLoading(true);
    try {
      const response = await editDiscFunc(payload);
      if (response.status === 200) {
        showSnackBar('Disc Edited Successfully', 'success');
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
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
      <DiscModalHeader title="Edit Disc" theme={theme} />
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={50}
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
                          || loading === true
                      }
                  onPress={handleEditDisc}
                >
                  <Text style={{ color: 'white' }}>Edit Disc</Text>
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
