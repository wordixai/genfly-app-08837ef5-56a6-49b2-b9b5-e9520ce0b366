import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trpc } from '@/server/trpc/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function PremiumPlans() {
  const { t } = useTranslation();
  const { isPremium } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const { data: plansData, isLoading } = trpc.premium.getSubscriptionPlans.useQuery();
  const createCheckoutMutation = trpc.premium.createCheckoutSession.useMutation();
  
  const handleSubscribe = async (planId: string) => {
    try {
      const result = await createCheckoutMutation.mutateAsync({ planId });
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Failed to create checkout session',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-8">{t('common.loading')}</div>;
  }
  
  if (isPremium) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Crown className="mr-2 h-5 w-5 text-yellow-500" />
            <CardTitle>{t('premium.currentPlan')}</CardTitle>
          </div>
          <CardDescription>
            {t('premium.expiresOn', { date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4">
              <h3 className="font-medium">Premium</h3>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Unlimited Swipes</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>See Who Likes You</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Passport Mode</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  <span>Advanced Filters</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {t('premium.managePlan')}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('premium.upgrade')}</h2>
        <p className="text-muted-foreground">{t('premium.features')}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {plansData?.plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all ${selectedPlan === plan.id ? 'border-primary ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.id === 'premium' && (
              <div className="absolute right-0 top-0">
                <Badge className="rounded-bl-lg rounded-tr-lg bg-primary">
                  <Star className="mr-1 h-3 w-3" /> Popular
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-xl font-bold">${plan.price}</span> / {t(`premium.perMonth`)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.id === 'premium' ? 'default' : 'outline'}
                onClick={() => handleSubscribe(plan.id)}
              >
                {t('premium.subscribe')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}