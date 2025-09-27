import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { CartProvider } from '../context/CartContext';
import { StudentProvider } from '../context/StudentContext';

export default function RootLayout() {
  return (
    <StudentProvider>
      <CartProvider>
        <Stack>
          {/* Tabs navigator lives in its own folder */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Other global screens */}
          <Stack.Screen name="cart" options={{ title: 'Cart' }} />
          <Stack.Screen name="menu" options={{ title: 'Menu' }} />
          <Stack.Screen name="OrderStatusScreen" options={{ title: 'Order Status' }} />
          <Stack.Screen name="AdminScreen" options={{ title: 'Admin Panel' }} />
          <Stack.Screen name="enter-student" options={{ title: 'Enter Student ID' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CartProvider>
    </StudentProvider>
  );
}
