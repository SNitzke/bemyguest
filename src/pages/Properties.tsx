import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Building } from 'lucide-react';
import { AddPropertyModal } from '../components/properties/AddPropertyModal';
import PropertyCard from '../components/dashboard/PropertyCard';
import { useProperties } from '../hooks/useProperties';

const Properties: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { properties, isLoading } = useProperties();

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-semibold">Mis Propiedades</h1>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold">Mis Propiedades</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de propiedades inmobiliarias
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Propiedad
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar propiedades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "No se encontraron propiedades" : "No tienes propiedades registradas"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda."
                : "Comienza agregando tu primera propiedad para empezar a gestionar tus rentas."
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Primera Propiedad
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {isAddModalOpen && (
        <AddPropertyModal 
          onAddProperty={(property) => {
            // TODO: Implement property addition
            console.log('Adding property:', property);
            setIsAddModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Properties;