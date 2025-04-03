
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Property } from "../../types";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Card className="dash-card flex flex-col overflow-hidden">
      <div className="h-40 w-full overflow-hidden rounded-t-md">
        <img 
          src={property.imageUrl} 
          alt={property.name} 
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="text-lg font-semibold">{property.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{property.address}</p>
        <div className="mt-3 flex items-center">
          <span className="text-sm font-medium">{property.units} units</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-4 flex justify-between">
        <button className="text-sm text-primary hover:underline">
          View Details
        </button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
