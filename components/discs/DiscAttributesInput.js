// components/discs/DiscAttributesInput.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

function DiscAttributesInput({
  theme, styles, speedOptions, glideOptions, turnOptions, fadeOptions,
  discSpeed, setDiscSpeed, discGlide, setDiscGlide, discTurn, setDiscTurn, discFade, setDiscFade,
  speedDropdownRef, glideDropdownRef, turnDropdownRef, fadeDropdownRef,
}) {
  return (
    <>
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
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                width: 120,
                height: 120,
              }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
              data={speedOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder=""
              value={discSpeed}
              onChange={(item) => setDiscSpeed(item.value)}
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
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                width: 120,
                height: 120,
              }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
              data={glideOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder=""
              value={discGlide}
              onChange={(item) => setDiscGlide(item.value)}
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
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                width: 120,
                height: 120,
              }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
              data={turnOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder=""
              value={discTurn}
              onChange={(item) => setDiscTurn(item.value)}
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
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                width: 120,
                height: 120,
              }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={{ fontSize: 32, textAlign: 'center', color: theme.colors.font }}
              data={fadeOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder=""
              value={discFade}
              onChange={(item) => setDiscFade(item.value)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default DiscAttributesInput;
