import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/authContext';
import { styles } from '../styles/loginStyles';
import { gradients } from '../styles/theme';

export default function Login() {
  const { loginWithGoogle, isLoading: authLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const handleGoogleLogin = async () => {
    if (localLoading || authLoading) return;
    try {
      setLocalLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);
      const msg = err.message || 'Google authentication failed. Please try again.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Error', msg);
    } finally {
      setLocalLoading(false);
    }
  };
  const loading = localLoading || authLoading;

  return (
    <LinearGradient
      colors={gradients.primary.colors}
      start={gradients.primary.start}
      end={gradients.primary.end}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Doorwai</Text>
        <View style={styles.form}>
          <Pressable
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#4285F4" />
            ) : (
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            )}
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
