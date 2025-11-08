import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.offwhite,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  input: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: colors.tertiaryText,
  },
  clearButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    color: colors.tertiaryText,
  },
});
