import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';

const SavedAddressesScreen = () => {
  const [addresses, setAddresses] = useState([
    { id: '1', label: 'Home', address: '123 Main Street, City, Country' },
    { id: '2', label: 'Work', address: '456 Business Road, City, Country' },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const addAddress = () => {
    if (newLabel && newAddress) {
      const newAddressItem = {
        id: Date.now().toString(),
        label: newLabel,
        address: newAddress,
      };
      setAddresses([...addresses, newAddressItem]);
      setNewLabel('');
      setNewAddress('');
      setModalVisible(false);
    }
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressItem}>
      <Text style={styles.addressLabel}>{item.label}</Text>
      <Text style={styles.addressText}>{item.address}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Saved Addresses</Text>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Address</Text>
          <TextInput
            placeholder="Label (e.g., Home, Work)"
            style={styles.input}
            value={newLabel}
            onChangeText={setNewLabel}
          />
          <TextInput
            placeholder="Address"
            style={styles.input}
            value={newAddress}
            onChangeText={setNewAddress}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Add" onPress={addAddress} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addressItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  addressLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    color: '#555',
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SavedAddressesScreen;
