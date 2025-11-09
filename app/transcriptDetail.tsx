import { gradients } from '@/styles/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useTranscripts } from '../data/transcriptData';
import { styles } from '../styles/transcriptDetailStyles';

export default function TranscriptDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const transcriptId = params.id as string;

  const { transcripts, loading } = useTranscripts();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading transcript...</Text>
      </View>
    );
  }

  const transcript = transcripts.find(t => t.id === transcriptId);

  if (!transcript) {
    return (
      <View style={styles.container}>
        <Text>Transcript not found</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradients.primary.colors} // orange → white
      start={gradients.primary.start} // top center
      end={gradients.primary.end} // bottom center
      style={{ flex: 1 }} // make gradient fill the full screen
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
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

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summary}>{transcript.summary}</Text>
        </View>

        {/* Messages Section */}
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
    </LinearGradient>
  );
}
