import React, { useContext, useEffect, useState } from 'react';
import { Text, Button } from '@rneui/themed';
import {
  View, TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { DataContext } from '../../context/DataContext';

function HoleInfo({
  hole, theme, selectedHole, round,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [par, setPar] = useState(hole.par);
  const [distance, setDistance] = useState(hole.distance);
  const [modalMessage, setModalMessage] = useState('');
  const { updateRoundFunc } = useContext(DataContext);

  useEffect(() => {
    setPar(hole.par);
    setDistance(hole.distance);
  }, [selectedHole]);

  const handleSave = async () => {
    setModalMessage('Updating round...');
    const updatedRound = { ...round };
    updatedRound.holeData[selectedHole - 1] = {
      ...updatedRound.holeData[selectedHole - 1],
      par,
      distance,
    };

    try {
      const payload = {
        otherBaboons: updatedRound.otherBaboons,
        baboontype: updatedRound.baboontype,
        holeData: updatedRound.holeData,
        scoreInfo: updatedRound.scoreInfo,
      };
      await updateRoundFunc(payload);
      setTimeout(() => {
        setModalVisible(false);
        setModalMessage('');
      }, 1000);
    } catch (e) {
      setModalMessage('Failed updating round, try again baboon');
      setTimeout(() => {
        setModalMessage('');
      }, 1000);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.highlightedColor,
          padding: 10,
          margin: 10,
          marginRight: 10,
          borderRadius: 5,
          backgroundColor: theme.colors.secondaryBackgroundColor,
        }}
      >
        <View style={{
          marginLeft: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        }}
        >
          <View style={{ alignItems: 'center', marginRight: 20 }}>
            <Text style={{
              color: theme.colors.font, fontWeight: 'bold', fontSize: 20,
            }}
            >
              {`Hole ${hole.holeNumber}`}
            </Text>
            <Text>
              {`Par ${hole.par}`}
            </Text>
            <Text>
              {`Distance: ${hole.distance}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        >
          <View style={{
            width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10,
          }}
          >
            {modalMessage ? (
              <Text style={{
                fontSize: 18, fontWeight: 'bold', color: 'black', textAlign: 'center',
              }}
              >
                {modalMessage}
              </Text>
            ) : (
              <>
                <Text style={{
                  fontSize: 18, fontWeight: 'bold', color: 'black', marginBottom: 25,
                }}
                >
                  Edit Hole Info
                </Text>
                <Text style={{
                  color: theme.colors.gray, fontWeight: 'bold', fontSize: 16, marginBottom: 10,
                }}
                >
                  Par
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  {['3', '4', '5', '6'].map((value) => (
                    <TouchableOpacity
                      key={value}
                      onPress={() => setPar(value)}
                      style={{
                        padding: 10,
                        backgroundColor: par === value ? 'black' : 'white',
                        borderRadius: 5,
                        borderWidth: 0.5,
                        borderColor: 'black',
                        flex: 1,
                        marginHorizontal: 5,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: par === value ? 'white' : 'black', marginHorizontal: 5 }}>{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={{
                  color: theme.colors.gray, fontWeight: 'bold', fontSize: 16, marginBottom: 10, marginTop: 10,
                }}
                >
                  Distance
                </Text>
                <TextInput
                  style={{
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    fontSize: 24,
                    width: '50%',
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}
                  placeholder="Distance"
                  keyboardType="numeric"
                  value={String(distance)}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setDistance(numericValue);
                  }}
                  selectTextOnFocus
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                  <Button title="Cancel" onPress={() => setModalVisible(false)} buttonStyle={{ backgroundColor: theme.colors.secondaryButton }} />
                  <Button title="Update Hole" onPress={handleSave} buttonStyle={{ backgroundColor: theme.colors.primaryButton }} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

export default HoleInfo;
