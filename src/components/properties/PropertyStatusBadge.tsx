
import React from "react";
import { Badge } from "../ui/badge";
import { CircleAlert, CircleCheck, Flag } from "lucide-react";

type StatusType = "available" | "maintenance" | "alert";

interface PropertyStatusBadgeProps {
  status: StatusType;
}

const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "available":
        return {
          label: "Available",
          icon: CircleCheck,
          variant: "default" as const,
          className: "bg-green-500 hover:bg-green-600",
        };
      case "maintenance":
        return {
          label: "Maintenance",
          icon: Flag,
          variant: "secondary" as const,
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
        };
      case "alert":
        return {
          label: "Alert",
          icon: CircleAlert,
          variant: "destructive" as const,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default PropertyStatusBadge;
