import { Match } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { mockUsers } from './mockUsers';

export const mockMatches: Match[] = mockUsers.slice(0, 3).map(user => ({
  id: uuidv4(),
  userId: user.id,
  matchedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  conversationId: uuidv4(),
  unreadCount: Math.floor(Math.random() * 5)
}));