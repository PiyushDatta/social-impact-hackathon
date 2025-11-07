import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { styles } from '../styles/infoCardStyles';

export default function InfoCard() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable onPress={() => setIsChecked(!isChecked)} style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
        </Pressable>

        <Text style={styles.title}>SF home</Text>
      </View>

      <Text style={styles.description}>
        Compass Family Services provides the SF HOME program for families at risk of eviction who
        need support finding safe, permanent housing.
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Hours: </Text>
        <Text style={styles.value}>8:00 AM - 5:00 PM</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Contact: </Text>
        <Text style={styles.value}>415-644-0504</Text>
      </View>
    </View>
  );
}
