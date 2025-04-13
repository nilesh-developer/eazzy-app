import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import * as Network from 'expo-network';  // Check network connectivity

export default function WelcomeScreen() {

  const checkConnection = async () => {
    const networkStatus = await Network.getNetworkStateAsync();
    if (!networkStatus.isConnected) {
      router.push("/NoConnectionScreen")
    }
  };
  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerShown: false
      }} />
      <View style={styles.logoContainer}>
        {/* <Text style={styles.logoText}>Eazzy Business</Text> */}
        <Image style={styles.image} source={require("../assets/images/logo.png")} />
      </View>
      <Text style={styles.description}>Your Favorite Stores, Just a Tap Away.</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/LoginScreen")}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/SignUpScreen")}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center' },
  logoText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  description: { fontSize: 14, fontWeight: "bold", color: '#000', marginBottom: 20, textAlign: 'center' },
  button: { backgroundColor: '#1254e8', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  image: {
    width: 260,
    height: 120,
  },
  link: { color: '#fff', fontSize: 14, textDecorationLine: 'underline' },
});
