"use client";

import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

import { Transaction } from '@/types/transaction';

interface SpendingTrendsChartProps {
  transactions: Transaction[];
}

interface ChartData {
  date: string;
  amount: number;
}

const SpendingTrendsChart = ({ transactions }: SpendingTrendsChartProps) => {
  // Process transactions into monthly net cash flow
  const processTransactionData = (): ChartData[] => {
    const monthlyData = new Map<string, { income: number; expenses: number }>();

    // Initialize with zero values
    transactions.forEach((transaction) => {
      const dateStr = format(new Date(transaction.date), "MMM yyyy");
      if (!monthlyData.has(dateStr)) {
        monthlyData.set(dateStr, { income: 0, expenses: 0 });
      }
      const data = monthlyData.get(dateStr)!;
      if (transaction.type === "income") {
        data.income += Math.abs(transaction.amount);
      } else {
        data.expenses += Math.abs(transaction.amount);
      }
    });

    // Calculate net cash flow (income - expenses)
    const dailyTotals = new Map<string, number>();
    monthlyData.forEach((data, dateStr) => {
      dailyTotals.set(dateStr, data.income - data.expenses);
    });

    return Array.from(dailyTotals.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        const [monthA, yearA] = a.date.split(' ');
        const [monthB, yearB] = b.date.split(' ');
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const data = processTransactionData();

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.amount));
    const dataMin = Math.min(...data.map((i) => i.amount));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  };

  const offset = gradientOffset();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cash Flow Trends</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-sm"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-sm"
              tick={{ fill: "currentColor" }}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                }).format(value)
              }
            />
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset={offset}
                  stopColor="#22c55e"
                  stopOpacity={0.8}
                />
                <stop
                  offset={offset}
                  stopColor="#ef4444"
                  stopOpacity={0.8}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#000000"
              fill="url(#splitColor)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SpendingTrendsChart;
