
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarDays, FileText, Tool, UserCheck } from "lucide-react";

interface PropertyTimelineProps {
  propertyId: string;
}

const PropertyTimeline: React.FC<PropertyTimelineProps> = ({ propertyId }) => {
  // Mock timeline data - in a real app, this would come from an API
  const events = [
    {
      id: 1,
      type: "maintenance",
      title: "HVAC Repair",
      date: "2024-04-15",
      description: "Scheduled maintenance for HVAC system",
      icon: Tool,
    },
    {
      id: 2,
      type: "lease",
      title: "Lease Renewal",
      date: "2024-04-01",
      description: "Tenant in Unit 2B renewed lease for 12 months",
      icon: FileText,
    },
    {
      id: 3,
      type: "inspection",
      title: "Property Inspection",
      date: "2024-03-15",
      description: "Annual property inspection completed",
      icon: CalendarDays,
    },
    {
      id: 4,
      type: "tenant",
      title: "New Tenant",
      date: "2024-02-01",
      description: "New tenant moved into Unit 3A",
      icon: UserCheck,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {events.map((event, index) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="flex gap-4">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    <Icon className="h-4 w-4" />
                  </div>
                  {index !== events.length - 1 && (
                    <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-px bg-border h-full" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.description}</div>
                  <div className="text-sm text-muted-foreground mt-1">{event.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyTimeline;
