
import React from "react";
import { Property } from "../../types";
import { MapPin, DollarSign } from "lucide-react";
import PropertyStatusBadge from "./PropertyStatusBadge";

interface PropertyHeaderProps {
  property: Property;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({ property }) => {
  const status = "available" as const; // This should come from property data
  const rentRate = "$1,200/month"; // This should come from property data

  return (
    <div className="pb-6 border-b">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold">{property.name}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {property.address}
          </div>
          <div className="flex items-center font-medium mt-2">
            <DollarSign className="h-4 w-4 mr-1" />
            {rentRate}
          </div>
        </div>
        <PropertyStatusBadge status={status} />
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <span>{property.units} units</span>
      </div>
    </div>
  );
};

export default PropertyHeader;
