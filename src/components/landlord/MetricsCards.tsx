
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Building2, Check, Calendar, FileText } from 'lucide-react';

interface MetricsCardsProps {
  properties: any[];
  issues: any[];
  payments: any[];
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ properties, issues, payments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{properties.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {properties.filter(p => p.status === 'occupied').length} occupied
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          <Check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{issues.filter(i => i.status !== "resolved").length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {issues.filter(i => i.status === "new").length} new this week
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{payments.filter(p => p.status === "pending").length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            ${payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">$12,450</div>
          <div className="text-xs text-green-500 mt-1">
            +8% from last month
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
