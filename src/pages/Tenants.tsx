import React from 'react';
// import TenantCard from "../components/tenants/TenantCard"; // Placeholder for TenantCard component
// import { tenants } from "../utils/mockData"; // Placeholder for tenant data

const Tenants = () => {
  // Placeholder for fetching or using mock data
  const tenantsData = [
    {
      id: 't1',
      name: 'Alice Johnson',
      propertyName: 'Sunset Apartments Unit 101',
      leaseEndDate: '2024-12-31',
      rentAmount: 1500,
      contactEmail: 'alice.j@email.com',
    },
    {
      id: 't2',
      name: 'Bob Williams',
      propertyName: 'Downtown Lofts #5B',
      leaseEndDate: '2025-05-31',
      rentAmount: 2200,
      contactEmail: 'bob.w@email.com',
    },
    {
      id: 't3',
      name: 'Charlie Brown',
      propertyName: 'Oak Residence Suite 3',
      leaseEndDate: '2024-08-31',
      rentAmount: 1850,
      contactEmail: 'charlie.b@email.com',
    },
  ]; // Replace with actual data fetching/mock import later

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Tenants</h1>
        <p className="text-muted-foreground">View and manage your tenants</p>
      </div>

      {/* Add Search/Filter components later if needed */}
      {/* <TenantSearch onSearch={...} onFilterClick={...} /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenantsData.map((tenant) => (
          // Replace with actual TenantCard component later
          <div
            key={tenant.id}
            className="border rounded-lg p-4 shadow-sm bg-card text-card-foreground"
          >
            <h3 className="font-semibold">{tenant.name}</h3>
            <p className="text-sm text-muted-foreground">
              {tenant.propertyName}
            </p>
            <p className="text-sm">Lease End: {tenant.leaseEndDate}</p>
            <p className="text-sm">Rent: ${tenant.rentAmount}/month</p>
            <p className="text-sm">Email: {tenant.contactEmail}</p>
          </div>
          // <TenantCard key={tenant.id} tenant={tenant} />
        ))}
      </div>
    </div>
  );
};

export default Tenants;
