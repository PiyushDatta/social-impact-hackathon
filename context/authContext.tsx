import { makeRedirectUri } from 'expo-auth-session';
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

interface ProfileData {
  userId: string;
  onboardingComplete?: boolean;
  createdAt?: number;
  updatedAt?: number;
  [key: string]: any;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  profileData: ProfileData | null;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfileData: (data: Partial<ProfileData>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'doorwai_auth_token';
const USER_DATA_KEY = 'doorwai_user_data';
const PROFILE_DATA_KEY = 'doorwai_profile_data';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addUser, updateProfile, getProfile } = useServerApi();

  // Construct redirect URI based on platform
  // For mobile in Expo Go, use Expo's auth proxy
  // For web, use the app scheme
  const redirectUri = Platform.select({
    web: makeRedirectUri({
      scheme: 'socialimpacthackathon',
    }),
    // Use Expo's auth proxy for mobile (works with Expo Go)
    default: 'https://auth.expo.io/@asyb/social-impact-hackathon',
  });

  // Log for debugging
  // console.log('Google Auth Redirect URI:', redirectUri);
  // console.log('Platform:', Platform.OS);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    // TODO(PiyushDatta): Uncomment these lines after verifying iOS and Android client IDs.
    // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
    redirectUri: redirectUri,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle Google Auth response with access token
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleAccessToken(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
      console.error('Error details:', JSON.stringify(response, null, 2));
      const msg = `Google authentication failed: ${response.error?.message || 'Unknown error'}`;
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Authentication Error', msg);
    } else if (response?.type === 'cancel') {
      console.log('User cancelled Google authentication');
    }
  }, [response]);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStoreWrapper.getItemAsync(AUTH_TOKEN_KEY);
      const userData = await SecureStoreWrapper.getItemAsync(USER_DATA_KEY);
      const storedProfileData = await SecureStoreWrapper.getItemAsync(PROFILE_DATA_KEY);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);

        if (storedProfileData) {
          setProfileData(JSON.parse(storedProfileData));
        }

        try {
          const freshProfile = await getProfile(parsedUser.uid);
          if (freshProfile) {
            setProfileData(freshProfile);
            await SecureStoreWrapper.setItemAsync(PROFILE_DATA_KEY, JSON.stringify(freshProfile));
          }
        } catch (error) {
          console.warn('Could not fetch fresh profile data:', error);
        }
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

  // Handler for access token - fetches user info from Google
  const handleGoogleAccessToken = async (accessToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Fetch user info from Google using access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info from Google');
      }
      const userInfo = await userInfoResponse.json();
      // Convert to UserProfile format
      const userProfile: UserProfile = {
        uid: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        photo: userInfo.picture,
      };
      // Call backend to add/update user in database
      try {
        const result = await addUser(userProfile);
        console.log('User added to database:', result.isNewUser ? 'New user' : 'Existing user');

        const serverProfile: UserProfile = {
          uid: result.profile.uid,
          email: result.profile.email,
          name: result.profile.name,
          photo: result.profile.photo,
        };

        if (result.profileData) {
          setProfileData(result.profileData);
          await SecureStoreWrapper.setItemAsync(
            PROFILE_DATA_KEY,
            JSON.stringify(result.profileData),
          );
        }

        await SecureStoreWrapper.setItemAsync(AUTH_TOKEN_KEY, accessToken);
        await SecureStoreWrapper.setItemAsync(USER_DATA_KEY, JSON.stringify(serverProfile));
        setIsAuthenticated(true);
        setUser(serverProfile);
      } catch (dbError) {
        console.error('Failed to add user to database:', dbError);
        // Continue with local auth even if database fails
        await SecureStoreWrapper.setItemAsync(AUTH_TOKEN_KEY, accessToken);
        await SecureStoreWrapper.setItemAsync(USER_DATA_KEY, JSON.stringify(userProfile));
        setIsAuthenticated(true);
        setUser(userProfile);
        const msg = 'Logged in, but failed to sync with server. Some features may be limited.';
        if (Platform.OS === 'web') console.warn(msg);
        else Alert.alert('Warning', msg);
      }
      return true;
    } catch (error: any) {
      console.error('Error handling Google access token:', error);
      const msg = error?.message || 'Authentication failed';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Error', msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileData = async (data: Partial<ProfileData>) => {
    if (!user) {
      throw new Error('User must be authenticated to update profile');
    }
    try {
      const updatedProfile = await updateProfile(user.uid, data);
      setProfileData(updatedProfile);
      await SecureStoreWrapper.setItemAsync(PROFILE_DATA_KEY, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating profile data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStoreWrapper.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStoreWrapper.deleteItemAsync(USER_DATA_KEY);
      await SecureStoreWrapper.deleteItemAsync(PROFILE_DATA_KEY);
      setIsAuthenticated(false);
      setUser(null);
      setProfileData(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        profileData,
        loginWithGoogle,
        logout,
        updateProfileData,
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
