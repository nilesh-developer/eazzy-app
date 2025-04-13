import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ focused, color }) => focused ? <Ionicons name={'pricetag'} size={24} color={color} /> : <Ionicons name={'pricetag-outline'} size={24} color={color} />,
          headerStyle: {
            backgroundColor: '#1254e8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused, color }) => focused ? <Ionicons name={'archive'} size={24} color={color} /> : <Ionicons name={'archive-outline'} size={24} color={color} />,
          headerStyle: {
            backgroundColor: '#1254e8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Store',
          tabBarIcon: ({ focused, color }) => focused ? <Ionicons name={'storefront'} size={24} color={color} /> : <Ionicons name={'storefront-outline'} size={24} color={color} />,
          headerStyle: {
            backgroundColor: '#1254e8',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Tabs>
  );
}
