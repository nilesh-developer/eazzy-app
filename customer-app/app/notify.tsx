import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
            if (token) {
                Alert.alert("Expo Push Token", token);
            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
            <Text>Your expo push token: {expoPushToken || 'Fetching token...'}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification?.request?.content?.title} </Text>
                <Text>Body: {notification?.request?.content?.body}</Text>
                <Text>Data: {JSON.stringify(notification?.request?.content?.data)}</Text>
            </View>
            <Button
                title="Press to send a notification"
                onPress={async () => {
                    await sendPushNotification(expoPushToken);
                }}
            />
        </View>
    );
}

async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Test Notification',
        body: 'This is a test notification',
        data: { test: 'data' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
