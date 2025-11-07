import { Pressable, ScrollView, Text, View } from 'react-native';
import { useElevenLabsCall } from '../../hooks/useElevenLabsCall';
import { styles } from '../../styles/mainScreenStyles';

export default function MainScreen() {
  const { handleApiCall } = useElevenLabsCall();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Main Screen</Text>
        <View style={styles.card}>
          <Pressable style={styles.cardButton} onPress={handleApiCall}>
            <Text style={styles.cardButtonText}>CALL MYSELF</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
