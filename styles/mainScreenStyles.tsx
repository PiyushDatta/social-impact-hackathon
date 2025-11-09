import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.tertiaryText,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.primaryBg,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.tertiaryText,
  },
  cardButton: {
    backgroundColor: colors.primaryButton,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cardButtonText: {
    color: colors.secondaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});
