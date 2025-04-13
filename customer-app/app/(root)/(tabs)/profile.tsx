import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/utils/UserContext';
import { StatusBar } from 'expo-status-bar';

const profile = () => {
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    // Logic for logging out (e.g., clearing authentication or navigating)
    await AsyncStorage.removeItem('customerToken');
    alert('User logged out');
    router.push('/LoginScreen');
    // You can replace with navigation logic to go to a login screen
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* <Text style={styles.pageTitle}>Your Account</Text> */}
      <Text style={styles.customerName}>Hello {user?.name},</Text>
      {/* Section: General Settings */}
      <View style={styles.sectionContainer}>
        {/* <Text style={styles.sectionTitle}>General</Text> */}

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/AccountPage")}>
          <Feather name="user" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Profile</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/orders")}>
          <Feather name="box" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Orders</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/Addresses")}>
          <Feather name="map-pin" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Saved Addresses</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/ChangePasswordPage")}>
          <Feather name="settings" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Change Password</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },
  contentContainer: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  optionRowToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 12,
    backgroundColor: '#FF4D4F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default profile;
