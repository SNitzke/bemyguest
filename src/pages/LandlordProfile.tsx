
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Building2, User, Check, Calendar } from 'lucide-react';
import PropertyCard from '../components/dashboard/PropertyCard';
import { properties, issues, payments, financialData } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';
import IssuesOverview from '../components/dashboard/IssuesOverview';
import PaymentsOverview from '../components/dashboard/PaymentsOverview';
import FinancialChart from '../components/dashboard/FinancialChart';

const LandlordProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const userMetadata = user?.user_metadata as { full_name?: string, role?: string, phone_number?: string } | undefined;
  const fullName = userMetadata?.full_name || 'Landlord';
  const phoneNumber = userMetadata?.phone_number || 'Not provided';
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Landlord Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {fullName}. Manage your property portfolio
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{issues.filter(i => i.status !== "resolved").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{payments.filter(p => p.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$12,450</div>
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
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{userMetadata?.role || 'Landlord'}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/settings')}
            >
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
                  size="sm" 
                  onClick={() => navigate('/properties')}
                >
                  View All Properties
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
    </div>
  );
};

export default LandlordProfile;
