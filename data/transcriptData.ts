// data/transcriptData.ts
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
