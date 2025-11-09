import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useServerApi } from '../hooks/useServerApi';
import { styles } from '../styles/aiChatComponentStyles';
import { gradients } from '../styles/theme';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export function ChatComponent() {
  const { sendChatMessage, clearChatSession, chatSession, loading } = useServerApi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await sendChatMessage(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to send message'}`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleNewChat = async () => {
    await clearChatSession();
    setMessages([]);
  };

  return (
    <LinearGradient
      colors={gradients.primary.colors} // orange → white
      start={gradients.primary.start} // top center
      end={gradients.primary.end} // bottom center
      style={{ flex: 1 }} // fill the entire screen
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {chatSession && (
            <Pressable style={styles.newChatButton} onPress={handleNewChat}>
              <Text style={styles.newChatButtonText}>New Chat</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Our Door’s Always Open</Text>
            </View>
          )}

          {messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userText : styles.assistantText,
                ]}
              >
                {message.content}
              </Text>
            </View>
          ))}

          {isSending && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <ActivityIndicator size="small" color="#666" />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything, i'm here to helps"
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={!isSending && !loading}
            onSubmitEditing={handleSend}
          />
          <Pressable
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
