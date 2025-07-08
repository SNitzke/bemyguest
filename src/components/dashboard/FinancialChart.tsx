
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FinancialChartProps {
  data?: FinancialData[];
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data: propData }) => {
  const { user } = useAuth();
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [enhancedData, setEnhancedData] = useState<FinancialData[]>([]);

  useEffect(() => {
    if (user) {
      fetchManualPaymentsData();
    }
  }, [user, propData]);

  const fetchManualPaymentsData = async () => {
    if (!user) return;

    try {
      const { data: manualPayments, error } = await supabase
        .from('manual_payments')
        .select('amount, payment_date, payment_type')
        .eq('user_id', user.id);

      if (error) throw error;

      // Use provided data or create default data structure
      const baseData = propData || [
        { month: "Ene", income: 0, expenses: 0, netProfit: 0 },
        { month: "Feb", income: 0, expenses: 0, netProfit: 0 },
        { month: "Mar", income: 0, expenses: 0, netProfit: 0 },
        { month: "Abr", income: 0, expenses: 0, netProfit: 0 },
        { month: "May", income: 0, expenses: 0, netProfit: 0 },
        { month: "Jun", income: 0, expenses: 0, netProfit: 0 }
      ];

      // Process manual payments by month
      const manualPaymentsByMonth: Record<string, { income: number; expenses: number }> = {};

      manualPayments?.forEach(payment => {
        const paymentDate = new Date(payment.payment_date);
        const month = paymentDate.toLocaleDateString('es', { month: 'short' });
        
        if (!manualPaymentsByMonth[month]) {
          manualPaymentsByMonth[month] = { income: 0, expenses: 0 };
        }

        // Categorize payments as income or expenses
        if (['rent', 'utilities'].includes(payment.payment_type)) {
          manualPaymentsByMonth[month].income += payment.amount;
        } else {
          manualPaymentsByMonth[month].expenses += payment.amount;
        }
      });

      // Merge manual payments with base data
      const enhancedFinancialData = baseData.map(monthData => {
        const manualData = manualPaymentsByMonth[monthData.month] || { income: 0, expenses: 0 };
        const totalIncome = monthData.income + manualData.income;
        const totalExpenses = monthData.expenses + manualData.expenses;
        
        return {
          ...monthData,
          income: totalIncome,
          expenses: totalExpenses,
          netProfit: totalIncome - totalExpenses
        };
      });

      setEnhancedData(enhancedFinancialData);
    } catch (error) {
      console.error('Error fetching manual payments for chart:', error);
      setEnhancedData(propData || []);
    }
  };

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
              <BarChart data={enhancedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <LineChart data={enhancedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
