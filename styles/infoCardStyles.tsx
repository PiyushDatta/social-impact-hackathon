import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondaryBG, // Keep this for individual cards
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#482424',
    marginBottom: 16,
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.darkGrey,
    backgroundColor: colors.secondaryBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primaryButton,
    borderColor: colors.primaryButton,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: colors.darkGrey,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGrey,
  },
  value: {
    fontSize: 14,
    color: colors.primaryText,
  },
  button: {
    width: '100%',
    backgroundColor: colors.primaryButton,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
