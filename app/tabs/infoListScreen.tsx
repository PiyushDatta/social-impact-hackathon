import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import InfoCard from '../../components/infoCard';
import { useServerApi } from '../../hooks/useServerApi';
import { styles } from '../../styles/infoCardStyles';
import { gradients } from '../../styles/theme';

export default function InfoListScreen() {
  const { initiateCall } = useServerApi();
  const defaultPhoneNumber = process.env.EXPO_PUBLIC_DEFAULT_PHONE_NUMBER!;

  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const handleToggle = (id: string, checked: boolean) => {
    setSelectedCards(prev => (checked ? [...prev, id] : prev.filter(cardId => cardId !== id)));
  };

  const cards = [
    { id: '1', title: 'SF Home' },
    { id: '2', title: 'Youth Services' },
    { id: '3', title: 'Job Support' },
  ];

  return (
    <LinearGradient
      colors={gradients.primary.colors}
      start={gradients.primary.start}
      end={gradients.primary.end}
      style={{ flex: 1 }} // Changed from styles.card
    >
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.pageTitle}>Safety & Shelter Resources</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {cards.map(card => (
            <InfoCard key={card.id} id={card.id} title={card.title} onToggle={handleToggle} />
          ))}
        </ScrollView>

        <Pressable
          style={[styles.button, selectedCards.length === 0 && { opacity: 0.5 }]}
          disabled={selectedCards.length === 0}
          onPress={() => initiateCall(defaultPhoneNumber)}
        >
          <Text style={styles.buttonText}>Have AI Call These Services</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}
