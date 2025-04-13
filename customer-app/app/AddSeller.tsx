import { UserContext } from '@/utils/UserContext';
import { router, Stack } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';

export default function App() {
    const { user, updateData } = useContext(UserContext)
    const [inputValue, setInputValue] = useState('');

    const handleAddPress = async () => {
        if (inputValue.trim() === "") {
            alert("Enter seller code")
            return
        }
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/customer/add-seller`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerCode: inputValue,
                    customerId: user._id
                }),
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', result.message);
                setInputValue('');
                updateData()
                router.push('/');
            } else {
                Alert.alert('Info', result.message);
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not send data to the server.');
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Add Store"
                }}
            />
            <View style={styles.content}>
                <Text style={styles.title}>Add Store</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter store code"
                    placeholderTextColor="#aaa"
                    value={inputValue}
                    onChangeText={setInputValue}
                />

                <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>OR</Text>
                </View>

                <TouchableOpacity style={styles.cameraButton} onPress={() =>  router.push("/QRCodeScannerScreen")}>
                    {/* <Image source={require("../assets/images/camera.png")} style={{height: 30, width: 30}} /> */}
                    <Text style={styles.cameraButtonText}>Scan QR Code</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7faf9', // Light neutral background for modern look
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4, // For Android shadow
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f3f3f3',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    addButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#1254e8', // Modern blue color for the button
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2E90FF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    addButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    cameraButton: {
        width: '100%',
        height: 60,
        backgroundColor: '#1254e8',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
