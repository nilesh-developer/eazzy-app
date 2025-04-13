import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Linking, ActivityIndicator } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Svg from 'react-native-svg';
import { captureRef } from "react-native-view-shot";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { UserContext } from "@/utils/UserContext";

const QRCodeGeneratorScreen = () => {
  const { user, isLoading } = useContext(UserContext);
  const qrRef = useRef<View>(null);
  const [qrData, setQrData] = useState("Store")
  const [storeName, setStoreName] = useState("Unknown Store")
  const [storeDetails, setStoreDetails] = useState("Scan to join this store")
  const [storeLogo, setStoreLogo] = useState("https://res.cloudinary.com/dodtn64kw/image/upload/v1736403918/splash-icon_inw6g2.png")
  const [status, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (user?.storename) {
      setQrData(user.storename);
      setStoreName(user?.shopName || "Unknown Store");
      setStoreLogo(user?.logo || "https://res.cloudinary.com/dodtn64kw/image/upload/v1736403918/splash-icon_inw6g2.png");
    }
  }, [user]);

  const onSaveImageAsync = async () => {
    try {
      if (status === null) {
        requestPermission();
      }
      const localUri = await captureRef(qrRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        Alert.alert("Info", "QR Code Saved!");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to save QR Code.");
      console.log(e);
    }
  };

  if (isLoading && !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>Your Store QR Code</Text>

      {/* Capturing QR + template */}
      <View ref={qrRef} collapsable={false}>
        <View style={styles.qrCard}>
          {/* Store Logo */}
          {storeLogo ?
            <Image source={{ uri: storeLogo }} style={styles.logo} />
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#1254e8" />
            </View>
          }
          {/* Store Name & Description */}
          <Text style={styles.storeName}>{storeName}</Text>
          <Text style={styles.details}>{storeDetails}</Text>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            {qrData ?
              <Svg style={{height: 180, width: 180}}>
                <QRCode value={qrData} size={180} />
              </Svg>
              :
              <View style={{ height: 180, width: 180, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1254e8" />
              </View>
            }
          </View>

          {/* Payment Instruction */}
          <Text style={styles.instructions} onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.eazzy.app")}>Scan via Eazzy app</Text>
        </View>
      </View>

      {/* Download Button */}
      <TouchableOpacity style={styles.button} onPress={onSaveImageAsync}>
        <Text style={styles.buttonText}>Download QR Code</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

// Beautiful Styles for Modern Design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  qrCard: {
    backgroundColor: "white",
    width: 280,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  instructions: {
    fontSize: 14,
    color: "#1254e8",
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#1254e8",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QRCodeGeneratorScreen;
