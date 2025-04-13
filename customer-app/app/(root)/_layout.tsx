import { View, ActivityIndicator, Platform } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '@/utils/UserContext'
import { Redirect, Slot } from 'expo-router'
import * as Network from 'expo-network';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const Layout = () => {

    const { isLoggedIn, isLoading } = useContext(UserContext)
    const [loading, setLoading] = useState(true)

    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    const checkConnection = async () => {
        const networkStatus = await Network.getNetworkStateAsync();
        setLoading(false)
        if (!networkStatus.isConnected) return <Redirect href='/NoConnectionScreen' />
    };

    useEffect(() => {
        checkConnection()
    }, [])

    {/* Generate expo push token. Begin from here*/ }
    function handleRegistrationError(errorMessage: string) {
        console.log(errorMessage)
        console.log("Failed to get notification permission");
        throw new Error(errorMessage);
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            if (token) {
                console.log("Expo Push Token", token);
            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    async function registerForPushNotificationsAsync() {
        const networkStatus = await Network.getNetworkStateAsync();
        if (!networkStatus.isConnected) {
            return
        }
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                handleRegistrationError('Permission not granted to get push token for push notification!');
                return;
            }
            const projectId =
                Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                handleRegistrationError('Project ID not found');
            }
            try {
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(pushTokenString);
                await AsyncStorage.setItem('pushToken', pushTokenString);
                return pushTokenString;
            } catch (e: unknown) {
                handleRegistrationError(`${e}`);
            }
        } else {
            handleRegistrationError('Must use physical device for push notifications');
        }
    }
    {/* Generate expo push token. Ends here*/ }

    if (isLoading || loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1254e8" />
            </View>
        )
    }
    if (!isLoggedIn) return <Redirect href='/WelcomeScreen' />

    return <Slot />
}

export default Layout