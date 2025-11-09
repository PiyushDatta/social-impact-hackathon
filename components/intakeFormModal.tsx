import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/authContext';
import { styles } from '../styles/intakeFormStyles';
import { SecureStoreWrapper } from '../utils/secureStoreWrapper';

interface IntakeFormModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  nickName: string;
  pronouns: string;
  dateOfBirth: string;
  currentAge: string;
  phoneNumber: string;
  email: string;
  bestContact: string;
  voicemail: string;
  language: string;
  currentLivingSituation: string;
  sleepingLocation: string;
  partOfTown: string[];
  interestedServices: string[];
  receivedServicesLastYear: string;
  fosterCareInvolvement: string;
  dcfsSw: string;
  juvenileJusticeInvolvement: string;
  poName: string;
  localCollege: string;
  otherCollege: string;
  voucherConnection: string;
  connectedAgency: string;
  additionalInfo: string;
}

export default function IntakeFormModal({ visible, onClose }: IntakeFormModalProps) {
  const { user, profileData, updateProfileData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nickName: '',
    pronouns: '',
    dateOfBirth: '',
    currentAge: '',
    phoneNumber: '',
    email: '',
    bestContact: '',
    voicemail: '',
    language: '',
    currentLivingSituation: '',
    sleepingLocation: '',
    partOfTown: [],
    interestedServices: [],
    receivedServicesLastYear: '',
    fosterCareInvolvement: '',
    dcfsSw: '',
    juvenileJusticeInvolvement: '',
    poName: '',
    localCollege: '',
    otherCollege: '',
    voucherConnection: '',
    connectedAgency: '',
    additionalInfo: '',
  });

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    const loadData = async () => {
      // First, try to load from profile data (server)
      if (profileData?.intakeFormData) {
        setFormData(profileData.intakeFormData);
      } else {
        // Fall back to local storage
        const savedData = await SecureStoreWrapper.getItemAsync('intakeFormData');
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      }
      // Pre-fill user info if available
      if (user && !profileData?.intakeFormData) {
        setFormData(prev => ({
          ...prev,
          firstName: prev.firstName || user.name.split(' ')[0] || '',
          lastName: prev.lastName || user.name.split(' ').slice(1).join(' ') || '',
          email: prev.email || user.email || '',
        }));
      }
    };
    if (visible) loadData();
  }, [visible, user, profileData]);

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleCheckbox = (field: 'partOfTown' | 'interestedServices', value: string) => {
    setFormData(prev => {
      const arr = prev[field] || [];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...arr, value] };
    });
  };

  const generateEssentialData = (): string => {
    // Create a vCard format - opens in contacts/notes apps
    const name = `${formData.firstName} ${formData.lastName}`.trim() || formData.nickName;
    const services = formData.interestedServices.join('; ') || 'None selected';
    const location = formData.partOfTown.join('; ') || 'Not specified';

    // vCard 3.0 format - most compatible with phones
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
N:${formData.lastName};${formData.firstName};;;
NICKNAME:${formData.nickName}
BDAY:${formData.dateOfBirth.replace(/\//g, '-')}
TEL;TYPE=CELL:${formData.phoneNumber}
EMAIL:${formData.email}
NOTE:Services: ${services}\\nLiving: ${formData.currentLivingSituation}\\nLocation: ${location}\\nContact via: ${formData.bestContact}
END:VCARD`;

    return vCard;
  };

  const handleGenerateQR = async () => {
    try {
      // Save full data to secure storage
      await SecureStoreWrapper.setItemAsync('intakeFormData', JSON.stringify(formData));
      // Generate essential data for QR
      const essentialData = generateEssentialData();
      setQrData(essentialData);
      setShowQRCode(true);
      Alert.alert('QR Code Generated', 'You can now scan or copy the data below.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was an issue generating the QR code.');
    }
  };

  const handleCopyData = () => {
    Clipboard.setString(qrData);
    Alert.alert('Copied!', 'Form data has been copied to clipboard.');
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save your information.');
      return;
    }
    try {
      setIsSaving(true);
      // Save to local storage first
      await SecureStoreWrapper.setItemAsync('intakeFormData', JSON.stringify(formData));
      // Save to Firebase profile
      await updateProfileData({
        intakeFormData: formData,
        intakeFormCompleted: true,
        intakeFormLastUpdated: Date.now(),
      });
      Alert.alert('Success', 'Your information has been saved securely!');
      onClose();
    } catch (error) {
      console.error('Error saving intake form:', error);
      Alert.alert(
        'Error',
        'There was an issue saving to the server, but your data is saved locally.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.centeredContainer}>
          {/* Close Icon in top right */}
          <TouchableOpacity style={styles.closeIconContainer} onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.overlayContent}>
              <Text style={styles.title}>Global Intake Form</Text>

              {/* Personal Info */}
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#AAAAAA"
                value={formData.firstName}
                onChangeText={text => handleChange('firstName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#AAAAAA"
                value={formData.lastName}
                onChangeText={text => handleChange('lastName', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Nickname / Preferred Name"
                placeholderTextColor="#AAAAAA"
                value={formData.nickName}
                onChangeText={text => handleChange('nickName', text)}
              />

              <Text style={styles.label}>Pronouns</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.pronouns}
                  onValueChange={value => handleChange('pronouns', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select pronouns" value="" />
                  <Picker.Item label="she/her" value="she/her" />
                  <Picker.Item label="he/him" value="he/him" />
                  <Picker.Item label="they/them" value="they/them" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Date of Birth (MM/DD/YYYY)"
                placeholderTextColor="#AAAAAA"
                value={formData.dateOfBirth}
                onChangeText={text => handleChange('dateOfBirth', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Current Age"
                placeholderTextColor="#AAAAAA"
                value={formData.currentAge}
                onChangeText={text => handleChange('currentAge', text)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#AAAAAA"
                value={formData.phoneNumber}
                onChangeText={text => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#AAAAAA"
                value={formData.email}
                onChangeText={text => handleChange('email', text)}
                keyboardType="email-address"
              />

              <Text style={styles.label}>Best way to reach you</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.bestContact}
                  onValueChange={value => handleChange('bestContact', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select option" value="" />
                  <Picker.Item label="Call" value="call" />
                  <Picker.Item label="Text" value="text" />
                  <Picker.Item label="Email" value="email" />
                </Picker>
              </View>

              <Text style={styles.label}>Is it okay to leave a voicemail?</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.voicemail}
                  onValueChange={value => handleChange('voicemail', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select option" value="" />
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>

              <Text style={styles.label}>Language you are most comfortable with</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.language}
                  onValueChange={value => handleChange('language', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select language" value="" />
                  <Picker.Item label="English" value="english" />
                  <Picker.Item label="Spanish" value="spanish" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Current Living Situation"
                placeholderTextColor="#AAAAAA"
                value={formData.currentLivingSituation}
                onChangeText={text => handleChange('currentLivingSituation', text)}
                multiline
              />

              <TextInput
                style={styles.input}
                placeholder="Sleeping Location / Duration"
                placeholderTextColor="#AAAAAA"
                value={formData.sleepingLocation}
                onChangeText={text => handleChange('sleepingLocation', text)}
                multiline
              />

              <Text style={styles.label}>Part of town mostly stayed in this month</Text>
              <View style={styles.checkboxGrid}>
                {[
                  'West LA',
                  'San Fernando Valley',
                  'Antelope Valley',
                  'San Gabriel Valley',
                  'Central LA',
                  'DTLA',
                  'South LA',
                  'East LA',
                  'South Bay',
                  'In CA, outside LA',
                  'Out of CA',
                  'Unknown',
                  'Decline',
                ].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleCheckbox('partOfTown', option)}
                    style={[
                      styles.checkbox,
                      formData.partOfTown?.includes(option) && styles.checkedBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.checkboxText,
                        formData.partOfTown?.includes(option) && styles.checkedBoxText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Services you are interested in</Text>
              <View style={styles.checkboxGrid}>
                {[
                  'Essential Items',
                  'Shelter Resources',
                  'Case Management',
                  'Health & Wellness',
                  'Education',
                  'Employment',
                  'Pregnant & Parenting',
                ].map(option => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleCheckbox('interestedServices', option)}
                    style={[
                      styles.checkbox,
                      formData.interestedServices?.includes(option) && styles.checkedBox,
                    ]}
                  >
                    <Text
                      style={[
                        styles.checkboxText,
                        formData.interestedServices?.includes(option) && styles.checkedBoxText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* QR Code Display */}
              {showQRCode && (
                <View style={styles.qrContainer}>
                  <Text style={styles.qrTitle}>📱 Your Form QR Code</Text>
                  <View style={styles.qrCodeWrapper}>
                    <QRCode value={qrData} size={220} backgroundColor="white" />
                  </View>
                  <Text style={styles.qrInstructions}>Scan this code to save as contact</Text>

                  {/* Copy-Paste Section */}
                  <View style={styles.copySection}>
                    <Text style={styles.copyLabel}>Or copy the data:</Text>
                    <View style={styles.dataBox}>
                      <ScrollView style={{ maxHeight: 80 }}>
                        <Text style={styles.dataText}>{qrData}</Text>
                      </ScrollView>
                    </View>
                    <Pressable style={styles.copyButton} onPress={handleCopyData}>
                      <Text style={styles.buttonText}>📋 Copy to Clipboard</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.submitButton, isSaving && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Submit</Text>
                  )}
                </Pressable>

                <Pressable style={styles.generateQRButton} onPress={handleGenerateQR}>
                  <Text style={styles.generateQRText}>Generate QR Code</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
