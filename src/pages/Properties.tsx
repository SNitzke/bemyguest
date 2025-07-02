import React, { useState } from 'react';
import PropertySearch from '../components/properties/PropertySearch';
import PropertyCard from '../components/dashboard/PropertyCard';
import { AddPropertyModal } from '../components/properties/AddPropertyModal';
import { PropertyActions } from '../components/properties/PropertyActions';
import { properties as initialProperties } from '../utils/mockData';
import { Property } from '../types';

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = () => {
    // Implement filter modal/dropdown logic
    console.log('Filter clicked');
  };

  const handleAddProperty = (newProperty: { name: string; address: string; units: number }) => {
    const property: Property = {
      id: Date.now().toString(),
      ...newProperty,
      imageUrl: '/placeholder.svg',
      landlordId: '1', // Current user
      status: 'vacant'
    };
    setProperties(prev => [...prev, property]);
  };

  const handleEditProperty = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Properties</h1>
        <p className="text-muted-foreground">
          Manage and monitor your property portfolio
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <PropertySearch
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
        />
        <AddPropertyModal onAddProperty={handleAddProperty} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="relative">
            <PropertyCard property={property} />
            <div className="absolute top-2 right-2">
              <PropertyActions
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;
