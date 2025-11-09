import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import IntakeFormModal from '../../components/intakeFormModal';
import { styles } from '../../styles/profileStyles';
import { gradients } from '../../styles/theme';

export default function Profile() {
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogout = () => router.replace('/login');
  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <LinearGradient
      colors={gradients.primary.colors}
      start={gradients.primary.start}
      end={gradients.primary.end}
      style={{ flex: 1 }}
    >
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

            <Pressable style={styles.globalButton} onPress={toggleModal}>
              <Text style={styles.globalButtonText}>Global Intake Form</Text>
            </Pressable>

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
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

        {/* Modal Component */}
        <IntakeFormModal visible={isModalVisible} onClose={toggleModal} />
      </ScrollView>
    </LinearGradient>
  );
}
