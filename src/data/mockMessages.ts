import { Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { mockMatches } from './mockMatches';

export const mockMessages: Record<string, Message[]> = {};

// Generate mock messages for each match
mockMatches.forEach(match => {
  const messages: Message[] = [];
  const messageCount = Math.floor(Math.random() * 10) + 3;
  
  for (let i = 0; i < messageCount; i++) {
    const isUserMessage = Math.random() > 0.5;
    const timestamp = new Date(Date.now() - (messageCount - i) * 3600000).toISOString();
    
    messages.push({
      id: uuidv4(),
      conversationId: match.conversationId,
      senderId: isUserMessage ? 'currentUser' : match.userId,
      content: isUserMessage 
        ? ['Hey there!', 'How are you?', 'What are you up to?', 'Want to grab coffee sometime?'][Math.floor(Math.random() * 4)]
        : ['Hi!', 'I\'m good, how about you?', 'Just finished work, you?', 'Coffee sounds great!'][Math.floor(Math.random() * 4)],
      timestamp,
      read: i < messageCount - (match.unreadCount || 0)
    });
  }
  
  mockMessages[match.conversationId] = messages;
});