import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../styles/intakeFormStyles';

interface IntakeFormModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function IntakeFormModal({ visible, onClose }: IntakeFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    pronouns: '',
    dateOfBirth: '',
  });

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlayContainer}>
        <View style={styles.overlayContent}>
          <Text style={styles.title}>Global Intake Form</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Pronouns"
            value={formData.pronouns}
            onChangeText={text => handleChange('pronouns', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            value={formData.dateOfBirth}
            onChangeText={text => handleChange('dateOfBirth', text)}
          />

          <View style={styles.buttonRow}>
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
