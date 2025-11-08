import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { transcripts } from '../data/transcriptData';
import { styles } from '../styles/transcriptDetailStyles';

export default function TranscriptDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const transcriptId = params.id as string;

  const transcript = transcripts.find(t => t.id === transcriptId);

  if (!transcript) {
    return (
      <View style={styles.container}>
        <Text>Transcript not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{transcript.title}</Text>
        <View style={styles.metadata}>
          <Text style={styles.status}>{transcript.status}</Text>
          <Text style={styles.duration}>{transcript.duration}</Text>
        </View>
        <Text style={styles.lastUpdated}>Last Updated: {transcript.lastUpdated}</Text>
        {transcript.participants && (
          <Text style={styles.participants}>
            Participants: {transcript.participants.join(', ')}
          </Text>
        )}
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summary}>{transcript.summary}</Text>
      </View>

      <View style={styles.messagesSection}>
        <Text style={styles.sectionTitle}>Full Transcript</Text>
        {transcript.messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.speaker === 'agent' && styles.agentMessage,
              message.speaker === 'user' && styles.userMessage,
            ]}
          >
            <View style={styles.messageHeader}>
              <Text style={styles.speaker}>
                {message.speaker === 'agent' ? '👤 Agent' : '🗣️ Client'}
              </Text>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
            </View>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
