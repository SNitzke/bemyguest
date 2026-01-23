import React, { useState } from 'react';
import { Check, Sparkles, Building2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STRIPE_PLANS, PlanId } from '@/config/stripe';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PricingCardsProps {
  onSelectPlan?: (planId: PlanId) => void;
  showCurrentPlan?: boolean;
}

const planIcons: Record<PlanId, React.ReactNode> = {
  basic: <Building2 className="h-6 w-6" />,
  pro: <Sparkles className="h-6 w-6" />,
  premium: <Crown className="h-6 w-6" />,
};

export const PricingCards: React.FC<PricingCardsProps> = ({ 
  onSelectPlan,
  showCurrentPlan = true 
}) => {
  const { user, profile } = useAuth();
  const { subscribed, planName, openCheckout, isLoading } = useSubscription();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const handleSelectPlan = async (planId: PlanId) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
      return;
    }

    if (!user) {
      toast.error('Debes iniciar sesión para suscribirte');
      return;
    }

    if (profile?.role !== 'landlord') {
      toast.error('Solo los propietarios pueden suscribirse');
      return;
    }

    const plan = STRIPE_PLANS[planId];
    setLoadingPlan(planId);

    try {
      await openCheckout(plan.price_id, plan.name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al procesar');
    } finally {
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {(Object.keys(STRIPE_PLANS) as PlanId[]).map((planId) => {
        const plan = STRIPE_PLANS[planId];
        const isCurrentPlan = showCurrentPlan && subscribed && planName === plan.name;
        const isPopular = planId === 'pro';

        return (
          <Card 
            key={planId}
            className={cn(
              "relative transition-all duration-300 hover:shadow-lg",
              isCurrentPlan && "border-primary ring-2 ring-primary",
              isPopular && !isCurrentPlan && "border-primary/50"
            )}
          >
            {isPopular && !isCurrentPlan && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Más Popular
              </Badge>
            )}
            {isCurrentPlan && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                Tu Plan Actual
              </Badge>
            )}
            
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {planIcons[planId]}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                variant={isCurrentPlan ? "outline" : isPopular ? "default" : "outline"}
                disabled={isCurrentPlan || isLoading || loadingPlan !== null}
                onClick={() => handleSelectPlan(planId)}
              >
                {loadingPlan === planId ? (
                  "Procesando..."
                ) : isCurrentPlan ? (
                  "Plan Actual"
                ) : subscribed ? (
                  "Cambiar a este plan"
                ) : (
                  "Comenzar ahora"
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PricingCards;
