
import React from "react";
import { useParams } from "react-router-dom";
import { Property } from "../types";
import { properties } from "../utils/mockData";
import PropertyHeader from "../components/properties/PropertyHeader";
import PropertyWarnings from "../components/properties/PropertyWarnings";
import PropertyTimeline from "../components/properties/PropertyTimeline";
import PropertyRentHistory from "../components/properties/PropertyRentHistory";
import TenantInfo from "../components/properties/TenantInfo";
import EditPropertyModal from "../components/properties/EditPropertyModal";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="space-y-6">
      <PropertyHeader property={property} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PropertyWarnings propertyId={property.id} />
          <PropertyRentHistory propertyId={property.id} />
          <PropertyTimeline propertyId={property.id} />
        </div>
        <div className="space-y-6">
          <TenantInfo propertyId={property.id} />
          <EditPropertyModal property={property} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
