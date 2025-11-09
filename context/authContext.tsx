import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useServerApi } from '../hooks/useServerApi';
import { SecureStoreWrapper } from '../utils/secureStoreWrapper';

WebBrowser.maybeCompleteAuthSession();

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  photo?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'doorwai_auth_token';
const USER_DATA_KEY = 'doorwai_user_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Import addUser from useServerApi
  const { addUser } = useServerApi();

  // Configure Google Auth (id token flow)
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    // TODO(PiyushDatta): Implement these later.
    // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle Google Auth response (when promptAsync finishes)
  useEffect(() => {
    (async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        if (id_token) {
          await handleGoogleIdToken(id_token);
        }
      } else if (response?.type === 'error') {
        console.error('Google auth error:', response.error);
        const msg = 'Google authentication failed. Please try again.';
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Error', msg);
      }
    })();
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

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      if (!request) {
        const msg = 'Google auth is not ready yet. Please try again.';
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Error', msg);
        return false;
      }
      // Trigger Google OAuth flow (this opens the Google login)
      const result = await promptAsync();
      return result?.type === 'success';
    } catch (error) {
      const msg = 'Something went wrong during Google login';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Error', msg);
      console.error('Google login error:', error);
      return false;
    }
  };

  // Handler that processes the Google ID token
  const handleGoogleIdToken = async (idToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Decode the ID token to extract user information
      // The ID token is a JWT with three parts separated by dots
      const tokenParts = idToken.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid ID token format');
      }
      // Decode the payload (second part)
      const payload = JSON.parse(atob(tokenParts[1]));
      // Extract user profile from the token payload
      const userProfile: UserProfile = {
        uid: payload.sub, // Google user ID
        email: payload.email,
        name: payload.name,
        photo: payload.picture,
      };
      // Call backend to add/update user in database
      try {
        const result = await addUser(userProfile);
        console.log('User added to database:', result.isNewUser ? 'New user' : 'Existing user');
        // Use the profile returned from the server (in case it was updated)
        const serverProfile: UserProfile = {
          uid: result.profile.uid,
          email: result.profile.email,
          name: result.profile.name,
          photo: result.profile.photo,
        };
        // Save token and user data locally
        await SecureStoreWrapper.setItemAsync(AUTH_TOKEN_KEY, idToken);
        await SecureStoreWrapper.setItemAsync(USER_DATA_KEY, JSON.stringify(serverProfile));
        setIsAuthenticated(true);
        setUser(serverProfile);
      } catch (dbError) {
        console.error('Failed to add user to database:', dbError);
        // Continue with local auth even if database fails
        await SecureStoreWrapper.setItemAsync(AUTH_TOKEN_KEY, idToken);
        await SecureStoreWrapper.setItemAsync(USER_DATA_KEY, JSON.stringify(userProfile));
        setIsAuthenticated(true);
        setUser(userProfile);
        const msg = 'Logged in, but failed to sync with server. Some features may be limited.';
        if (Platform.OS === 'web') console.warn(msg);
        else Alert.alert('Warning', msg);
      }
      return true;
    } catch (error: any) {
      console.error('Error handling Google idToken:', error);
      const msg = error?.message || 'Authentication failed';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Error', msg);
      return false;
    } finally {
      setIsLoading(false);
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
