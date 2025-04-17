import { User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const mockUsers: User[] = [
  {
    id: uuidv4(),
    name: 'Alex',
    age: 28,
    bio: 'Adventure seeker and coffee enthusiast. Let\'s explore the city together!',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Hiking', 'Photography', 'Coffee', 'Travel'],
    location: 'New York',
    distance: 5,
    compatibility: 85,
    lastActive: '10 minutes ago'
  },
  {
    id: uuidv4(),
    name: 'Jordan',
    age: 26,
    bio: 'Music lover and foodie. Always looking for the next concert or restaurant to try.',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Music', 'Food', 'Concerts', 'Cooking'],
    location: 'Brooklyn',
    distance: 8,
    compatibility: 78,
    lastActive: '1 hour ago'
  },
  {
    id: uuidv4(),
    name: 'Taylor',
    age: 30,
    bio: 'Tech enthusiast and bookworm. Let\'s talk about the latest gadgets or your favorite novel.',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Technology', 'Reading', 'Coding', 'Science Fiction'],
    location: 'Manhattan',
    distance: 3,
    compatibility: 92,
    lastActive: '30 minutes ago'
  },
  {
    id: uuidv4(),
    name: 'Morgan',
    age: 27,
    bio: 'Fitness junkie and nature lover. Always up for a workout or a hike.',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Fitness', 'Hiking', 'Yoga', 'Nutrition'],
    location: 'Queens',
    distance: 12,
    compatibility: 75,
    lastActive: '2 hours ago'
  },
  {
    id: uuidv4(),
    name: 'Riley',
    age: 29,
    bio: 'Art enthusiast and creative soul. Let\'s visit museums and talk about life.',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop'
    ],
    interests: ['Art', 'Museums', 'Philosophy', 'Drawing'],
    location: 'Bronx',
    distance: 15,
    compatibility: 88,
    lastActive: '5 hours ago'
  }
];