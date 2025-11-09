import * as SecureStore from 'expo-secure-store';

const isWeb = typeof window !== 'undefined';

export const SecureStoreWrapper = {
  getItemAsync: async (key: string) => {
    if (isWeb) {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  setItemAsync: async (key: string, value: string) => {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
};
