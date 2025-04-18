import React, { useState } from 'react';
import PropertySearch from '../components/properties/PropertySearch';
import PropertyCard from '../components/dashboard/PropertyCard';
import { properties } from '../utils/mockData';

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = () => {
    // Implement filter modal/dropdown logic
    console.log('Filter clicked');
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

      <PropertySearch
        onSearch={handleSearch}
        onFilterClick={handleFilterClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default Properties;
