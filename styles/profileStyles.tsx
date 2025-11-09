import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 200, //padding
    marginRight: 200,
    paddingTop: 80,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fbf4f3ff',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fbf4f3ff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  section: {
    backgroundColor: '#fbf4f3ff',
    borderRadius: 12,
    padding: 40,
    marginBottom: 20,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },
  settingText: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  logoutText: {
    color: '#545497',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  globalButton: {
    backgroundColor: colors.primaryButton,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  globalButtonText: {
    color: colors.secondaryText,
    fontSize: 16,
    fontWeight: '600',
  },
});
