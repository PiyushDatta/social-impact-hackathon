import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from '../../styles/profileStyles';

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <Pressable style={styles.settingItem}>
            <Text style={styles.settingText}>Edit Profile</Text>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <Text style={styles.settingText}>Notifications</Text>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy</Text>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <Text style={styles.settingText}>Help & Support</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
