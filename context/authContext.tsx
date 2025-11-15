import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { useServerApi } from '../hooks/useServerApi';
import { SecureStoreWrapper } from '../utils/secureStoreWrapper';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  profileData: any;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<ProfileData>) => Promise<void>;
}

interface ProfileData {
  userId: string;
  onboardingComplete?: boolean;
  createdAt?: number;
  updatedAt?: number;
  [key: string]: any; // Allow any additional profile fields
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = 'auth_user';
const PROFILE_KEY = 'auth_profile';
const PROFILE_DATA_KEY = 'doorwai_profile_data';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Import API functions from useServerApi
  const { addUser, updateProfile, getProfile } = useServerApi();

  const router = useRouter();
  const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;

  // Track whether user pressed login button (only then we poll)
  const shouldPollRef = useRef(false);

  // ------------------------------------------
  // INITIAL LOAD
  // ------------------------------------------
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedUser = await SecureStoreWrapper.getItemAsync(USER_KEY);
        const savedProfile = await SecureStoreWrapper.getItemAsync(PROFILE_KEY);

        if (savedUser && savedProfile) {
          setUser(JSON.parse(savedUser));
          setProfileData(JSON.parse(savedProfile));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn('Initial auth restore failed:', err);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // ------------------------------------------
  // POLLING AUTH RESULT (ONLY AFTER LOGIN)
  // ------------------------------------------
  async function pollForAuthSuccess() {
    console.log('Starting polling for auth success...');
    const maxAttempts = 20;
    const delay = 1000;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res = await fetch(`${backendURL}/auth/get-auth`);
        const text = await res.text();

        let json = null;
        try {
          json = JSON.parse(text);
        } catch {
          console.log('Response was not JSON');
        }

        if (json?.ready && json?.data?.user && json?.data?.profile) {
          console.log('Auth detected!');

          const userData = json.data.user;
          const profileData = json.data.profile;

          await SecureStoreWrapper.setItemAsync(USER_KEY, JSON.stringify(userData));
          await SecureStoreWrapper.setItemAsync(PROFILE_KEY, JSON.stringify(profileData));

          setUser(userData);
          setProfileData(profileData);
          setIsAuthenticated(true);

          shouldPollRef.current = false;
          router.replace('/tabs/mainScreen');
          return true;
        }
      } catch (err) {
        console.warn('Polling error:', err);
      }

      await new Promise(r => setTimeout(r, delay));
    }

    // Polling timeout ONLY if user initiated login
    if (shouldPollRef.current) {
      Alert.alert('Login Timeout', 'We could not detect your login. Try again.');
      shouldPollRef.current = false;
    }

    return false;
  }

  // ------------------------------------------
  // FOREGROUND RESUME (ONLY POLL IF LOGIN PRESSED)
  // ------------------------------------------
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active' && shouldPollRef.current) {
        console.log('App resumed → continue polling...');
        pollForAuthSuccess();
      }
    });

    return () => sub.remove();
  }, []);

  // ------------------------------------------
  // LOGIN WITH GOOGLE
  // ------------------------------------------
  async function loginWithGoogle() {
    try {
      setIsLoading(true);
      shouldPollRef.current = true;

      const urlResponse = await fetch(`${backendURL}/auth/google/url`);
      const { authUrl } = await urlResponse.json();

      console.log('Opening Google OAuth...');
      const result = await WebBrowser.openBrowserAsync(authUrl);
      console.log('Browser closed or returned result:', result);

      // MOBILE
      if (result.type === 'dismiss') {
        console.log('Detected popup close on mobile → starting poll');
        await pollForAuthSuccess();
        return;
      }

      // WEB
      if (result.type === 'opened') {
        console.log('Web detected → waiting for user to return to the tab...');

        const handleFocus = () => {
          console.log('User returned → starting poll');
          window.removeEventListener('focus', handleFocus);
          pollForAuthSuccess();
        };

        window.addEventListener('focus', handleFocus);
        return;
      }
      console.log('Unhandled WebBrowser result:', result);
    } catch (err: any) {
      console.error('Login error:', err);
      Alert.alert('Login failed', err.message || 'Try again');
      shouldPollRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }
  // ------------------------------------------
  // LOGOUT
  // ------------------------------------------
  async function logout() {
    try {
      await SecureStoreWrapper.deleteItemAsync(USER_KEY);
      await SecureStoreWrapper.deleteItemAsync(PROFILE_KEY);

      setUser(null);
      setProfileData(null);
      setIsAuthenticated(false);

      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  const updateProfileData = async (data: Partial<ProfileData>) => {
    if (!user) {
      throw new Error('User must be authenticated to update profile');
    }
    try {
      // Update profile on server
      const updatedProfile = await updateProfile(user.uid, data);
      // Update local state
      setProfileData(updatedProfile);
      // Update local storage
      await SecureStoreWrapper.setItemAsync(PROFILE_DATA_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating profile data:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        profileData,
        loginWithGoogle,
        logout,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
