import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Image } from 'react-native-elements';

const SignupScreen = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        mobile: ''
    });
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            alert("Invalid email")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match. Please try again.")
            return
        }
        try {
            setLoading(true)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/customer/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData }),
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', result.message);
                router.push('/LoginScreen');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not send data to the server.');
        } finally {
            setLoading(false)
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <View style={styles.header}>
                <Image style={styles.image} source={require("../assets/images/logo.png")} />
            </View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Fill in the details below to register</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={true}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    secureTextEntry={true}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#888"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    placeholderTextColor="#888"
                    value={formData.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    placeholderTextColor="#888"
                    value={formData.city}
                    onChangeText={(text) => handleInputChange('city', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="State"
                    placeholderTextColor="#888"
                    value={formData.state}
                    onChangeText={(text) => handleInputChange('state', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Pin code"
                    placeholderTextColor="#888"
                    value={formData.pinCode}
                    onChangeText={(text) => handleInputChange('pinCode', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#888"
                    value={formData.mobile}
                    keyboardType="phone-pad"
                    onChangeText={(text) => handleInputChange('mobile', text)}
                />
            </View>

            {/* <Button
                    title="Sign Up"
                    buttonStyle={styles.signupButton}
                    titleStyle={styles.signupButtonText}
                    onPress={handleSubmit}
                /> */}

            <Button
                title={loading ? "" : "Sign Up"} // Hide the text when loading
                buttonStyle={styles.signupButton}
                titleStyle={styles.signupButtonText}
                onPress={handleSubmit}
                disabled={loading} // Optionally disable the button while loading
                icon={
                    loading && <ActivityIndicator size="small" color="#ffffff" />
                }
            />

            <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink} onPress={() => router.push("/LoginScreen")}>Log In</Text>
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        paddingBottom: 50
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 30
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: 100,
        height: 60,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1254e8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    signupButton: {
        backgroundColor: '#1254e8',
        borderRadius: 8,
        paddingVertical: 15,
    },
    signupButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginTop: 20,
    },
    loginLink: {
        color: '#1254e8',
        fontWeight: 'bold',
    },
});

export default SignupScreen;
