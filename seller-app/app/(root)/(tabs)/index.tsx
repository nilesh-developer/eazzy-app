import { UserContext } from '@/utils/UserContext';
import { router, Stack } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Share, Switch, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import openURLInBrowser from '@/utils/OpenUrlInBrowser';

function LogoTitle() {
  return (
    <Image style={styles.image} source={{ uri: 'https://res.cloudinary.com/dodtn64kw/image/upload/v1736403918/splash-icon_inw6g2.png' }} />
  );
}

export default function AppDashboard() {
  const [store, setStore] = useState(null)
  const [isOn, setIsOn] = useState(false); // State for toggle status
  const { user, isLoading, updateData } = useContext(UserContext);

  useEffect(() => {
    if (!isLoading) {
      setStore(user)
      setIsOn(user?.status)
    }
  }, [isLoading])

  const handleToggle = async () => {
    try {
      setIsOn(!isOn);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId: user._id,
          status: !isOn
        }),
      });

      if (response.ok) {
        setIsOn(!isOn);
        const responseData = await response.json();
        // Alert.alert("Success", responseData.message)
        // updateData()
      } else {
        Alert.alert("Error", "Something went wrong while updating status")
      }
    } catch (error) {
      console.log(error)
    }
  };

  const shareLink = async () => {
    const appUrl = 'https://play.google.com/store/apps/details?id=com.eazzy.app'; // Replace with your actual app URL

    try {
      const message = `Discover amazing deals on eazzy app! To visit my store, open the app and use the store code: *${user?.storename}*\n\nDownload the eazzy app now! \n${appUrl}`;
      const result = await Share.share({
        message: message,
        url: 'https://play.google.com/store/apps/details?id=com.eazzy.app', // Replace this with the link you want to share
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Link shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing link:', error);
    }
  };

  const handleCopyToClipboard = async (textToCopy) => {
    await Clipboard.setStringAsync(textToCopy); // Copies the text to clipboard
    Alert.alert('Copied to Clipboard', 'Store code copied successfully!'); // Feedback to user
  };

  if (isLoading && !store) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1254e8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{
        title: "Dashboard",
        headerTitle: props => <LogoTitle {...props} />,
      }} />
      <StatusBar style="auto" />
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{user?.storeTitle}</Text>
        <View style={styles.onlineStatus}>
          <Switch value={isOn} style={styles.switch} onValueChange={handleToggle} />
        </View>
      </View>

      {/* Share Store Link */}
      <View style={styles.storeLinkContainer}>
        <Text style={styles.linkText}>Share store code</Text>
        <Text style={styles.descriptionText}>
          Share this code with your customers so they can add your store in eazzy app and start placing orders.
        </Text>
        <Text style={styles.linkText}>Your store code: <Text onPress={(e) => handleCopyToClipboard(user?.storename)} style={styles.storeLink}>{user?.storename}</Text></Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qrButton} onPress={() => router.push("/QRCodeGeneratorScreen")}>
          <Text style={styles.shareButtonText}>View QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{store?.orders?.length}</Text>
          <Text style={styles.statLabel}>ORDERS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>₹{store?.sales}</Text>
          <Text style={styles.statLabel}>TOTAL SALES</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{store?.customers?.length}</Text>
          <Text style={styles.statLabel}>CUSTOMERS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{store?.products?.length}</Text>
          <Text style={styles.statLabel}>PRODUCTS</Text>
        </View>
      </View>

      {/* Store Info Section */}
      <View style={styles.storeContainer}>
        <Text style={styles.storeTitle}>Store</Text>
        <View style={styles.storeCard}>
          {store?.logo ?
            <Image
              source={{ uri: store?.logo }} // Replace with your actual logo path
              style={styles.storeLogo}
            />
            :
            null
          }
          <Text style={styles.storeName}>{store?.shopName}</Text>
          <Text style={styles.storeInfo}>{store?.products?.length} Products</Text>
          <View style={styles.storeActions}>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/CustomizeStorePage")}>
              <Text style={styles.buttonText}>Edit Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewStoreButton} onPress={() => router.push(`/seller/${store.storename}`)}>
              <Text style={styles.buttonText}>View Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Shortcuts */}
      {/* <View style={styles.shortcutsContainer}>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Product Reviews and Ratings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Promotional Designs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shortcutBox}>
          <Text style={styles.shortcutText}>Add Shortcut</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 25
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineStatus: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  onlineText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  storeLinkContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  linkText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#666',
    marginBottom: 8,
  },
  storeLink: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qrButton: {
    backgroundColor: '#1254e8',
    marginTop: 7,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#1254e8',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    marginTop: 8,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shortcutBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  shortcutText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  switch: {
    marginLeft: 10,
  },
  storeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: "#000"
  },
  storeCard: {
    alignItems: 'center',
  },
  storeLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  storeInfo: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  storeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#1254e8',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 10,
  },
  viewStoreButton: {
    backgroundColor: '#1254e8',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  image: {
    width: 130,
    height: 50,
  },
});

const ToggleButtonStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  toggleButton: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
  },
  on: {
    backgroundColor: '#4CAF50',
    borderColor: '#388E3C',
  },
  off: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
