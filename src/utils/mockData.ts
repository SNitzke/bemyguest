import { User, Property, Tenant, Issue, Payment, Message, FinancialData } from "../types";

// Mock users (landlords and tenants)
export const users: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "landlord",
    avatarUrl: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    role: "tenant",
    avatarUrl: "/placeholder.svg",
  },
  {
    id: "3",
    name: "John Smith",
    email: "john@example.com",
    role: "tenant",
    avatarUrl: "/placeholder.svg",
  }
];

// Mock properties
export const properties: Property[] = [
  {
    id: "1",
    name: "Sunset Apartments",
    address: "123 Sunset Blvd, Los Angeles, CA 90210",
    imageUrl: "/placeholder.svg",
    units: 12,
    landlordId: "1",
    status: "occupied", // Adding the required status property
  },
  {
    id: "2",
    name: "Oceanview Condos",
    address: "456 Ocean Dr, Miami Beach, FL 33139",
    imageUrl: "/placeholder.svg",
    units: 24,
    landlordId: "1",
    status: "vacant", // Adding the required status property
  }
];

// Mock tenants
export const tenants: Tenant[] = [
  {
    id: "1",
    userId: "2",
    propertyId: "1",
    unitNumber: "101",
    moveInDate: "2023-01-15",
    leaseEndDate: "2024-01-14",
    paymentMethod: "credit",
  },
  {
    id: "2",
    userId: "3",
    propertyId: "1",
    unitNumber: "102",
    moveInDate: "2023-03-01",
    leaseEndDate: "2024-02-28",
    paymentMethod: "debit",
  }
];

// Mock issues
export const issues: Issue[] = [
  {
    id: "1",
    title: "Leaking sink",
    description: "The kitchen sink has been leaking for 2 days.",
    imageUrls: ["/placeholder.svg"],
    status: "inProgress",
    createdAt: "2023-11-10T14:30:00Z",
    tenantId: "1",
    propertyId: "1",
  },
  {
    id: "2",
    title: "No hot water",
    description: "There's no hot water in the bathroom since this morning.",
    imageUrls: ["/placeholder.svg"],
    status: "new",
    createdAt: "2023-11-15T09:15:00Z",
    tenantId: "2",
    propertyId: "1",
  }
];

// Mock payments
export const payments: Payment[] = [
  {
    id: "1",
    amount: 1200,
    status: "completed",
    paymentDate: "2023-11-01T10:00:00Z",
    dueDate: "2023-11-05T00:00:00Z",
    type: "rent",
    tenantId: "1",
    propertyId: "1",
  },
  {
    id: "2",
    amount: 1200,
    status: "pending",
    paymentDate: "",
    dueDate: "2023-12-05T00:00:00Z",
    type: "rent",
    tenantId: "1",
    propertyId: "1",
  },
  {
    id: "3",
    amount: 1100,
    status: "completed",
    paymentDate: "2023-11-02T11:30:00Z",
    dueDate: "2023-11-05T00:00:00Z",
    type: "rent",
    tenantId: "2",
    propertyId: "1",
  },
  {
    id: "4",
    amount: 150,
    status: "completed",
    paymentDate: "2023-11-10T09:45:00Z",
    dueDate: "2023-11-15T00:00:00Z",
    type: "utilities",
    tenantId: "1",
    propertyId: "1",
  }
];

// Mock messages
export const messages: Message[] = [
  {
    id: "1",
    content: "When will the plumber arrive to fix the sink?",
    createdAt: "2023-11-10T15:00:00Z",
    senderId: "2",
    receiverId: "1",
    read: true,
  },
  {
    id: "2",
    content: "The plumber will be there tomorrow between 10am and 12pm.",
    createdAt: "2023-11-10T16:30:00Z",
    senderId: "1",
    receiverId: "2",
    read: true,
  },
  {
    id: "3",
    content: "I'd like to renew my lease, can we discuss terms?",
    createdAt: "2023-11-14T11:00:00Z",
    senderId: "3",
    receiverId: "1",
    read: false,
  }
];

// Financial data for chart
export const financialData: FinancialData[] = [
  { month: "Jan", income: 12000, expenses: 4000, netProfit: 8000 },
  { month: "Feb", income: 11800, expenses: 3800, netProfit: 8000 },
  { month: "Mar", income: 12100, expenses: 4100, netProfit: 8000 },
  { month: "Apr", income: 12000, expenses: 3900, netProfit: 8100 },
  { month: "May", income: 12500, expenses: 4200, netProfit: 8300 },
  { month: "Jun", income: 12700, expenses: 4100, netProfit: 8600 },
  { month: "Jul", income: 12500, expenses: 4300, netProfit: 8200 },
  { month: "Aug", income: 12600, expenses: 4000, netProfit: 8600 },
  { month: "Sep", income: 12400, expenses: 4100, netProfit: 8300 },
  { month: "Oct", income: 12800, expenses: 4200, netProfit: 8600 },
  { month: "Nov", income: 12700, expenses: 4100, netProfit: 8600 },
  { month: "Dec", income: 13000, expenses: 4300, netProfit: 8700 },
];

export const getCurrentUser = (): User => {
  // This would be replaced with actual authentication logic
  return users[0]; // Default to landlord
};
