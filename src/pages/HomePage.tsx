import { useUserStore } from '@/store/userStore';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function HomePage() {
  const { currentProfile, swipe, resetProfiles, potentialMatches } = useUserStore();
  
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="relative h-full w-full max-w-md">
        {currentProfile ? (
          <ProfileCard 
            user={currentProfile} 
            onSwipe={swipe} 
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h2 className="text-xl font-semibold">No more profiles</h2>
            <p className="mt-2 text-muted-foreground">
              You've gone through all available profiles.
            </p>
            <Button 
              className="mt-4"
              onClick={resetProfiles}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Profiles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}