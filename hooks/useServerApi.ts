import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { SecureStoreWrapper } from '../utils/secureStoreWrapper';

const SERVER_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://your-backend.example.com';
const CONVERSATION_IDS_KEY = 'my_device_conversation_ids_v1';

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

/**
 * Hook that manages server calls and local secure storage of conversation IDs for this device.
 */
export function useServerApi() {
  const [conversationIds, setConversationIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved IDs from SecureStoreWrapper on mount
  useEffect(() => {
    (async () => {
      await loadConversationIds();
    })();
  }, []);

  // SecureStoreWrapper helpers
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

  // Initiate a call (POST /call)
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

  // Get transcript for a conversation ID (GET /conversation/:conversationId/transcript)
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

  // Optionally fetch server-side list (not used for UI listing; provided for completeness)
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

  // listConversations returns only local IDs for this device
  const listConversations = useCallback((): string[] => {
    return conversationIds.slice(); // return copy
  }, [conversationIds]);

  // fetchSavedConversationDetails maps saved IDs -> transcript/metadata from server
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
          // If fetch fails, push null but keep the ID local
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

  // expose methods + state
  return {
    // State
    conversationIds,
    loading,
    // Storage operations
    loadConversationIds,
    listConversations,
    addConversationId,
    removeConversationId,
    // Server operations
    initiateCall,
    getTranscript,
    fetchAllConversationsFromServer,
    // Convenience
    fetchSavedConversationDetails,
  };
}
