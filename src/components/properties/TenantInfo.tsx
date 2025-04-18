
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User, Phone, Mail, Calendar } from "lucide-react";

interface TenantInfoProps {
  propertyId: string;
}

const TenantInfo: React.FC<TenantInfoProps> = ({ propertyId }) => {
  // Mock tenant data - in a real app, this would come from an API
  const tenants = [
    {
      id: 1,
      name: "John Doe",
      unit: "2B",
      phone: "(555) 123-4567",
      email: "john.doe@example.com",
      moveInDate: "2023-06-01",
      leaseEnd: "2024-05-31",
    },
    {
      id: 2,
      name: "Jane Smith",
      unit: "3A",
      phone: "(555) 987-6543",
      email: "jane.smith@example.com",
      moveInDate: "2024-02-01",
      leaseEnd: "2025-01-31",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Tenants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{tenant.name}</span>
                <span className="text-sm text-muted-foreground">Unit {tenant.unit}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Lease: {tenant.moveInDate} - {tenant.leaseEnd}
                  </span>
                </div>
              </div>
              {tenants.length > 1 && <hr className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantInfo;
