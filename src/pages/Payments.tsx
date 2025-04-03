
import React, { useState } from "react";
import { payments } from "../utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const Payments: React.FC = () => {
  const { user } = useAuth();
  const isLandlord = user?.role === "landlord";
  const [filter, setFilter] = useState<string>("all");

  const filteredPayments = filter === "all" 
    ? payments 
    : payments.filter(payment => payment.status === filter);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Payment Management</h1>
        <p className="text-muted-foreground">
          {isLandlord 
            ? "Track payments from your tenants" 
            : "Manage your rent and utility payments"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          onClick={() => setFilter("all")}
          size="sm"
        >
          All
        </Button>
        <Button 
          variant={filter === "completed" ? "default" : "outline"} 
          onClick={() => setFilter("completed")}
          size="sm"
        >
          Completed
        </Button>
        <Button 
          variant={filter === "pending" ? "default" : "outline"} 
          onClick={() => setFilter("pending")}
          size="sm"
        >
          Pending
        </Button>
        <Button 
          variant={filter === "failed" ? "default" : "outline"} 
          onClick={() => setFilter("failed")}
          size="sm"
        >
          Failed
        </Button>
      </div>

      {!isLandlord && (
        <Card className="bg-gradient-to-r from-bmg-500 to-bmg-600 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-xl font-semibold">Upcoming Payment</h3>
                <p className="text-bmg-50 mt-1">Due on December 5, 2023</p>
                <p className="text-3xl font-bold mt-4">{formatCurrency(1200)}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="w-full md:w-auto bg-white text-bmg-800 hover:bg-bmg-50">
                  Make Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b">
                    <th className="text-left font-medium p-3">Amount</th>
                    <th className="text-left font-medium p-3">Type</th>
                    <th className="text-left font-medium p-3">Due Date</th>
                    <th className="text-left font-medium p-3">Payment Date</th>
                    <th className="text-left font-medium p-3">Status</th>
                    <th className="text-left font-medium p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="p-3 font-medium">{formatCurrency(payment.amount)}</td>
                      <td className="p-3 capitalize">{payment.type}</td>
                      <td className="p-3">{new Date(payment.dueDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        {payment.paymentDate 
                          ? new Date(payment.paymentDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusBadgeClass(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm">
                          {isLandlord ? "Details" : payment.status === "pending" ? "Pay Now" : "Receipt"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
