
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Property } from "../../types";
import { MapPin, DollarSign } from "lucide-react";
import PropertyStatusBadge from "../properties/PropertyStatusBadge";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const rentRate = "$1,200/month"; // This should come from the property object
  const status = "available" as const; // This should come from the property object

  return (
    <Card className="dash-card flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.name} 
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{property.name}</h3>
          <PropertyStatusBadge status={status} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {property.address}
          </div>
          <div className="flex items-center text-sm font-medium">
            <DollarSign className="h-4 w-4 mr-1" />
            {rentRate}
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <span className="text-sm text-muted-foreground">{property.units} units</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-4">
        <button 
          onClick={() => navigate(`/properties/${property.id}`)}
          className="text-sm text-primary hover:underline"
        >
          View Details
        </button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
