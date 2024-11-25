import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, Modal, StyleSheet,
} from 'react-native';
import { ListItem, useTheme, Button } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSnackBar } from 'react-native-snackbar-hook';
import { DataContext } from '../../../context/DataContext';
import TopBarLabel from '../../../components/TopBarLabel';
import BagColorPicker from '../../../components/bag/BagColorPicker';
import BagNameInput from '../../../components/bag/BagNameInput';

export default function Page() {
  const { userBags, userDiscs, editBagFunc } = useContext(DataContext);
  const { showSnackBar } = useSnackBar();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBag, setSelectedBag] = useState(null);

  const getActiveDiscsCountByBagId = (bagId) => userDiscs.filter((disc) => disc.bagId === bagId && disc.discStatus === 'active').length;

  const handleEdit = (bag) => {
    setSelectedBag(bag);
    setModalVisible(true);
  };

  const handleColorSelect = (color) => {
    setSelectedBag((prevBag) => ({
      ...prevBag,
      bagColor: color.hex,
    }));
  };

  const handleNameChange = (name) => {
    setSelectedBag((prevBag) => ({
      ...prevBag,
      bagName: name,
    }));
  };

  const handleEditBag = async () => {
    try {
      const payload = {
        bagId: selectedBag.baboontype,
        bagName: selectedBag.bagName,
        bagColor: selectedBag.bagColor,
        isPrimary: selectedBag.isPrimary,
      };
      await editBagFunc(payload);
      showSnackBar('Bag updated', 'success');
      setModalVisible(false);
      setSelectedBag(null);
    } catch (error) {
      showSnackBar('Bag update failed', 'success');
    }
  };

  return (
    <>
      <TopBarLabel title="Manage Bags" />
      <ScrollView style={{ backgroundColor: theme.colors.background, paddingTop: 10 }}>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.colors.background }}>
          {userBags.map((bag) => (
            <React.Fragment key={bag.baboontype}>
              <ListItem containerStyle={{ width: '100%' }}>
                <MaterialCommunityIcons name="bag-personal" size={30} color={bag.bagColor} />

                <ListItem.Content style={{ flexDirection: 'column', width: '100%', marginLeft: 5 }}>
                  <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    {bag.isPrimary && <MaterialCommunityIcons name="star" size={20} color={theme.colors.font} style={{ marginRight: 5 }} />}
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.font, fontSize: 16, fontWeight: 'bold' }}>{bag.bagName}</Text>
                      <Text style={{ color: theme.colors.font, fontSize: 12, fontWeight: 'normal' }}>
                        {`${getActiveDiscsCountByBagId(bag.baboontype)} ${getActiveDiscsCountByBagId(bag.baboontype) === 1 ? 'disc' : 'discs'}`}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                      <Button title="Edit" onPress={() => handleEdit(bag)} />
                      <Button title="Delete" buttonStyle={{ backgroundColor: theme.colors.secondary }} onPress={() => {}} />
                    </View>
                  </View>
                </ListItem.Content>
              </ListItem>
              <View style={{
                width: '80%', height: 0.5, backgroundColor: theme.colors.divider, marginVertical: 10,
              }}
              />
            </React.Fragment>
          ))}
        </View>
        <View style={{
          width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 30,
        }}
        >
          <MaterialCommunityIcons name="star" size={14} color={theme.colors.font} style={{ marginRight: 5 }} />
          <Text style={{ color: theme.colors.font, fontSize: 12, fontWeight: 'bold' }}>primary bag</Text>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Bag</Text>
            <BagNameInput theme={theme} bagName={selectedBag?.bagName} setBagName={handleNameChange} />
            <BagColorPicker theme={theme} bagColor={selectedBag?.bagColor} onSelectColor={handleColorSelect} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <Button title="Cancel" buttonStyle={{ backgroundColor: theme.colors.secondary }} onPress={() => setModalVisible(false)} />
              <Button title="Save Changes" onPress={() => handleEditBag(selectedBag)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
