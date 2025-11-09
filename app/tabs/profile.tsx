import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import IntakeFormModal from '../../components/intakeFormModal';
import { useAuth } from '../../context/authContext';
import { styles } from '../../styles/profileStyles';
import { gradients } from '../../styles/theme';

const DEFAULT_AVATAR = require('../../assets/images/default-avatar.png');

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  // Get initials from user name
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
            <Image
              // TODO(PiyushDatta): Enable user profile pictures after implementing upload.
              // source={user?.photo ? { uri: user.photo } : DEFAULT_AVATAR}
              source={DEFAULT_AVATAR}
              style={styles.avatarImage}
            />
            <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
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
