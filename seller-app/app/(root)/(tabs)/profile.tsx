import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/utils/UserContext';
import { StatusBar } from 'expo-status-bar';

const StorefrontSettingsPage = () => {
  const { user, updateData, isLoading } = useContext(UserContext)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false)

  const handleLogout = async () => {
    // Logic for logging out (e.g., clearing authentication or navigating)
    await AsyncStorage.removeItem('token');
    alert('User logged out');
    router.push('/LoginScreen');
    // You can replace with navigation logic to go to a login screen
  };

  useEffect(() => {
    if (user) {
      setNotificationsEnabled(user?.appNotification)
      setEmailNotificationsEnabled(user?.emailNotification)
    }
  }, [isLoading])

  const handleAppNotification = async () => {
    try {
      setNotificationsEnabled(!notificationsEnabled)
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/app-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: user._id,
          status: !notificationsEnabled
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        setNotificationsEnabled(responseData.data.appNotification)
        // updateData()
      } else {
        Alert.alert("Error", responseData.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEmailNotification = async () => {
    try {
      setEmailNotificationsEnabled(!emailNotificationsEnabled)
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/email-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: user._id,
          status: !emailNotificationsEnabled
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        setEmailNotificationsEnabled(responseData.data.appNotification)
        // updateData()
      } else {
        Alert.alert("Error", responseData.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar backgroundColor="#1254e8" style="light" />
      {/* <Text style={styles.pageTitle}>Storefront Settings</Text> */}

      {/* Section: General Settings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>General</Text>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/CustomizeStorePage")}>
          <Feather name="settings" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Customize Store</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/CustomersPage")}>
          <Feather name="users" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Customers</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/ShopDetailsPage")}>
          <Feather name="home" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Shop Details</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/SetDeliveryChargesPage")}>
          <Feather name="box" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Set Delivery Charges</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/DeliveryTimeSlotPage")}>
          <Feather name="box" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Manage Delivery Time</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/ChangePasswordPage")}>
          <Feather name="settings" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Change Password</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
        </TouchableOpacity>
      </View>

      {/* Section: Notifications */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.optionRowToggle}>
          <Feather name="bell" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleAppNotification}
          />
        </View>

        <View style={styles.optionRow}>
          <Feather name="mail" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Enable Email Notifications</Text>
          <Switch
            value={emailNotificationsEnabled}
            onValueChange={handleEmailNotification}
          />
        </View>

        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/NotifyCustomers")}>
          <Feather name="message-square" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>Send Notification</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
        </TouchableOpacity>
      </View>


      {/* Section: Appearance Settings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.optionRow} onPress={() => router.push("/AboutScreen")}>
          <Feather name="alert-circle" size={24} color="#1254e8" style={styles.optionIcon} />
          <Text style={styles.optionText}>About</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="#1254e8" />
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

export default StorefrontSettingsPage;
