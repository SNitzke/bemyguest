
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { FinancialData } from "../../types";

interface FinancialChartProps {
  data: FinancialData[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Financial Overview</CardTitle>
            <CardDescription>Monthly income and expenses</CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={`px-2 py-1 text-xs rounded ${
                chartType === "bar"
                  ? "bg-primary text-white"
                  : "bg-secondary text-primary"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-2 py-1 text-xs rounded ${
                chartType === "line"
                  ? "bg-primary text-white"
                  : "bg-secondary text-primary"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#4ade80" />
                <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                <Bar dataKey="netProfit" name="Net Profit" fill="#60a5fa" />
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Line type="monotone" dataKey="income" name="Income" stroke="#4ade80" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" />
                <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#60a5fa" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
