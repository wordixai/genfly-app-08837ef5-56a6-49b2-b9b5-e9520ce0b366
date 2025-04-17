import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { v4 as uuidv4 } from 'uuid';
import { mockUsers } from '@/data/mockUsers';
import { mockMatches } from '@/data/mockMatches';
import { mockMessages } from '@/data/mockMessages';

// Create context type
export interface Context {
  user: {
    id: string;
    isAuthenticated: boolean;
    isPremium: boolean;
  } | null;
}

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

// Create router and procedure helpers
const router = t.router;
const publicProcedure = t.procedure;

// Middleware for authenticated routes
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.isAuthenticated) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Middleware for premium features
const isPremium = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.isPremium) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'This feature requires a premium subscription',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Create authenticated procedure
const protectedProcedure = publicProcedure.use(isAuthenticated);
const premiumProcedure = protectedProcedure.use(isPremium);

// Define schemas
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  bio: z.string(),
  images: z.array(z.string()),
  interests: z.array(z.string()),
  location: z.string(),
  distance: z.number(),
  compatibility: z.number(),
  lastActive: z.string(),
});

const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  timestamp: z.string(),
  read: z.boolean(),
});

const MatchSchema = z.object({
  id: z.string(),
  userId: z.string(),
  matchedAt: z.string(),
  conversationId: z.string(),
  unreadCount: z.number(),
});

// Define the router
export const appRouter = router({
  // Auth procedures
  auth: router({
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would create a user in the database
        return {
          success: true,
          userId: uuidv4(),
        };
      }),
    
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would validate credentials
        return {
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: 'currentUser',
            name: 'You',
            email: input.email,
            isPremium: false,
          },
        };
      }),
      
    verifyToken: publicProcedure
      .input(z.object({
        token: z.string(),
      }))
      .query(async ({ input }) => {
        // In a real app, this would verify the JWT
        return {
          valid: true,
          user: {
            id: 'currentUser',
            name: 'You',
            email: 'user@example.com',
            isPremium: false,
          },
        };
      }),
  }),
  
  // User procedures
  user: router({
    getProfile: protectedProcedure
      .query(async ({ ctx }) => {
        // In a real app, this would fetch from a database
        return {
          id: ctx.user.id,
          name: 'You',
          age: 28,
          bio: 'Passionate about exploring new places and meeting interesting people.',
          images: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop'],
          interests: ['Travel', 'Music', 'Food', 'Movies'],
          location: 'New York',
          isPremium: ctx.user.isPremium,
        };
      }),
      
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        interests: z.array(z.string()).optional(),
        images: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // In a real app, this would update the database
        return {
          success: true,
          profile: {
            id: ctx.user.id,
            name: input.name || 'You',
            bio: input.bio || 'Passionate about exploring new places and meeting interesting people.',
            interests: input.interests || ['Travel', 'Music', 'Food', 'Movies'],
            images: input.images || ['https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop'],
          },
        };
      }),
      
    updateLocation: protectedProcedure
      .input(z.object({
        latitude: z.number(),
        longitude: z.number(),
        locationName: z.string(),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would update the user's location
        return {
          success: true,
          location: input.locationName,
        };
      }),
  }),
  
  // Discovery procedures
  discovery: router({
    getPotentialMatches: protectedProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).default(10),
        filters: z.object({
          minAge: z.number().min(18).max(100).default(18),
          maxAge: z.number().min(18).max(100).default(50),
          maxDistance: z.number().min(1).max(100).default(50),
          interests: z.array(z.string()).optional(),
        }).optional(),
      }))
      .query(async ({ input }) => {
        // In a real app, this would query the database with filters
        return {
          profiles: mockUsers.slice(0, input.limit),
        };
      }),
      
    swipe: protectedProcedure
      .input(z.object({
        userId: z.string(),
        direction: z.enum(['left', 'right', 'up']),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would record the swipe and potentially create a match
        const isMatch = input.direction === 'right' && Math.random() > 0.3;
        
        return {
          success: true,
          isMatch,
          match: isMatch ? {
            id: uuidv4(),
            userId: input.userId,
            matchedAt: new Date().toISOString(),
            conversationId: uuidv4(),
          } : null,
        };
      }),
      
    resetSwipes: premiumProcedure
      .mutation(async () => {
        // Premium feature to reset daily swipes
        return {
          success: true,
          message: 'Your daily swipes have been reset',
        };
      }),
  }),
  
  // Matching procedures
  matches: router({
    getMatches: protectedProcedure
      .query(async () => {
        // In a real app, this would fetch from a database
        return {
          matches: mockMatches,
        };
      }),
      
    getMatch: protectedProcedure
      .input(z.object({
        matchId: z.string(),
      }))
      .query(async ({ input }) => {
        const match = mockMatches.find(m => m.id === input.matchId);
        if (!match) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Match not found',
          });
        }
        
        const user = mockUsers.find(u => u.id === match.userId);
        
        return {
          match,
          user,
        };
      }),
      
    unmatch: protectedProcedure
      .input(z.object({
        matchId: z.string(),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would remove the match from the database
        return {
          success: true,
        };
      }),
  }),
  
  // Messaging procedures
  messages: router({
    getConversations: protectedProcedure
      .query(async () => {
        // In a real app, this would fetch from a database
        const conversations = mockMatches.map(match => {
          const user = mockUsers.find(u => u.id === match.userId);
          const messages = mockMessages[match.conversationId] || [];
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
          
          return {
            id: match.conversationId,
            matchId: match.id,
            user: {
              id: user?.id,
              name: user?.name,
              image: user?.images[0],
            },
            lastMessage,
            unreadCount: match.unreadCount,
          };
        });
        
        return {
          conversations,
        };
      }),
      
    getMessages: protectedProcedure
      .input(z.object({
        conversationId: z.string(),
      }))
      .query(async ({ input }) => {
        // In a real app, this would fetch from a database
        return {
          messages: mockMessages[input.conversationId] || [],
        };
      }),
      
    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.string(),
        content: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // In a real app, this would save to the database
        const newMessage = {
          id: uuidv4(),
          conversationId: input.conversationId,
          senderId: ctx.user.id,
          content: input.content,
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        return {
          success: true,
          message: newMessage,
        };
      }),
      
    markAsRead: protectedProcedure
      .input(z.object({
        conversationId: z.string(),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would update the database
        return {
          success: true,
        };
      }),
  }),
  
  // Premium features
  premium: router({
    getSubscriptionPlans: publicProcedure
      .query(async () => {
        return {
          plans: [
            {
              id: 'basic',
              name: 'Basic',
              price: 9.99,
              features: [
                'Unlimited Swipes',
                'See Who Likes You',
                'Rewind Last Swipe',
              ],
              duration: 'month',
            },
            {
              id: 'plus',
              name: 'Plus',
              price: 19.99,
              features: [
                'All Basic Features',
                'Passport Mode',
                'Priority Matching',
                'No Advertisements',
              ],
              duration: 'month',
            },
            {
              id: 'premium',
              name: 'Premium',
              price: 29.99,
              features: [
                'All Plus Features',
                'Incognito Mode',
                'Read Receipts',
                'Advanced Filters',
              ],
              duration: 'month',
            },
          ],
        };
      }),
      
    createCheckoutSession: protectedProcedure
      .input(z.object({
        planId: z.string(),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would create a Stripe checkout session
        return {
          success: true,
          checkoutUrl: `https://checkout.stripe.com/mock-session-${input.planId}`,
        };
      }),
      
    verifySubscription: protectedProcedure
      .query(async ({ ctx }) => {
        // In a real app, this would check the subscription status
        return {
          isSubscribed: ctx.user.isPremium,
          plan: ctx.user.isPremium ? 'premium' : null,
          expiresAt: ctx.user.isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        };
      }),
  }),
  
  // Passport mode (location changing)
  passport: premiumProcedure
    .input(z.object({
      location: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      duration: z.enum(['day', 'week', 'month']).default('day'),
    }))
    .mutation(async ({ input }) => {
      // Premium feature to change virtual location
      return {
        success: true,
        message: `Your location has been changed to ${input.location} for the next ${input.duration}`,
        expiresAt: new Date(Date.now() + (input.duration === 'day' ? 1 : input.duration === 'week' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      };
    }),
    
  // Image recognition
  imageRecognition: router({
    analyzeImage: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would use a computer vision API
        return {
          success: true,
          isAppropriate: true,
          tags: ['person', 'outdoor', 'smile'],
          faceDetected: true,
        };
      }),
      
    moderateContent: protectedProcedure
      .input(z.object({
        content: z.string(),
      }))
      .mutation(async ({ input }) => {
        // In a real app, this would use a content moderation API
        const isSafe = !input.content.includes('inappropriate');
        
        return {
          success: true,
          isSafe,
          reason: isSafe ? null : 'Content may violate community guidelines',
        };
      }),
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;