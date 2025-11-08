import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';

export const useElevenLabsCall = () => {
  const handleApiCall = useCallback(async (phoneNumber: string) => {
    try {
      if (!phoneNumber) {
        throw new Error('Phone number is required');
      }
      console.log('Making API call to backend server...');
      const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://your-cloud-run-url.run.app';
      const response = await fetch(`${BASE_URL}/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      console.log('Call response:', data);
      const successMessage = `Call initiated! Conversation ID: ${data.conversationId}`;
      if (Platform.OS === 'web') {
        alert(successMessage);
      } else {
        Alert.alert('Success', successMessage);
      }

    } catch (error) {
      console.error('API call failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'API call failed';
      if (Platform.OS === 'web') {
        alert(`Error: ${errorMessage}`);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  }, []);

  return { handleApiCall };
};
