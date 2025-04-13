import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(!!user)
    }, [user])

    useEffect(() => {
        const fetchUserFromAPI = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/current-user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData.data);
                    // await AsyncStorage.setItem('user', JSON.stringify(userData));

                    const pushToken = await AsyncStorage.getItem('pushToken');
                    const storeExpoToken = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/store-expo-token`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ sellerId: userData.data._id, expoPushToken: pushToken }),
                    })

                    if(storeExpoToken.ok){
                        console.log("Expo token stored")
                    }
        
                } else {
                    console.error('Failed to fetch user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserFromAPI();
    }, []);

    const saveUser = async (userData) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Failed to save user data', error);
        }
    };

    const updateData = async () => {
        try {
            setIsLoading(true)
            const token = await AsyncStorage.getItem('token');

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/seller/current-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData.data);
                // await AsyncStorage.setItem('user', JSON.stringify(userData));
            } else {
                console.error('Failed to fetch user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearUser = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('Failed to clear user data', error);
        }
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, user, setUser, saveUser, clearUser, isLoading, setIsLoading, updateData }}>
            {children}
        </UserContext.Provider>
    );
};
