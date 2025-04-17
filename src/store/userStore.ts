import { create } from 'zustand';
import { User, Match, Message, SwipeDirection } from '@/types';
import { mockUsers } from '@/data/mockUsers';
import { mockMatches } from '@/data/mockMatches';
import { mockMessages } from '@/data/mockMessages';
import { v4 as uuidv4 } from 'uuid';

interface UserState {
  currentUser: {
    id: string;
    name: string;
    images: string[];
    interests: string[];
  };
  potentialMatches: User[];
  matches: Match[];
  messages: Record<string, Message[]>;
  currentProfile: User | null;
  
  // Actions
  swipe: (direction: SwipeDirection, userId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markConversationAsRead: (conversationId: string) => void;
  getNextProfile: () => void;
  resetProfiles: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: {
    id: 'currentUser',
    name: 'You',
    images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop'],
    interests: ['Travel', 'Music', 'Food', 'Movies']
  },
  potentialMatches: [...mockUsers],
  matches: [...mockMatches],
  messages: { ...mockMessages },
  currentProfile: mockUsers.length > 0 ? mockUsers[0] : null,
  
  swipe: (direction: SwipeDirection, userId: string) => {
    const { potentialMatches } = get();
    
    // Remove the swiped profile from potential matches
    const updatedPotentialMatches = potentialMatches.filter(user => user.id !== userId);
    
    // If swiped right, create a match with some probability
    if (direction === 'right' && Math.random() > 0.3) {
      const matchedUser = potentialMatches.find(user => user.id === userId);
      if (matchedUser) {
        const conversationId = uuidv4();
        const newMatch: Match = {
          id: uuidv4(),
          userId: matchedUser.id,
          matchedAt: new Date().toISOString(),
          conversationId,
          unreadCount: 0
        };
        
        set(state => ({
          potentialMatches: updatedPotentialMatches,
          matches: [...state.matches, newMatch],
          messages: {
            ...state.messages,
            [conversationId]: []
          }
        }));
      }
    } else {
      set({ potentialMatches: updatedPotentialMatches });
    }
    
    // Get the next profile
    get().getNextProfile();
  },
  
  sendMessage: (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      conversationId,
      senderId: 'currentUser',
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    set(state => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          newMessage
        ]
      }
    }));
    
    // Simulate a response after a short delay
    setTimeout(() => {
      const match = get().matches.find(m => m.conversationId === conversationId);
      if (match) {
        const responseMessage: Message = {
          id: uuidv4(),
          conversationId,
          senderId: match.userId,
          content: ['Hi there!', 'Nice to meet you!', 'How are you doing?', 'That sounds great!'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString(),
          read: false
        };
        
        set(state => ({
          messages: {
            ...state.messages,
            [conversationId]: [
              ...(state.messages[conversationId] || []),
              responseMessage
            ]
          },
          matches: state.matches.map(m => 
            m.conversationId === conversationId 
              ? { ...m, unreadCount: m.unreadCount + 1 }
              : m
          )
        }));
      }
    }, 1000 + Math.random() * 2000);
  },
  
  markConversationAsRead: (conversationId: string) => {
    set(state => ({
      messages: {
        ...state.messages,
        [conversationId]: (state.messages[conversationId] || []).map(msg => 
          msg.senderId !== 'currentUser' && !msg.read 
            ? { ...msg, read: true }
            : msg
        )
      },
      matches: state.matches.map(m => 
        m.conversationId === conversationId 
          ? { ...m, unreadCount: 0 }
          : m
      )
    }));
  },
  
  getNextProfile: () => {
    const { potentialMatches } = get();
    set({ currentProfile: potentialMatches.length > 0 ? potentialMatches[0] : null });
  },
  
  resetProfiles: () => {
    set({ 
      potentialMatches: [...mockUsers],
      currentProfile: mockUsers.length > 0 ? mockUsers[0] : null
    });
  }
}));