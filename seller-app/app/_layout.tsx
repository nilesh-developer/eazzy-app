import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { UserProvider } from '@/utils/UserContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="AddProduct" options={{ headerShown: true, title: 'Add a New Product' }} />
          <Stack.Screen name="EditProduct/[productId]" options={{ headerShown: true, title: 'Update Product Details' }} />
          <Stack.Screen name="WelcomeScreen" options={{ headerShown: false }} />
          <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
          <Stack.Screen name="ForgetPasswordScreen" options={{ headerShown: false }} />
          <Stack.Screen name="QRCodeGeneratorScreen" options={{ headerShown: true, title: 'Store QR Code' }} />
          <Stack.Screen name="seller/[id]" options={{ headerShown: true, title: 'Store Preview' }} />
          <Stack.Screen name="OrderDetailsPage" />
          <Stack.Screen name="order/[orderId]" options={{ headerShown: true, title: 'Order details' }} />
          <Stack.Screen name="CustomizeStorePage" options={{ headerShown: true }} />
          <Stack.Screen name="CustomersPage" options={{ headerShown: true }} />
          <Stack.Screen name="ShopDetailsPage" options={{ headerShown: true }} />
          <Stack.Screen name="ChangePasswordPage" options={{ headerShown: true }} />
          <Stack.Screen name="AboutScreen" options={{ headerShown: true }} />
          <Stack.Screen name="SetDeliveryChargesPage" options={{ headerShown: true, title: 'Back' }} />
          <Stack.Screen name="NotifyCustomers" options={{ headerShown: true }} />
          <Stack.Screen name="DeliveryTimeSlotPage" options={{ headerShown: true }} />
          <Stack.Screen name="NoConnectionScreen" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </UserProvider>
    </ThemeProvider>
  );
}
