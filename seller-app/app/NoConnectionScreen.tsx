import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import * as Network from 'expo-network';  // Check network connectivity
import { router, Stack } from 'expo-router';

const NoConnectionScreen = () => {

    const checkConnection = async () => {
        const networkStatus = await Network.getNetworkStateAsync();
        if (networkStatus.isConnected) {
            router.push("/")
        }
        console.log(networkStatus.isConnected)
    };

    useEffect(() => {
        checkConnection()
    }, [])

    const handleReconnect = () => {
        checkConnection()
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Image
                source={require('../assets/images/no-internet.png')} // Use an appropriate image for the no connection state
                style={styles.image}
            />
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.message}>
                It looks like you're offline. Please check your internet connection.
            </Text>
            <Button
                title="Retry"
                onPress={handleReconnect}
                color="#1254e8"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        padding: 20,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default NoConnectionScreen;
