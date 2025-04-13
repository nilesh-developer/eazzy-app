import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button, Image } from 'react-native-elements';

const ForgetPasswordScreen = () => {
    const [step, setStep] = useState(1); // Controls the step of the process
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSendOtp = async () => {
        try {
            setLoading(true);
            // API call to send OTP
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const result = await response.json();
            if (response.ok) {
                await AsyncStorage.setItem("otpToken", result.otp)
                Alert.alert('Success', result.message);
                setStep(2);
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not send OTP. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const otpToken = await AsyncStorage.getItem("otpToken")
            // API call to verify OTP
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, otpToken, otp: formData.otp }),
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', result.message);
                setStep(3);
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not verify OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            // API call to update password
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, password: formData.newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', result.message);
                router.push("/LoginScreen")
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image style={styles.image} source={require("../assets/images/logo.png")} />
                </View>
                <Text style={styles.title}>Forget Password</Text>

                {step === 1 && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                            placeholder="Enter your email"
                            placeholderTextColor="#888"
                            keyboardType="email-address"
                        />
                        <Button
                            title={loading ? "" : "Send OTP"}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                            onPress={handleSendOtp}
                            disabled={loading}
                            icon={loading && <ActivityIndicator size="small" color="#ffffff" />}
                        />
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={formData.otp}
                            onChangeText={(text) => handleInputChange('otp', text)}
                            placeholder="Enter OTP"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                        />
                        <Button
                            title={loading ? "" : "Verify OTP"}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                            icon={loading && <ActivityIndicator size="small" color="#ffffff" />}
                        />
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={formData.newPassword}
                            onChangeText={(text) => handleInputChange('newPassword', text)}
                            placeholder="New Password"
                            placeholderTextColor="#888"
                            secureTextEntry={true}
                        />
                        <TextInput
                            style={styles.input}
                            value={formData.confirmPassword}
                            onChangeText={(text) => handleInputChange('confirmPassword', text)}
                            placeholder="Confirm New Password"
                            placeholderTextColor="#888"
                            secureTextEntry={true}
                        />
                        <Button
                            title={loading ? "" : "Update Password"}
                            buttonStyle={styles.button}
                            titleStyle={styles.buttonText}
                            onPress={handleUpdatePassword}
                            disabled={loading}
                            icon={loading && <ActivityIndicator size="small" color="#ffffff" />}
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 120,
        height: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 10,
        marginTop: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1254e8',
        borderRadius: 8,
        paddingVertical: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ForgetPasswordScreen;