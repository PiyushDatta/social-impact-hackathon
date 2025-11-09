import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { ChatComponent } from '../../components/aiChatComponent';
import { useAuth } from '../../context/authContext';
import { styles } from '../../styles/mainScreenStyles';

export default function MainScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Doorwai!</Text>
      <Text style={styles.subtitle}>Hello, {user?.username}!</Text>
      {/* Chat Component */}
      <View style={styles.card}>
        <ChatComponent />
      </View>
      {/* Logout */}
      <Pressable style={styles.cardButton} onPress={handleLogout}>
        <Text style={styles.cardButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
}
