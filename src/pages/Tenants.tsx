
import React from 'react';

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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Tenants</h1>
        <p className="text-muted-foreground">View and manage your tenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenantsData.map((tenant) => (
          <div
            key={tenant.id}
            className="border rounded-lg p-4 shadow-sm bg-card text-card-foreground flex flex-col gap-2 h-full"
          >
            <h3 className="font-semibold text-lg truncate">{tenant.name}</h3>
            <p className="text-sm text-muted-foreground break-words md:truncate" title={tenant.propertyName}>
              {tenant.propertyName}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm">
              <span className="whitespace-nowrap">Lease End:</span>
              <span className="text-muted-foreground">{tenant.leaseEndDate}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm">
              <span className="whitespace-nowrap">Rent:</span>
              <span className="text-green-700 font-semibold">${tenant.rentAmount}/month</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm break-all">
              <span className="whitespace-nowrap">Email:</span>
              <span className="text-blue-700 underline">{tenant.contactEmail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tenants;
