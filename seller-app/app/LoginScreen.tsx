import { UserContext } from '@/utils/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button, Image } from 'react-native-elements';

const LoginScreen = () => {
    const { setUser, setIsLoading, updateData } = useContext(UserContext);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
        try {
            setLoading(true)
            const pushToken = await AsyncStorage.getItem('pushToken');
            console.log(pushToken)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, expoPushToken: pushToken }),
            });

            const result = await response.json();
            if (response.ok) {
                setUser(result.data)
                await AsyncStorage.setItem('token', result.token);
                Alert.alert('Success', result.message);
                updateData();
                router.push('/');
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
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <StatusBar backgroundColor='white' />
            <View style={styles.container}>
                <View style={styles.header}>
                    {/* <Text style={styles.logoText}>Eazzy Business</Text> */}
                    <Image style={styles.image} source={require("../assets/images/logo.png")} />
                </View>
                <Text style={styles.title}>Sign in to your Account</Text>
                <Text style={styles.subtitle}>Enter your email and password to log in</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry={true}
                        value={formData.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                    />
                    <TouchableOpacity onPress={() =>  router.push("/ForgetPasswordScreen")}>
                        <Text style={styles.forgotText}>Forgot Password</Text>
                    </TouchableOpacity>
                </View>

                {/* <Button
                    title="Log In"
                    buttonStyle={styles.loginButton}
                    titleStyle={styles.loginButtonText}
                    onPress={handleSubmit}
                /> */}

                <Button
                    title={loading ? "" : "Log In"} // Hide the text when loading
                    buttonStyle={styles.loginButton}
                    titleStyle={styles.loginButtonText}
                    onPress={handleSubmit}
                    disabled={loading} // Optionally disable the button while loading
                    icon={
                        loading && <ActivityIndicator size="small" color="#ffffff" />
                    }
                />

                <Text style={styles.signupText}>
                    Don’t have an account? <Text style={styles.signupLink} onPress={() => router.push("/SignUpScreen")}>Sign Up</Text>
                </Text>
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
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1254e8',
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
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    forgotText: {
        alignSelf: 'flex-end',
        fontSize: 16,
        color: '#1254e8',
        marginBottom: 20,
        fontWeight: 'bold'
    },
    loginButton: {
        backgroundColor: '#1254e8',
        borderRadius: 8,
        paddingVertical: 15,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginTop: 20,
    },
    signupLink: {
        color: '#1254e8',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
