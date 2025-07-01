
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { properties, issues, payments, financialData } from '../utils/mockData';
import { LandlordDetails } from '@/types/auth';

// Import components
import SubscriptionCard from '../components/landlord/SubscriptionCard';
import MetricsCards from '../components/landlord/MetricsCards';
import ProfileInfoCard from '../components/landlord/ProfileInfoCard';
import DashboardTabs from '../components/landlord/DashboardTabs';
import LoadingState from '../components/landlord/LoadingState';
import FinancialChart from '../components/dashboard/FinancialChart';
import { Button } from '../components/ui/button';
import { CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const LandlordProfile: React.FC = () => {
  const { user, profile } = useAuth();
  const [landlordDetails, setLandlordDetails] = useState<LandlordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
        
        setLandlordDetails(data as LandlordDetails);
      } catch (err) {
        console.error("Error in landlord details fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLandlordDetails();
  }, [user]);

  const handlePaymentVerification = () => {
    toast.info("Para activar tu plan, realiza una transferencia bancaria. Nos pondremos en contacto contigo para confirmar el pago.");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Panel de Propietario</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta, {profile?.full_name || 'Propietario'}. Gestiona tu cartera de propiedades
        </p>
      </div>
      
      {isLoading ? (
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
          
          {/* Financial Chart */}
          <div className="mt-6">
            <FinancialChart data={financialData} />
          </div>
        </>
      )}
    </div>
  );
};

export default LandlordProfile;
