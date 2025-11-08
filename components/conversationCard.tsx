import { Pressable, Text, View } from 'react-native';
import { Transcript } from '../data/transcriptData';
import { styles } from '../styles/conversationCardStyles';

interface ConversationCardProps {
  transcript: Transcript;
  onPress?: () => void;
}

export default function ConversationCard({ transcript, onPress }: ConversationCardProps) {
  const { title, status, summary } = transcript;
  const dotColor = status === 'In Progress' ? '#C6C5A3' : '#A3C6B8';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <Text style={styles.summary}>{summary.slice(0, 100)}...</Text>
    </Pressable>
  );
}
