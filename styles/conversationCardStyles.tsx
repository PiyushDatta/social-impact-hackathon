import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dotInProgress: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B59F3B',
    marginRight: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B59F3B',
    marginRight: 6,
  },
  dotCompleted: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3bb53dff',
    marginRight: 6,
  },
  inProgress: {
    backgroundColor: '#C6C5A3',
  },
  ongoing: {
    backgroundColor: '#A3C6B8',
  },
  completed: {
    backgroundColor: '#b3c6a3ff',
  },
  summary: {
    marginTop: 8,
    color: '#555',
    fontSize: 14,
  },
});
