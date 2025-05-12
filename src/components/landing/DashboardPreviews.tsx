
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Home, User, CreditCard, PieChart, MessageSquare, Calendar, AlertTriangle } from 'lucide-react';

const DashboardPreviews: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Explore Our Dashboards</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Designed specifically for property owners and tenants, our intuitive dashboards provide everything you need to manage your properties or rental experience.
          </p>
        </div>

        <Tabs defaultValue="landlord" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="landlord" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Landlord View</span>
            </TabsTrigger>
            <TabsTrigger value="tenant" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Tenant View</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="landlord" className="mt-4">
            {/* Landlord Dashboard Preview */}
            <div className="border rounded-lg overflow-hidden bg-white shadow-md">
              <div className="bg-bmg-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Landlord Dashboard</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Sarah Johnson</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm text-gray-500">Properties</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <Building2 className="h-8 w-8 text-bmg-500" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm text-gray-500">Monthly Income</p>
                        <p className="text-2xl font-bold">$15,400</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-green-500" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm text-gray-500">Active Tenants</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <User className="h-8 w-8 text-blue-500" />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Card className="h-full">
                      <CardContent className="p-4 h-full">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <PieChart className="h-4 w-4" />
                            Financial Overview
                          </h4>
                        </div>
                        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                          <p className="text-gray-500">Financial charts and analytics</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Recent Issues
                          </h4>
                        </div>
                        <div className="space-y-3">
                          <div className="p-2 bg-red-50 rounded-md border border-red-100">
                            <p className="text-sm font-medium">Water Leak</p>
                            <p className="text-xs text-gray-500">Apt #103 - Reported today</p>
                          </div>
                          <div className="p-2 bg-yellow-50 rounded-md border border-yellow-100">
                            <p className="text-sm font-medium">AC Maintenance</p>
                            <p className="text-xs text-gray-500">Apt #205 - Scheduled for tomorrow</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tenant" className="mt-4">
            {/* Tenant Dashboard Preview */}
            <div className="border rounded-lg overflow-hidden bg-white shadow-md">
              <div className="bg-bmg-500 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Tenant Dashboard</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Michael Rodriguez</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm text-gray-500">Rent Due</p>
                        <p className="text-2xl font-bold">$1,200</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-bmg-500" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm text-gray-500">Due Date</p>
                        <p className="text-2xl font-bold">May 1, 2025</p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-500" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm text-gray-500">Open Tickets</p>
                        <p className="text-2xl font-bold">2</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Your Property
                        </h4>
                      </div>
                      <div className="relative h-40 bg-gray-100 rounded mb-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-gray-500">Property image</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium">Sunset Apartments, Unit 4B</h5>
                        <p className="text-sm text-gray-500">1234 Ocean Avenue, San Francisco, CA</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Messages
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">Property Manager</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                          <p className="text-sm">We'll be servicing the AC units next week...</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">Maintenance</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                          <p className="text-sm">Your maintenance request has been completed...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default DashboardPreviews;
