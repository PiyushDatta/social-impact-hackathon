import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fbf4f3ff', //card bg
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
    marginTop: 60,
    marginLeft: 120, //padding
    marginRight: 120,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  noResults: {
    marginRight: 12,
    marginTop: 2,
  },
  overlay: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.darkGrey,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayTitle: {
    backgroundColor: colors.primaryButton,
    borderColor: colors.primaryButton,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryText,
    flex: 1,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#cc2626ff',
    lineHeight: 20,
    marginBottom: 12,
  },
  closeButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
