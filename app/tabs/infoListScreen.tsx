import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import InfoCard from '../../components/infoCard';
import { useElevenLabsCall } from '../../hooks/useElevenLabsCall';
import { styles } from '../../styles/infoCardStyles';

export default function InfoListScreen() {
  const { handleApiCall } = useElevenLabsCall();
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
    <View style={{ flex: 1, padding: 16 }}>
      <ScrollView>
        {cards.map(card => (
          <InfoCard key={card.id} id={card.id} title={card.title} onToggle={handleToggle} />
        ))}
      </ScrollView>

      <Pressable
        style={[styles.button, selectedCards.length === 0 && { opacity: 0.5 }]}
        disabled={selectedCards.length === 0}
        onPress={() => handleApiCall(defaultPhoneNumber)}
      >
        <Text style={styles.buttonText}>Have AI Call These Services</Text>
      </Pressable>
    </View>
  );
}
