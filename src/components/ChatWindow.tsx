import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers } from '@/data/mockUsers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Send } from 'lucide-react';

export function ChatWindow() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { messages, matches, sendMessage, markConversationAsRead } = useUserStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const match = matches.find(m => m.conversationId === conversationId);
  const user = match ? mockUsers.find(u => u.id === match.userId) : null;
  const conversationMessages = conversationId ? messages[conversationId] || [] : [];
  
  // Mark messages as read when viewing the conversation
  useEffect(() => {
    if (conversationId) {
      markConversationAsRead(conversationId);
    }
  }, [conversationId, markConversationAsRead]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() && conversationId) {
      sendMessage(conversationId, newMessage.trim());
      setNewMessage('');
    }
  };
  
  if (!user || !match) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Conversation not found</p>
      </div>
    );
  }
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate('/matches')}
        >
          <ArrowLeft size={20} />
        </Button>
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.images[0]} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="ml-3">
          <h2 className="font-medium">{user.name}</h2>
          <p className="text-xs text-muted-foreground">
            {user.lastActive}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              You matched with {user.name} {formatDistanceToNow(new Date(match.matchedAt), { addSuffix: true })}
            </div>
          </div>
          
          {conversationMessages.map(message => {
            const isCurrentUser = message.senderId === 'currentUser';
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={user.images[0]} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p>{message.content}</p>
                  <div className={`mt-1 text-right text-xs ${
                    isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                  }`}>
                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}