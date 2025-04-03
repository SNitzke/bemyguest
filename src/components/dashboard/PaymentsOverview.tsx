
import React from "react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Payment } from "../../types";

interface PaymentsOverviewProps {
  payments: Payment[];
}

const PaymentsOverview: React.FC<PaymentsOverviewProps> = ({ payments }) => {
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recent Payments</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {payments.length === 0 ? (
          <div className="px-6 py-4 text-center text-sm text-muted-foreground">
            No payments yet.
          </div>
        ) : (
          <div className="space-y-0 divide-y">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between px-6 py-4 last:rounded-b-lg hover:bg-muted/50 transition-colors"
              >
                <div className="grid gap-1">
                  <div className="font-medium">{formatCurrency(payment.amount)}</div>
                  <div className="text-xs text-muted-foreground">
                    Due: {new Date(payment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <Badge className={getStatusBadgeClass(payment.status)} variant="outline">
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentsOverview;
