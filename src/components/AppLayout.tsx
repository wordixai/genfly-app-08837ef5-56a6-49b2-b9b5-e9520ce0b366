import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { matches } = useUserStore();
  
  const totalUnreadCount = matches.reduce((sum, match) => sum + match.unreadCount, 0);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      
      <nav className="border-t bg-background">
        <div className="flex items-center justify-around p-2">
          <Button
            variant={isActive('/') ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => navigate('/')}
          >
            <Home size={24} />
          </Button>
          
          <Button
            variant={isActive('/matches') || isActive('/chat') ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-full relative"
            onClick={() => navigate('/matches')}
          >
            <MessageSquare size={24} />
            {totalUnreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {totalUnreadCount}
              </span>
            )}
          </Button>
          
          <Button
            variant={isActive('/profile') ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => navigate('/profile')}
          >
            <User size={24} />
          </Button>
          
          <Button
            variant={isActive('/settings') ? 'default' : 'ghost'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => navigate('/settings')}
          >
            <Settings size={24} />
          </Button>
        </div>
      </nav>
    </div>
  );
}