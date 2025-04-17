import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Bell, Shield, Eye, Globe, Moon, LogOut } from 'lucide-react';

export default function SettingsPage() {
  const [distanceRange, setDistanceRange] = useState([25]);
  const [ageRange, setAgeRange] = useState([25, 35]);
  
  return (
    <div className="h-full overflow-auto p-4">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">New Matches</p>
                <p className="text-sm text-muted-foreground">Get notified when you match with someone</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Messages</p>
                <p className="text-sm text-muted-foreground">Get notified when you receive a message</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">App Updates</p>
                <p className="text-sm text-muted-foreground">Get notified about app updates</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Distance</p>
                <p className="text-sm text-muted-foreground">Show your distance on your profile</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Age</p>
                <p className="text-sm text-muted-foreground">Show your age on your profile</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Incognito Mode</p>
                <p className="text-sm text-muted-foreground">Only show your profile to people you've liked</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              Discovery Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">Maximum Distance</p>
                <p className="text-sm font-medium">{distanceRange[0]} miles</p>
              </div>
              <Slider
                value={distanceRange}
                onValueChange={setDistanceRange}
                max={100}
                step={1}
              />
            </div>
            
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium">Age Range</p>
                <p className="text-sm font-medium">{ageRange[0]}-{ageRange[1]}</p>
              </div>
              <Slider
                value={ageRange}
                onValueChange={setAgeRange}
                max={60}
                min={18}
                step={1}
              />
            </div>
            
            <div>
              <p className="mb-2 font-medium">Show Me</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Women</Button>
                <Button variant="outline" className="flex-1">Men</Button>
                <Button variant="default" className="flex-1">Everyone</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark mode</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autoplay Videos</p>
                <p className="text-sm text-muted-foreground">Automatically play videos</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Separator />
        
        <div className="space-y-4">
          <Button variant="outline" className="w-full">
            Help & Support
          </Button>
          
          <Button variant="outline" className="w-full">
            Privacy Policy
          </Button>
          
          <Button variant="outline" className="w-full">
            Terms of Service
          </Button>
          
          <Button variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}