// Import necessary modules
import { UserContext } from '@/utils/UserContext';
import { Stack } from 'expo-router';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';

const NotifyCustomers = () => {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const sendNotification = async () => {
        if (!title || !message) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/notification/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sellerId: user?._id,
                    title,
                    message
                }),
            });

            const result = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Notification sent successfully!');
                console.log("Notification sent successfully!")
                setTitle("")
                setMessage("")
            } else {
                console.log(result.message)
                Alert.alert('Info', result.message);
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            Alert.alert('Error', 'An unexpected error occurred.');
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: "Send Notification"
            }} />
            <Text style={styles.heading}>Send Notification To Your Customers</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                placeholderTextColor="#888"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Message"
                placeholderTextColor="#888"
                value={message}
                onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.button} onPress={sendNotification}>
                <Text style={styles.buttonText}>Send Notification</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center'
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#1254e8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default NotifyCustomers;
