import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { UserContext } from "@/utils/UserContext";

const QRCodeScannerScreen = () => {
  const { user, updateData } = useContext(UserContext)
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Request camera permissions on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Handle the scanned QR code
  const handleScan = async ({ data }) => {
    if (!scanned) {
      setScanned(true);
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/customer/add-seller`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sellerCode: data,
            customerId: user._id
          }),
        });

        const result = await response.json();
        if (response.ok) {
          Alert.alert('Success', result.message);
          updateData()
          router.push('/');
        } else {
          Alert.alert('Info', result.message);
        }

      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Could not send data to the server.');
      }
      // Alert.alert("QR Code Scanned", `Data: ${data}`, [
      //   { text: "OK", onPress: () => setScanned(false) },
      // ]);
    }
  };

  // If permission hasn't been granted
  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (!permission.granted) {
    return <Text>Camera access denied. Please enable it in settings.</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      >
        {/* Overlay Box */}
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>Align QR code within the frame</Text>
        </View>
      </CameraView>

      {/* Back Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// **Modern UI Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QRCodeScannerScreen;
