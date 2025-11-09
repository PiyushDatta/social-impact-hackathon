import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import ConversationCard from '../../components/conversationCard';
import FilterBar from '../../components/filterBar';
import SearchBar from '../../components/searchBar';
import { Transcript, useTranscripts } from '../../data/transcriptData';
import { gradients } from '../../styles/theme';
import { styles } from '../../styles/transcriptStyles';

interface Filters {
  status: 'All' | 'In Progress' | 'Completed';
}

export default function TranscriptPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({ status: 'All' });
  // Use the hook to fetch transcripts
  const { transcripts, loading } = useTranscripts();
  const filteredTranscripts = transcripts.filter(transcript => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || transcript.title.toLowerCase().includes(query);
    const matchesStatus = filters.status === 'All' || transcript.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const handleTranscriptPress = (transcript: Transcript) => {
    router.push(`/transcriptDetail?id=${transcript.id}`);
  };

  return (
    <LinearGradient
      colors={gradients.primary.colors}
      start={gradients.primary.start}
      end={gradients.primary.end}
      style={{ flex: 1 }}
    >
      <View style={styles.page}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FilterBar filters={filters} setFilters={setFilters} />
        <ScrollView contentContainerStyle={styles.container}>
          {loading ? (
            <Text style={styles.noResults}>Loading transcripts...</Text>
          ) : filteredTranscripts.length > 0 ? (
            filteredTranscripts.map(transcript => (
              <ConversationCard
                key={transcript.id}
                transcript={transcript}
                onPress={() => handleTranscriptPress(transcript)}
              />
            ))
          ) : (
            <Text style={styles.noResults}>
              No transcripts found. Try adjusting your search or filters!
            </Text>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}
