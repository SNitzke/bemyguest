
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PropertyRentHistoryProps {
  propertyId: string;
}

const PropertyRentHistory: React.FC<PropertyRentHistoryProps> = ({ propertyId }) => {
  // Mock data - in a real app, this would come from an API
  const rentHistory = [
    { month: "Jan", rent: 1200 },
    { month: "Feb", rent: 1200 },
    { month: "Mar", rent: 1250 },
    { month: "Apr", rent: 1250 },
    { month: "May", rent: 1250 },
    { month: "Jun", rent: 1300 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rent Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rentHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `$${value}`}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="rent"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyRentHistory;
