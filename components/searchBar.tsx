import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../styles/searchBarStyles';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search conversations"
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="never"
      />

      {searchQuery.length > 0 && (
        <Pressable style={styles.clearButton} onPress={() => setSearchQuery('')}>
          <Text style={styles.clearButtonText}>×</Text>
        </Pressable>
      )}
    </View>
  );
}
