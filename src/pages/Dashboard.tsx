
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { properties, issues, payments, financialData } from "../utils/mockData";
import PropertyCard from "../components/dashboard/PropertyCard";
import IssuesOverview from "../components/dashboard/IssuesOverview";
import PaymentsOverview from "../components/dashboard/PaymentsOverview";
import FinancialChart from "../components/dashboard/FinancialChart";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userMetadata = user?.user_metadata as { full_name?: string, role?: string } | undefined;
  const fullName = userMetadata?.full_name || 'User';
  const isLandlord = userMetadata?.role === "landlord";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {fullName}. Here's an overview of your {isLandlord ? "properties" : "rental"}.
        </p>
      </div>

      {isLandlord ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Your Properties</h2>
              <div className="grid grid-cols-1 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <IssuesOverview issues={issues} />
              <PaymentsOverview payments={payments} />
            </div>
          </div>
          
          <div className="mt-8">
            <FinancialChart data={financialData} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Payment Due</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$1,200</div>
                <p className="text-xs text-muted-foreground">Due on Dec 5, 2023</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Lease Ending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">43</div>
                <p className="text-xs text-muted-foreground">Days remaining</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <PaymentsOverview payments={payments.filter(p => p.tenantId === "1")} />
            <IssuesOverview issues={issues.filter(i => i.tenantId === "1")} />
          </div>
          
          <div className="mt-6">
            <Card className="dash-card">
              <CardHeader>
                <CardTitle>Your Residence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <img 
                      src="/placeholder.svg" 
                      alt="Sunset Apartments" 
                      className="w-full h-auto rounded-md"
                    />
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <h3 className="text-xl font-semibold">Sunset Apartments, Unit 101</h3>
                    <p className="text-muted-foreground">123 Sunset Blvd, Los Angeles, CA 90210</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Move-in Date</p>
                        <p>Jan 15, 2023</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Lease End Date</p>
                        <p>Jan 14, 2024</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Monthly Rent</p>
                        <p>$1,200</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Building Manager</p>
                        <p>Alex Johnson</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
