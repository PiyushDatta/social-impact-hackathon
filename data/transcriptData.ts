// data/transcriptData.ts
import { useEffect, useState } from 'react';
import { useServerApi } from '../hooks/useServerApi';

export interface Message {
  id: string;
  speaker: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
}

export interface Transcript {
  id: string;
  title: string;
  status: 'In Progress' | 'Completed';
  lastUpdated: string;
  summary: string;
  messages: Message[];
  duration?: string;
  participants?: string[];
}

// Static fallback data (only used if fetch fails)
export const transcripts: Transcript[] = [
  {
    id: '1',
    title: 'Outgoing call to SF Homes',
    status: 'In Progress',
    lastUpdated: '2025-11-06',
    summary: 'Began conversation to set up a meeting with SF Homes',
    duration: '12:34',
    participants: ['Agent Sarah', 'SF Homes Representative'],
    messages: [
      {
        id: 'm1',
        speaker: 'agent',
        text: 'Hello, this is Sarah calling from housing services. Is this SF Homes?',
        timestamp: '10:23 AM',
      },
      {
        id: 'm2',
        speaker: 'user',
        text: 'Yes, this is John from SF Homes. How can I help you?',
        timestamp: '10:23 AM',
      },
      {
        id: 'm3',
        speaker: 'agent',
        text: 'I wanted to schedule a meeting to discuss emergency housing options for our clients.',
        timestamp: '10:24 AM',
      },
    ],
  },
  {
    id: '2',
    title: 'Emergency food vouchers',
    status: 'Completed',
    lastUpdated: '2025-11-04',
    summary: 'Reaching out to discuss attaining emergency food vouchers',
    duration: '8:12',
    participants: ['Agent Mike', 'Client Maria'],
    messages: [
      {
        id: 'm1',
        speaker: 'agent',
        text: 'Hi Maria, thanks for calling. I understand you need emergency food assistance?',
        timestamp: '2:15 PM',
      },
      {
        id: 'm2',
        speaker: 'user',
        text: 'Yes, I have two children and we ran out of food this week.',
        timestamp: '2:15 PM',
      },
    ],
  },
  {
    id: '3',
    title: 'Questions about clothing donations',
    status: 'In Progress',
    lastUpdated: '2025-11-04',
    summary: 'Requested what clothing donations was available',
    duration: '8:12',
    participants: ['Agent Mike', 'Client Maria'],
    messages: [
      {
        id: 'm1',
        speaker: 'agent',
        text: 'Hi Maria, thanks for calling. I understand you need emergency food assistance?',
        timestamp: '2:15 PM',
      },
      {
        id: 'm2',
        speaker: 'user',
        text: 'Yes, I have two children and we ran out of food this week.',
        timestamp: '2:15 PM',
      },
    ],
  },
  {
    id: '4',
    title: 'Community garden information',
    status: 'Completed',
    lastUpdated: '2025-11-04',
    summary:
      'Participants provided feedback on the new navigation layout. Further interviews scheduled for next week.',
    duration: '8:12',
    participants: ['Agent Mike', 'Client Maria'],
    messages: [
      {
        id: 'm1',
        speaker: 'agent',
        text: 'Hi Maria, thanks for calling. I understand you need emergency food assistance?',
        timestamp: '2:15 PM',
      },
      {
        id: 'm2',
        speaker: 'user',
        text: 'Yes, I have two children and we ran out of food this week.',
        timestamp: '2:15 PM',
      },
    ],
  },
  {
    id: '5',
    title: 'Looking for medicat equipment',
    status: 'In Progress',
    lastUpdated: '2025-11-04',
    summary:
      'Participants provided feedback on the new navigation layout. Further interviews scheduled for next week.',
    duration: '8:12',
    participants: ['Agent Mike', 'Client Maria'],
    messages: [
      {
        id: 'm1',
        speaker: 'agent',
        text: 'Hi Maria, thanks for calling. I understand you need emergency food assistance?',
        timestamp: '2:15 PM',
      },
      {
        id: 'm2',
        speaker: 'user',
        text: 'Yes, I have two children and we ran out of food this week.',
        timestamp: '2:15 PM',
      },
    ],
  },
];

/**
 * Hook to dynamically fetch transcripts only for this device.
 * Returns transcripts array and loading state.
 */
export function useTranscripts() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { fetchSavedConversationDetails } = useServerApi();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const details = await fetchSavedConversationDetails();
        const mapped: Transcript[] = details
          .map(d => {
            const t = d.transcript;
            if (!t) return null;
            const messages: Message[] = (t.transcript || []).map((m, idx) => ({
              id: `m${idx + 1}`,
              speaker: m.role as 'user' | 'agent' | 'system',
              text: m.message,
              timestamp: m.timestamp || '',
            }));
            return {
              id: t.conversationId,
              title: `Conversation ${t.conversationId}`,
              status: 'Completed',
              lastUpdated: t.metadata?.endTime
                ? new Date(t.metadata.endTime * 1000).toISOString().split('T')[0]
                : '',
              summary: messages[0]?.text || '',
              messages,
              duration: t.metadata?.duration
                ? `${Math.floor(t.metadata.duration / 60)}:${t.metadata.duration % 60}`
                : undefined,
              participants: [],
            };
          })
          .filter(Boolean) as Transcript[];

        setTranscripts(mapped);
      } catch (err) {
        console.error('Failed to fetch device transcripts', err);
        setTranscripts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchSavedConversationDetails]);

  return { transcripts, loading };
}
