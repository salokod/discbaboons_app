import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView, RefreshControl, Dimensions,
} from 'react-native';
import {
  useTheme,
} from '@rneui/themed';
import { useSnackBar } from 'react-native-snackbar-hook';
import {
  Svg, Circle, G, Line, Text as SvgText, Image as SvgImage,
} from 'react-native-svg';
import _ from 'lodash';
import { DataContext } from '../../../context/DataContext';
import BagDropdown from '../../../components/bag/BagDropdown';
import spiroLogoOutline from '../../../assets/spiro_logo_outline.png';

export default function Baboonview() {
  const { showSnackBar } = useSnackBar();
  const {
    userBags, userDiscs, findAllDiscs,
  } = useContext(DataContext);
  const { theme } = useTheme();
  const [bagSelected, setBagSelected] = useState({ baboontype: null });
  const [filteredDiscs, setFilteredDiscs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { width, height } = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.mainBackgroundColor,
      flex: 1,
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

  const groupedDiscs = _.groupBy(filteredDiscs, (disc) => {
    const cx = (width / 2) + ((-disc.turn - disc.fade) * (width / 12));
    // eslint-disable-next-line no-mixed-operators
    const cy = (height * 0.72) - (disc.speed * (height * 0.72 / 15));
    return `${cx},${cy}`;
  });

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
        <View style={{
          flex: 1, width: '100%', height: height * 0.72,
        }}
        >
          <Svg height={height * 0.72} width={width}>
            <G>
              {/* Background logo */}
              <SvgImage
                x={(width * 0.2)}
                y={(height * 0.72 * 0.2)}
                width={width * 0.6}
                height={height * 0.72 * 0.6}
                href={spiroLogoOutline}
                opacity="0.15"
              />
              <SvgText
                x={width / 2}
                y={(height * 0.72 * 0.72)} // Adjusted y coordinate to move the text even closer to the image
                fontSize="22"
                fontWeight="bold"
                fill={theme.colors.secondaryButton}
                textAnchor="middle"
                opacity="0.15"
                // eslint-disable-next-line react-native/no-raw-text
              >
                Baboon View
              </SvgText>
              {/* X and Y axis */}
              <Line x1="0" y1={height * 0.72 - 1} x2={width} y2={height * 0.72 - 1} stroke={theme.colors.gray} strokeWidth="1" strokeDasharray="2,20" />
              <Line x1={width / 2} y1="0" x2={width / 2} y2={height * 0.72} stroke={theme.colors.gray} strokeWidth="1" strokeDasharray="2,20" />
              {[1, 3, 5, 7, 9, 11, 13, 15].map((i) => (
                  <SvgText
                      key={i}
                      x={width / 2} // Set x coordinate to the middle of the x-axis
                      y={height * 0.72 - (i * (height * 0.72 / 15))}
                      fontSize="14"
                      fill={theme.colors.font}
                      textAnchor="middle" // Center the text horizontally
                      opacity="0.5"
                  >
                    {i}
                  </SvgText>
              ))}

              {Object.entries(groupedDiscs).map(([key, discs]) => {
                const [cx, cy] = key.split(',').map(Number);
                let label = discs.length > 1 ? `${discs.length} discs` : discs[0].disc;
                const discKey = discs[0].baboontype;
                if (label.length > 11) {
                  label = `${label.substring(0, 11)}...`;
                }
                const color = discs.length > 1 ? theme.colors.secondaryButton : discs[0].discColor;
                return (
                  <G key={discKey}>
                    <SvgText
                      x={cx}
                      y={cy + 22}
                      fontSize="10"
                      fontWeight="500"
                      fill={theme.colors.font}
                      textAnchor="middle"
                    >
                      {label}
                    </SvgText>
                    <Circle
                      cx={cx}
                      cy={cy}
                      r="10"
                      fill={color}
                      stroke={theme.colors.font} // Add border color
                      strokeWidth="2"
                    />
                  </G>
                );
              })}
            </G>
          </Svg>
        </View>
      </ScrollView>
    </View>
  );
}
