
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Building2, User } from 'lucide-react';
import PropertyCard from '../components/dashboard/PropertyCard';
import { properties } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';

const LandlordProfile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const userMetadata = user?.user_metadata as { full_name?: string, role?: string, phone_number?: string } | undefined;
  const fullName = userMetadata?.full_name || 'User';
  const phoneNumber = userMetadata?.phone_number || 'Not provided';
  
  // Ensure the user is a landlord
  useEffect(() => {
    if (userMetadata?.role !== 'landlord') {
      navigate('/dashboard');
    }
  }, [userMetadata?.role, navigate]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Landlord Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and property portfolio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="md:col-span-2">
          <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="properties" className="flex items-center gap-2">
                <Building2 size={16} />
                Properties
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                Stats & Analytics
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
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analytics features coming soon. Here you'll be able to see occupancy rates, 
                    financial performance, and other metrics for your property portfolio.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LandlordProfile;
