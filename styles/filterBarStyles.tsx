import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  activeButton: {
    backgroundColor: colors.primaryButton,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeText: {
    fontWeight: '600',
    color: '#fff',
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.primaryText,
  },
});
