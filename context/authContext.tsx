import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { SecureStoreWrapper } from '../utils/secureStoreWrapper';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'doorwai_auth_token';
const USER_DATA_KEY = 'doorwai_user_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    // TODO(PiyushDatta): Replace with your actual Google Client IDs
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthSuccess(response.authentication);
    }
  }, [response]);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStoreWrapper.getItemAsync(AUTH_TOKEN_KEY);
      const userData = await SecureStoreWrapper.getItemAsync(USER_DATA_KEY);
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check hardcoded credentials
      if (
        username === process.env.EXPO_PUBLIC_DEFAULT_LOGIN_USER &&
        password === process.env.EXPO_PUBLIC_DEFAULT_LOGIN_PASS
      ) {
        const token = `token_${Date.now()}_${Math.random()}`;
        const userData = { username };
        await SecureStoreWrapper.setItemAsync(AUTH_TOKEN_KEY, token);
        await SecureStoreWrapper.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const msg = 'Not implemented yet: Google login will not work, use regular login';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Error', msg);
      // TODO(PiyushDatta): Implement Google login properly.
      // await promptAsync();
    } catch (error) {
      const msg = 'Something went wrong during Google login';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Error', msg);
      console.error('Google login error:', error);
    }
  };

  const handleGoogleAuthSuccess = async (authentication: any) => {
    try {
      // Fetch user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      });
      const userInfo = await userInfoResponse.json();
      const token = authentication.accessToken;
      const userData = { username: userInfo.email };
      await SecureStoreWrapper.setItemAsync(AUTH_TOKEN_KEY, token);
      await SecureStoreWrapper.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Error handling Google auth:', error);
    }
  };

  const logout = async () => {
    try {
      await SecureStoreWrapper.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStoreWrapper.deleteItemAsync(USER_DATA_KEY);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        loginWithGoogle,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
