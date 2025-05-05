import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Building2, User, Check, Calendar, PlusCircle, FileText, Settings } from 'lucide-react';
import PropertyCard from '../components/dashboard/PropertyCard';
import { properties, issues, payments, financialData } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';
import IssuesOverview from '../components/dashboard/IssuesOverview';
import PaymentsOverview from '../components/dashboard/PaymentsOverview';
import FinancialChart from '../components/dashboard/FinancialChart';
import { supabase } from '@/integrations/supabase/client';
import { LandlordDetails } from '@/types/auth';

const LandlordProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [landlordDetails, setLandlordDetails] = useState<LandlordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const userMetadata = user?.user_metadata as { full_name?: string, role?: string, phone_number?: string } | undefined;
  const fullName = userMetadata?.full_name || 'Landlord';
  const phoneNumber = userMetadata?.phone_number || 'Not provided';
  
  useEffect(() => {
    const fetchLandlordDetails = async () => {
      if (!user) return;
      
      try {
        // Use a custom RPC function to fetch landlord details with proper typing
        const { data, error } = await supabase.rpc('get_landlord_details', {
          user_id: user.id
        } as {
          user_id: string;
        });
        
        if (error) {
          console.error("Error fetching landlord details:", error);
          return;
        }
        
        setLandlordDetails(data);
      } catch (err) {
        console.error("Error in landlord details fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLandlordDetails();
  }, [user]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Landlord Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {fullName}. Manage your property portfolio
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Subscription Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">
                    {landlordDetails?.subscription_plan || 'Basic'} Plan
                  </h3>
                  <p className="text-blue-600">
                    Active since {new Date(landlordDetails?.subscription_start_date || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  className="mt-4 md:mt-0"
                  onClick={() => navigate('/settings')}
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{properties.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {properties.filter(p => p.status === 'occupied').length} occupied
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{issues.filter(i => i.status !== "resolved").length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {issues.filter(i => i.status === "new").length} new this week
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{payments.filter(p => p.status === "pending").length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ${payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12,450</div>
                <div className="text-xs text-green-500 mt-1">
                  +8% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{landlordDetails?.company_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{userMetadata?.role || 'Landlord'}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Main Content Area */}
            <div className="md:col-span-2">
              <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="properties" className="flex items-center gap-2">
                    <Building2 size={16} />
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="issues" className="flex items-center gap-2">
                    <Check size={16} />
                    Issues
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Payments
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="properties" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Your Properties</h2>
                    <Button 
                      onClick={() => navigate('/properties')}
                      className="flex items-center gap-2"
                    >
                      <PlusCircle size={16} />
                      Add Property
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {properties.slice(0, 3).map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                  {properties.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate('/properties')}
                    >
                      View All ({properties.length}) Properties
                    </Button>
                  )}
                </TabsContent>
                
                <TabsContent value="issues">
                  <IssuesOverview issues={issues} />
                </TabsContent>
                
                <TabsContent value="payments">
                  <PaymentsOverview payments={payments} />
                </TabsContent>
              </Tabs>
            </div>
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
