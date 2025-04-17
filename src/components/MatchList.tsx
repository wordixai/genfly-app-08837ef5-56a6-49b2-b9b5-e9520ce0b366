import { useUserStore } from '@/store/userStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockUsers } from '@/data/mockUsers';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function MatchList() {
  const { matches } = useUserStore();
  const navigate = useNavigate();
  
  // Sort matches by most recent first
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime()
  );
  
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">Your Matches</h2>
      
      {sortedMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No matches yet</p>
          <p className="text-sm text-muted-foreground">Keep swiping to find your match!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedMatches.map(match => {
            const user = mockUsers.find(u => u.id === match.userId);
            if (!user) return null;
            
            return (
              <div 
                key={match.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                onClick={() => navigate(`/chat/${match.conversationId}`)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.images[0]} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {match.unreadCount > 0 && (
                    <Badge 
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs"
                    >
                      {match.unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{user.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(match.matchedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {user.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}