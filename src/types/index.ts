export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  interests: string[];
  location: string;
  distance: number;
  compatibility: number;
  lastActive: string;
}

export interface Match {
  id: string;
  userId: string;
  matchedAt: string;
  conversationId: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
}

export type SwipeDirection = 'left' | 'right' | 'up';