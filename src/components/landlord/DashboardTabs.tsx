
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Building2, Check, Calendar, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../dashboard/PropertyCard';
import IssuesOverview from '../dashboard/IssuesOverview';
import PaymentsOverview from '../dashboard/PaymentsOverview';

interface DashboardTabsProps {
  properties: any[];
  issues: any[];
  payments: any[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ properties, issues, payments }) => {
  const [activeTab, setActiveTab] = useState('properties');
  const navigate = useNavigate();
  
  return (
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
            <h2 className="text-lg font-medium">Tus Propiedades</h2>
            <Button 
              onClick={() => navigate('/properties')}
              className="flex items-center gap-2"
            >
              <PlusCircle size={16} />
              Gestionar Propiedades
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
              Ver Todas ({properties.length}) Propiedades
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
  );
};

export default DashboardTabs;
