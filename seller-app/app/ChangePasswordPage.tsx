import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { UserContext } from '@/utils/UserContext';

const ChangePasswordPage = () => {
    const router = useRouter();
    const { user } = useContext(UserContext)
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword === confirmPassword) {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/update-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sellerId: user._id,
                        oldPassword: password,
                        newPassword,
                    }),
                });
                const responseData = await response.json();
                if (response.ok) {
                    Alert.alert("Success", responseData.message)
                    setPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                } else {
                    Alert.alert("Info", responseData.message)
                }
            } catch (error) {
                Alert.alert("Error", "Something went wrong while updating store")
                console.log(error)
            }
        } else {
            alert('Passwords do not match!');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen
                options={{
                    title: "Change Password",
                    headerTitleStyle: {
                        color: '#000000'
                    },
                }}
            />

            <View style={styles.inputRow}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Enter currect password'
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.inputRow}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder='Enter new password'
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.inputRow}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder='Enter new password to confirm'
                    placeholderTextColor="#888"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#ffffff"
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputRow: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 6,
        fontWeight: 'bold'
    },
    input: {
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: '#f0f0f0',
    },
    saveButton: {
        backgroundColor: '#1254e8',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: '600',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600',
    }
});

export default ChangePasswordPage;
