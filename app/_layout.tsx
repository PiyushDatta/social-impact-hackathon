import { Stack } from 'expo-router';
import { AuthProvider } from '../context/authContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="tabs" />
      </Stack>
    </AuthProvider>
  );
}
