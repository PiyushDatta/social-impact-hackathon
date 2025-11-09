import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  participants: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  summarySection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  messagesSection: {
    marginBottom: 24,
  },
  message: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0d5d1ff',
  },
  agentMessage: {
    backgroundColor: '#cfb8c5ff',
    marginLeft: 0,
    marginRight: 40,
  },
  userMessage: {
    backgroundColor: colors.lightOrange, //client
    marginLeft: 40,
    marginRight: 0,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  speaker: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50, // Account for status bar
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#482424',
    fontWeight: '500',
  },
});
