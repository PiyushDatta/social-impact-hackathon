import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/authContext';
import { styles } from '../styles/indexStyles';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/tabs/mainScreen');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
