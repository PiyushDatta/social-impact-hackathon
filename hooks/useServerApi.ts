import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { SecureStoreWrapper } from '../utils/secureStoreWrapper';

const SERVER_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://your-backend.example.com';
const CONVERSATION_IDS_KEY = 'my_device_conversation_ids_v1';
const CHAT_SESSION_KEY = 'chat_session_data_v1';

type CallResponse = {
  success: boolean;
  callId?: string;
  conversationId?: string;
  to?: string;
  [k: string]: any;
};

type TranscriptResponse = {
  conversationId: string;
  transcript: Array<{ role: string; message: string; timestamp?: string }>;
  metadata?: {
    startTime?: number;
    endTime?: number;
    duration?: number;
    agentId?: string;
  };
};

type ChatSessionResponse = {
  sessionId: string;
  userId: string;
};

type ChatMessageResponse = {
  reply: string;
};

type ChatSession = {
  userId: string;
  sessionId: string;
  createdAt: number;
};

type UserProfile = {
  uid: string;
  email: string;
  name: string;
  photo?: string;
  createdAt?: number;
};

type ProfileData = {
  userId: string;
  onboardingComplete?: boolean;
  createdAt?: number;
  updatedAt?: number;
  [key: string]: any;
};

type AddUserResponse = {
  success: boolean;
  isNewUser: boolean;
  profile: UserProfile;
  profileData?: ProfileData;
};

type UpdateProfileResponse = {
  success: boolean;
  message: string;
  profileData: ProfileData;
};

type GetProfileResponse = {
  success: boolean;
  profileData: ProfileData;
};

/**
 * Hook that manages server calls and local secure storage of conversation IDs for this device.
 */
export function useServerApi() {
  const [conversationIds, setConversationIds] = useState<string[]>([]);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);

  // Load saved IDs and chat session from SecureStoreWrapper on mount
  useEffect(() => {
    (async () => {
      await loadConversationIds();
      await loadChatSession();
    })();
  }, []);

  // ==================== Auth & Profile API ====================

  /**
   * Add or update a user in the database
   */
  const addUser = useCallback(
    async (profile: {
      uid: string;
      email: string;
      name: string;
      photo?: string;
    }): Promise<AddUserResponse> => {
      if (!profile.uid || !profile.email || !profile.name) {
        const msg = 'User profile must include uid, email, and name';
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Error', msg);
        throw new Error(msg);
      }
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/auth/add_user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data?.error || `Server error: ${res.status}`;
          if (Platform.OS === 'web') alert(errMsg);
          else Alert.alert('Error', errMsg);
          throw new Error(errMsg);
        }
        return data as AddUserResponse;
      } catch (err: any) {
        console.error('addUser error', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Update user profile data
   */
  const updateProfile = useCallback(
    async (userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> => {
      if (!userId) {
        const msg = 'userId is required';
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Error', msg);
        throw new Error(msg);
      }
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, profileData }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data?.error || `Server error: ${res.status}`;
          if (Platform.OS === 'web') alert(errMsg);
          else Alert.alert('Error', errMsg);
          throw new Error(errMsg);
        }
        return (data as UpdateProfileResponse).profileData;
      } catch (err: any) {
        console.error('updateProfile error', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Get user profile data
   */
  const getProfile = useCallback(async (userId: string): Promise<ProfileData | null> => {
    if (!userId) {
      throw new Error('userId is required');
    }
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/profile/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 404) {
        // Profile not found - return null
        return null;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = data?.error || `Server error: ${res.status}`;
        throw new Error(errMsg);
      }
      return (data as GetProfileResponse).profileData;
    } catch (err: any) {
      console.error('getProfile error', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== SecureStoreWrapper helpers ====================
  const loadConversationIds = useCallback(async () => {
    try {
      const raw = await SecureStoreWrapper.getItemAsync(CONVERSATION_IDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setConversationIds(parsed);
        else setConversationIds([]);
      } else {
        setConversationIds([]);
      }
    } catch (err) {
      console.error('Failed to load conversation ids from SecureStoreWrapper', err);
      setConversationIds([]);
    }
  }, []);

  const persistConversationIds = useCallback(async (ids: string[]) => {
    try {
      await SecureStoreWrapper.setItemAsync(CONVERSATION_IDS_KEY, JSON.stringify(ids));
      setConversationIds(ids);
    } catch (err) {
      console.error('Failed to save conversation ids to SecureStoreWrapper', err);
    }
  }, []);

  const addConversationId = useCallback(
    async (id: string) => {
      if (!id) return;
      const next = Array.from(new Set([...conversationIds, id]));
      await persistConversationIds(next);
    },
    [conversationIds, persistConversationIds],
  );

  const removeConversationId = useCallback(
    async (id: string) => {
      const filtered = conversationIds.filter(c => c !== id);
      await persistConversationIds(filtered);
    },
    [conversationIds, persistConversationIds],
  );

  // ==================== Chat Session Storage ====================
  const loadChatSession = useCallback(async () => {
    try {
      const raw = await SecureStoreWrapper.getItemAsync(CHAT_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatSession;
        setChatSession(parsed);
      } else {
        setChatSession(null);
      }
    } catch (err) {
      console.error('Failed to load chat session from SecureStoreWrapper', err);
      setChatSession(null);
    }
  }, []);

  const persistChatSession = useCallback(async (session: ChatSession | null) => {
    try {
      if (session) {
        await SecureStoreWrapper.setItemAsync(CHAT_SESSION_KEY, JSON.stringify(session));
      } else {
        await SecureStoreWrapper.deleteItemAsync(CHAT_SESSION_KEY);
      }
      setChatSession(session);
    } catch (err) {
      console.error('Failed to save chat session to SecureStoreWrapper', err);
    }
  }, []);

  // ==================== Call API (Voice) ====================

  const initiateCall = useCallback(
    async (phoneNumber: string): Promise<CallResponse> => {
      if (!phoneNumber) {
        const msg = 'Phone number is required';
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Error', msg);
        throw new Error(msg);
      }

      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/call`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data?.error || `Server error: ${res.status}`;
          if (Platform.OS === 'web') alert(errMsg);
          else Alert.alert('Error', errMsg);
          throw new Error(errMsg);
        }
        // Save conversationId locally if server returns it
        if (data?.conversationId) {
          await addConversationId(data.conversationId);
        }

        return data as CallResponse;
      } catch (err: any) {
        console.error('initiateCall error', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addConversationId],
  );

  const getTranscript = useCallback(async (conversationId: string): Promise<TranscriptResponse> => {
    if (!conversationId) throw new Error('conversationId is required');
    try {
      const res = await fetch(
        `${SERVER_URL}/conversation/${encodeURIComponent(conversationId)}/transcript`,
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = data?.error || `Server error: ${res.status}`;
        throw new Error(errMsg);
      }
      return data as TranscriptResponse;
    } catch (err) {
      console.error(`getTranscript(${conversationId}) error`, err);
      throw err;
    }
  }, []);

  const fetchAllConversationsFromServer = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/conversations`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = data?.error || `Server error: ${res.status}`;
        throw new Error(errMsg);
      }
      return data;
    } catch (err) {
      console.error('fetchAllConversationsFromServer error', err);
      throw err;
    }
  }, []);

  const listConversations = useCallback((): string[] => {
    return conversationIds.slice();
  }, [conversationIds]);

  const fetchSavedConversationDetails = useCallback(async () => {
    const ids = conversationIds.slice();
    const result: Array<{
      conversationId: string;
      transcript?: TranscriptResponse | null;
      error?: string;
    }> = [];
    await Promise.all(
      ids.map(async id => {
        try {
          const transcript = await getTranscript(id);
          result.push({ conversationId: id, transcript });
        } catch (err: any) {
          result.push({
            conversationId: id,
            transcript: null,
            error: err?.message || 'Failed to fetch',
          });
        }
      }),
    );

    return result;
  }, [conversationIds, getTranscript]);

  // ==================== Chat API (Text) ====================
  /**
   * Create or retrieve a chat session for the current user
   * If a session already exists locally, it will be reused
   */
  const createChatSession = useCallback(
    async (userId?: string): Promise<ChatSessionResponse> => {
      // If we already have a session, return it
      if (chatSession) {
        return {
          sessionId: chatSession.sessionId,
          userId: chatSession.userId,
        };
      }
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/chat/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data?.error || `Server error: ${res.status}`;
          if (Platform.OS === 'web') alert(errMsg);
          else Alert.alert('Error', errMsg);
          throw new Error(errMsg);
        }
        // Save session locally
        const newSession: ChatSession = {
          userId: data.userId,
          sessionId: data.sessionId,
          createdAt: Date.now(),
        };
        await persistChatSession(newSession);
        return data as ChatSessionResponse;
      } catch (err: any) {
        console.error('createChatSession error', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [chatSession, persistChatSession],
  );

  /**
   * Send a message to the chat agent
   * Automatically creates a session if one doesn't exist
   */
  const sendChatMessage = useCallback(
    async (message: string): Promise<ChatMessageResponse> => {
      if (!message || !message.trim()) {
        throw new Error('Message cannot be empty');
      }
      // Ensure we have a session
      let session = chatSession;
      if (!session) {
        const newSession = await createChatSession();
        session = {
          userId: newSession.userId,
          sessionId: newSession.sessionId,
          createdAt: Date.now(),
        };
      }
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.userId,
            sessionId: session.sessionId,
            message: message.trim(),
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data?.error || `Server error: ${res.status}`;
          if (Platform.OS === 'web') alert(errMsg);
          else Alert.alert('Error', errMsg);
          throw new Error(errMsg);
        }
        return data as ChatMessageResponse;
      } catch (err: any) {
        console.error('sendChatMessage error', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [chatSession, createChatSession],
  );

  /**
   * Clear the current chat session (start a new conversation)
   */
  const clearChatSession = useCallback(async () => {
    await persistChatSession(null);
  }, [persistChatSession]);

  // ==================== Expose methods + state ====================
  return {
    // State
    conversationIds,
    chatSession,
    loading,
    // Auth operations
    addUser,
    // Profile operations
    updateProfile,
    getProfile,
    // Voice call storage operations
    loadConversationIds,
    listConversations,
    addConversationId,
    removeConversationId,
    // Voice call server operations
    initiateCall,
    getTranscript,
    fetchAllConversationsFromServer,
    fetchSavedConversationDetails,
    // Chat operations
    createChatSession,
    sendChatMessage,
    clearChatSession,
    loadChatSession,
  };
}
