
import React, { useState } from "react";
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
import { Edit } from "lucide-react";
import { toast } from "sonner";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | undefined>(
    properties.find((p) => p.id === id)
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (!property) {
    return <div>Property not found</div>;
  }

  const handleEditProperty = (updatedProperty: Property) => {
    setProperty(updatedProperty);
  };

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
          <div className="bg-background border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Acciones de Propiedad</h3>
            <Button onClick={() => setEditModalOpen(true)} className="gap-2 w-full">
              <Edit size={16} />
              Editar Propiedad
            </Button>
          </div>
        </div>
      </div>

      <EditPropertyModal
        property={property}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onEdit={handleEditProperty}
      />
    </div>
  );
};

export default PropertyDetails;
