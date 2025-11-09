import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text } from 'react-native';
import { ChatComponent } from '../../components/aiChatComponent';
import { QuickLinks } from '../../components/quickLinks';
import { useAuth } from '../../context/authContext';
import { styles } from '../../styles/mainScreenStyles';
import { gradients } from '../../styles/theme';

export default function MainScreen() {
  const { user } = useAuth();
  return (
    <LinearGradient
      colors={gradients.primary.colors}
      start={gradients.primary.start}
      end={gradients.primary.end}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>What's on your mind today, {user?.name || 'there'}?</Text>
        <ChatComponent />
        <Text style={styles.h2}>Quick Actions</Text>
        <QuickLinks />
      </ScrollView>
    </LinearGradient>
  );
}
