import React, { useState, useContext, useEffect } from 'react';
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
import IsPrimaryInput from '../../../components/bag/IsPrimaryInput';

export default function Page() {
  const {
    userBags, userDiscs, editBagFunc, deleteBagFunc, sendDiscsToBag, addBagFunc,
  } = useContext(DataContext);
  const { showSnackBar } = useSnackBar();
  const { theme } = useTheme();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBag, setSelectedBag] = useState(null);
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    if (selectedBag) {
      setIsPrimary(selectedBag.isPrimary);
    }
  }, [selectedBag]);

  const getActiveDiscsCountByBagId = (bagId) => userDiscs.filter((disc) => disc.bagId === bagId && disc.discStatus === 'active').length;

  const getDiscsPayloadByBagId = (bagId) => userDiscs
    .filter((disc) => disc.bagId === bagId)
    .map((disc) => ({ baboontype: disc.baboontype }));

  const handleEdit = (bag) => {
    setSelectedBag(bag);
    setEditModalVisible(true);
  };

  const handleDelete = (bag) => {
    setSelectedBag(bag);
    setDeleteModalVisible(true);
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

  const handleAddBag = async () => {
    try {
      const payload = {
        bagName: selectedBag.bagName,
        bagColor: selectedBag.bagColor,
        isPrimary,
      };
      await addBagFunc(payload);
      showSnackBar('Bag created', 'success');
      setAddModalVisible(false);
      setSelectedBag(null);
    } catch (error) {
      showSnackBar('Bag update failed', 'success');
    }
  };

  const handleEditBagSubmit = async () => {
    try {
      const payload = {
        bagId: selectedBag.baboontype,
        bagName: selectedBag.bagName,
        bagColor: selectedBag.bagColor,
        isPrimary,
      };
      await editBagFunc(payload);
      showSnackBar('Bag updated', 'success');
      setEditModalVisible(false);
      setSelectedBag(null);
    } catch (error) {
      showSnackBar('Bag update failed', 'success');
    }
  };

  const handleDeleteBag = async () => {
    try {
      const payload = {
        bagId: selectedBag.baboontype,
      };
      await deleteBagFunc(payload);
      showSnackBar('Bag deleted', 'success');
      setDeleteModalVisible(false);
      setSelectedBag(null);
    } catch (error) {
      showSnackBar('Bag delete failed', 'success');
    }
  };

  const sendDiscsToNewBag = async (newBagId) => {
    try {
      await sendDiscsToBag(newBagId, getDiscsPayloadByBagId(selectedBag.baboontype));
      showSnackBar('Discs moved to new bag', 'success');
      // setSelectedBag(null);
    } catch (error) {
      showSnackBar('Discs failed to move to new bag', 'success');
    }
  };

  const handleEditBagClose = () => {
    setEditModalVisible(false);
    setSelectedBag(null);
    setIsPrimary(false);
  };

  const handleAddBagClose = () => {
    setAddModalVisible(false);
    setSelectedBag(null);
    setIsPrimary(false);
  };
  const handleDeleteBagClose = () => {
    setDeleteModalVisible(false);
    setSelectedBag(null);
  };

  return (
    <>
      <TopBarLabel title="Manage Bags" />
      <View style={{
        flexDirection: 'row', justifyContent: 'center', backgroundColor: theme.colors.background, paddingTop: 20,
      }}
      >
        <Button
          title="Add New Bag"
          icon={<MaterialCommunityIcons name="plus" size={20} color="white" />}
          onPress={() => { setAddModalVisible(true); }}
        />
      </View>
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
                      <Button title="Edit" buttonStyle={{ backgroundColor: theme.colors.secondary }} onPress={() => handleEdit(bag)} />
                      <Button title="Delete" buttonStyle={{ backgroundColor: 'red' }} onPress={() => handleDelete(bag)} />
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

      {addModalVisible && (
      <Modal
        animationType="slide"
        transparent
        visible={addModalVisible}
        onRequestClose={() => handleAddBagClose()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bag</Text>
            <BagNameInput theme={theme} bagName={selectedBag?.bagName} setBagName={handleNameChange} />
            <BagColorPicker theme={theme} bagColor={selectedBag?.bagColor} onSelectColor={handleColorSelect} />
            <IsPrimaryInput theme={theme} isPrimary={isPrimary} setIsPrimary={setIsPrimary} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <Button title="Cancel" buttonStyle={{ backgroundColor: theme.colors.secondary }} onPress={() => handleAddBagClose()} />
              <Button title="Save" onPress={() => handleAddBag(selectedBag)} />
            </View>
          </View>
        </View>
      </Modal>
      )}

      {editModalVisible && (
      <Modal
        animationType="slide"
        transparent
        visible={editModalVisible}
        onRequestClose={() => handleEditBagClose()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Bag</Text>
            <BagNameInput theme={theme} bagName={selectedBag?.bagName} setBagName={handleNameChange} />
            <BagColorPicker theme={theme} bagColor={selectedBag?.bagColor} onSelectColor={handleColorSelect} />
            <IsPrimaryInput theme={theme} isPrimary={isPrimary} setIsPrimary={setIsPrimary} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <Button title="Cancel" buttonStyle={{ backgroundColor: theme.colors.secondary }} onPress={() => handleEditBagClose()} />
              <Button title="Save" onPress={() => handleEditBagSubmit(selectedBag)} />
            </View>
          </View>
        </View>
      </Modal>
      )}

      {deleteModalVisible && (
      <Modal
        animationType="slide"
        transparent
        visible={deleteModalVisible}
        onRequestClose={() => handleDeleteBagClose()}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Bag</Text>
            <Text style={styles.mainBodyTitle}>You sure you want to delete this bag:</Text>
            <Text style={styles.mainBodyText}>{selectedBag?.bagName}</Text>
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              {getDiscsPayloadByBagId(selectedBag?.baboontype).length > 0
                && (<Text style={styles.mainBodyTitle}>Before deleting, you must move your discs to another bag, you baboon:</Text>)}
              {getDiscsPayloadByBagId(selectedBag?.baboontype).length > 0 && userBags.filter((bag) => bag.baboontype !== selectedBag?.baboontype).map((bag) => (
                <Button
                  key={bag.baboontype}
                  title={bag.bagName}
                  type="outline"
                  buttonStyle={{ borderColor: theme.colors.secondaryButton, borderWidth: 0.5 }}
                  containerStyle={{ marginVertical: 5 }}
                  titleStyle={{ color: theme.colors.secondaryButton }}
                  onPress={() => {
                    // Handle moving discs to this bag
                    sendDiscsToNewBag(bag.baboontype);
                  }}
                />
              ))}
            </View>
            {getDiscsPayloadByBagId(selectedBag?.baboontype).length > 0
              ? <Text style={styles.disclaimer}>You can&#39;t delete bag until you move these discs, you baboon</Text>
              : <Text style={styles.disclaimer}>You can not undo this, you baboon...</Text>}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <Button title="Cancel" buttonStyle={{ backgroundColor: theme.colors.secondary }} onPress={() => handleDeleteBagClose()} />
              <Button title="Delete" onPress={() => handleDeleteBag(selectedBag)} disabled={getDiscsPayloadByBagId(selectedBag?.baboontype).length > 0} />
            </View>
          </View>
        </ScrollView>
      </Modal>
      )}

    </>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    alignItems: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  mainBodyText: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 50,
    textAlign: 'center',
  },
  mainBodyTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    // alignItems: 'center',
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
