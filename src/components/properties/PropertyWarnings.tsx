
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, AlertOctagon, BellRing } from "lucide-react";

interface PropertyWarningsProps {
  propertyId: string;
}

const PropertyWarnings: React.FC<PropertyWarningsProps> = ({ propertyId }) => {
  // Mock warnings data - in a real app, this would come from an API
  const warnings = [
    { id: 1, type: "maintenance", message: "HVAC maintenance due", severity: "medium" },
    { id: 2, type: "payment", message: "Rent payment overdue - Unit 2B", severity: "high" },
    { id: 3, type: "inspection", message: "Annual inspection scheduled next week", severity: "low" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return AlertOctagon;
      case "payment":
        return AlertTriangle;
      default:
        return BellRing;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Warnings & Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {warnings.map((warning) => {
            const Icon = getIcon(warning.type);
            return (
              <div
                key={warning.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(
                  warning.severity
                )}`}
              >
                <Icon className="h-5 w-5 mt-0.5" />
                <span>{warning.message}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyWarnings;
