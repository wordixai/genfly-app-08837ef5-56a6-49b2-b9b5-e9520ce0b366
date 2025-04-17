import { useUserStore } from '@/store/userStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, MapPin, Calendar, Heart } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, matches } = useUserStore();
  
  return (
    <div className="h-full overflow-auto p-4">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentUser.images[0]} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <h1 className="mt-4 text-2xl font-bold">{currentUser.name}</h1>
          <p className="text-muted-foreground">Premium Member</p>
          
          <Button className="mt-4" variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">About Me</h2>
            <p className="mt-2 text-muted-foreground">
              Passionate about exploring new places and meeting interesting people. 
              Love hiking, photography, and trying new foods.
            </p>
            
            <div className="mt-4 flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">New York, NY</span>
            </div>
            
            <div className="mt-2 flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Joined 6 months ago</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">My Interests</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {currentUser.interests.map(interest => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Stats</h2>
              <Badge variant="outline" className="bg-primary/10">
                Level 3
              </Badge>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{matches.length}</p>
                <p className="text-xs text-muted-foreground">Matches</p>
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Profile Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="flex items-center text-lg font-semibold">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              Dating Preferences
            </h2>
            
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-medium">Age Range</p>
                <p className="text-sm text-muted-foreground">25-35 years</p>
              </div>
              <div>
                <p className="font-medium">Distance</p>
                <p className="text-sm text-muted-foreground">Up to 25 miles</p>
              </div>
              <div>
                <p className="font-medium">Looking For</p>
                <p className="text-sm text-muted-foreground">Relationship, Casual</p>
              </div>
            </div>
            
            <Button className="mt-4 w-full" variant="outline">
              Edit Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}