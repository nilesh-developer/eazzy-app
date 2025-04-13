import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { UserProvider } from '@/utils/UserContext';
import { CartProvider } from '@/utils/CartContext';

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
        <CartProvider>
          <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="(root)" options={{ headerShown: false }} />
            <Stack.Screen name="WelcomeScreen" options={{ headerShown: false }} />
            <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" options={{ headerShown: false }} />
            <Stack.Screen name="ForgetPasswordScreen" options={{ headerShown: false }} />
            <Stack.Screen name="AddSeller" options={{ headerShown: true }} />
            <Stack.Screen name="QRCodeScannerScreen" options={{ headerShown: true, title: 'Scan Store QR Code' }} />
            <Stack.Screen name="seller/[id]" options={{ headerShown: true, title: "Shop"}}/>
            <Stack.Screen name="product/[id]" options={{ headerShown: true, title: "Product"}}/>
            <Stack.Screen name="cart/[id]" options={{ headerShown: true,  title: "Cart"}} /> {/* Cart page for easy navigation for customer with back arrow */}
            <Stack.Screen name="AccountPage" options={{ headerShown: true }} />
            <Stack.Screen name="checkout/[id]" options={{ headerShown: true, title: "Checkout" }} />
            <Stack.Screen name="order/[orderId]" options={{ headerShown: true, title: "Order details"}} />
            <Stack.Screen name="Addresses" options={{ headerShown: true }} />
            <Stack.Screen name="OrderDetailsPage" options={{ headerShown: true }} />
            <Stack.Screen name="CustomersPage" options={{ headerShown: true }} />
            <Stack.Screen name="ChangePasswordPage" options={{ headerShown: true }} />
            <Stack.Screen name="NoConnectionScreen" options={{ headerShown: false }} />
            <Stack.Screen name="notify" /> {/* For notification test purpose */}
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
