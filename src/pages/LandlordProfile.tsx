
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FinancialData } from '../types';
import { LandlordDetails } from '@/types/auth';
import { useProperties } from '@/hooks/useProperties';
import { useIssues } from '@/hooks/useIssues';
import { usePayments } from '@/hooks/usePayments';

// Import components
import SubscriptionCard from '../components/landlord/SubscriptionCard';
import MetricsCards from '../components/landlord/MetricsCards';
import ProfileInfoCard from '../components/landlord/ProfileInfoCard';
import DashboardTabs from '../components/landlord/DashboardTabs';
import LoadingState from '../components/landlord/LoadingState';
import FinancialChart from '../components/dashboard/FinancialChart';
import { Button } from '../components/ui/button';
import { CreditCard, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentVerificationModal } from '../components/landlord/PaymentVerificationModal';
import { InviteTenantModal } from '../components/tenant/InviteTenantModal';
import TenantsList from '../components/tenants/TenantsList';
import { useTenants } from '../hooks/useTenants';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const LandlordProfile: React.FC = () => {
  const { user, profile } = useAuth();
  const [landlordDetails, setLandlordDetails] = useState<LandlordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  // Use real data hooks
  const { properties, isLoading: propertiesLoading } = useProperties();
  const { issues, isLoading: issuesLoading } = useIssues();
  const { payments, isLoading: paymentsLoading } = usePayments();
  const { tenants, isLoading: tenantsLoading } = useTenants();
  
  useEffect(() => {
    const fetchLandlordDetails = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase.rpc(
          'get_landlord_details', 
          { user_id: user.id }
        );
        
        if (error) {
          console.error("Error fetching landlord details:", error);
          return;
        }
        
        // Convert the Json response to LandlordDetails type safely
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setLandlordDetails(data as unknown as LandlordDetails);
        }
      } catch (err) {
        console.error("Error in landlord details fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLandlordDetails();
  }, [user]);

  const handlePaymentVerification = () => {
    setPaymentModalOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Panel de Propietario</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta, {profile?.full_name || 'Propietario'}. Gestiona tu cartera de propiedades
        </p>
      </div>
      
      {isLoading || propertiesLoading || issuesLoading || paymentsLoading || tenantsLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Payment Verification Banner */}
          {landlordDetails && !landlordDetails.payment_verified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Verificación de Pago Pendiente
                  </h3>
                  <p className="text-yellow-700">
                    Para activar tu plan {landlordDetails.subscription_plan}, necesitas verificar tu pago mediante transferencia bancaria.
                  </p>
                </div>
                <Button onClick={handlePaymentVerification} className="gap-2">
                  <CreditCard size={16} />
                  Verificar Pago
                </Button>
              </div>
            </div>
          )}

          {/* Subscription Info */}
          <SubscriptionCard landlordDetails={landlordDetails} />

          {/* Key Metrics */}
          <MetricsCards 
            properties={properties} 
            issues={issues} 
            payments={payments} 
          />

          {/* Tenants Management Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Gestión de Inquilinos</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Mensajes ({0})
                  </Button>
                  <InviteTenantModal properties={properties} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tenants.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <TenantsList showAll={false} />
                  </div>
                  {tenants.length > 3 && (
                    <div className="text-center pt-4 border-t">
                      <Button variant="outline">
                        Ver todos los inquilinos ({tenants.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No tienes inquilinos registrados</h3>
                  <p className="text-muted-foreground mb-4">
                    Comienza invitando inquilinos a tus propiedades para gestionar sus datos y comunicarte con ellos.
                  </p>
                  <InviteTenantModal properties={properties} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <ProfileInfoCard user={user} profile={profile} />

            {/* Main Content Area */}
            <DashboardTabs 
              properties={properties} 
              issues={issues} 
              payments={payments} 
            />
          </div>
          
          {/* Financial Chart - Only show if has data */}
          {properties.length > 0 && (
            <div className="mt-6">
              <FinancialChart data={[]} />
            </div>
          )}
        </>
      )}

      <PaymentVerificationModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        subscriptionPlan={landlordDetails?.subscription_plan || 'Basic'}
      />
    </div>
  );
};

export default LandlordProfile;
