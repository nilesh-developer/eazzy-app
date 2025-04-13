import { router, Tabs } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import { Platform, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LogoTitle() {
  return (
    <Image style={styles.image} source={{ uri: 'https://res.cloudinary.com/dodtn64kw/image/upload/v1736401759/logo_pkxdeu.png' }} /> // uri for web: /assets/assets/images/logo.png
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1254e8',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => focused ? <Ionicons name={'home'} size={24} color={color} /> : <Ionicons name={'home-outline'} size={24} color={color} />,
          // headerShown: false,
          headerTitle: props => <LogoTitle {...props} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused,color }) => focused ? <Ionicons name={'archive'} size={24} color={color} /> : <Ionicons name={'archive-outline'} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ focused, color }) => focused ? <Ionicons name={'cart'} size={24} color={color} /> : <Ionicons name={'cart-outline'} size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused, color }) => focused ? <Ionicons name={'person-circle'} size={24} color={color} /> : <Ionicons name={'person-circle-outline'} size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  image: {
    width: 90,
    height: 30,
  },
})