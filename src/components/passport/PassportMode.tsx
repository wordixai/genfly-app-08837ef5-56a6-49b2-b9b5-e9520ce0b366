import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/server/trpc/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Globe, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const popularDestinations = [
  { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
];

export function PassportMode() {
  const { t } = useTranslation();
  const { isPremium } = useAuth();
  const { toast } = useToast();
  
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);
  
  const [duration, setDuration] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  
  const passportMutation = trpc.passport.useMutation();
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY', // In a real app, use environment variable
  });
  
  const handleChangeLocation = async () => {
    if (!selectedLocation) {
      toast({
        title: t('error'),
        description: 'Please select a location',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const result = await passportMutation.mutateAsync({
        location: selectedLocation.name,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        duration,
      });
      
      if (result.success) {
        toast({
          title: t('passport.locationChanged', { location: selectedLocation.name }),
          variant: 'default',
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to change location',
        variant: 'destructive',
      });
    }
  };
  
  if (!isPremium) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('passport.title')}</CardTitle>
          <CardDescription>
            {t('passport.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Globe className="mx-auto h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            This is a premium feature. Upgrade to access Passport Mode.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            {t('premium.upgrade')}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('passport.title')}</CardTitle>
        <CardDescription>
          {t('passport.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={t('passport.searchLocation')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        {isLoaded && (
          <div className="h-64 w-full overflow-hidden rounded-md border">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={selectedLocation || { lat: 0, lng: 0 }}
              zoom={selectedLocation ? 10 : 2}
            >
              {selectedLocation && (
                <Marker position={selectedLocation} />
              )}
            </GoogleMap>
          </div>
        )}
        
        <div>
          <h3 className="mb-2 font-medium">{t('passport.popularDestinations')}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {popularDestinations.map((destination) => (
              <Button
                key={destination.name}
                variant="outline"
                className={`justify-start ${
                  selectedLocation?.name === destination.name ? 'border-primary bg-primary/10' : ''
                }`}
                onClick={() => setSelectedLocation(destination)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                <span className="truncate">{destination.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="mb-2 font-medium">{t('passport.duration')}</h3>
          <RadioGroup value={duration} onValueChange={(value) => setDuration(value as any)}>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day" id="day" />
                <Label htmlFor="day">{t('passport.day')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week">{t('passport.week')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month">{t('passport.month')}</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleChangeLocation}
          disabled={!selectedLocation || passportMutation.isLoading}
        >
          {passportMutation.isLoading ? (
            t('common.loading')
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              {t('passport.changeLocation')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}