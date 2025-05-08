'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, ZAxis } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { getUpcomingBills, type UpcomingBill } from "@/lib/services/bills";
import { format } from 'date-fns';

export function BillsTimeline() {
  const { data, isLoading } = useQuery<UpcomingBill[]>({
    queryKey: ['bills', 'upcoming'],
    queryFn: getUpcomingBills
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bills Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bills Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No upcoming bills
          </p>
        </CardContent>
      </Card>
    );
  }

  // Transform data for the scatter plot
  const chartData = data.map(bill => ({
    x: bill.daysUntilDue,
    y: bill.amount,
    z: 1000, // Size of the point
    ...bill
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
            >
              <XAxis 
                type="number"
                dataKey="x"
                name="Days"
                unit=" days"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => {
                  if (value < 0) return `${Math.abs(value)}d overdue`;
                  if (value === 0) return 'Today';
                  return `In ${value}d`;
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Amount"
                unit="$"
                tickFormatter={(value) => `$${value}`}
              />
              <ZAxis
                type="number"
                dataKey="z"
                range={[100, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const data = payload[0].payload as UpcomingBill & { x: number; y: number };
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {data.name}
                            </span>
                            <span className="font-bold">
                              ${data.amount}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Due: {format(new Date(data.dueDate), 'MMM d, yyyy')}
                            </span>
                            <span className={`text-sm ${
                              data.status === 'overdue' 
                                ? 'text-red-500'
                                : data.status === 'due-soon'
                                ? 'text-yellow-500'
                                : 'text-green-500'
                            }`}>
                              {data.status === 'overdue' 
                                ? `${Math.abs(data.daysUntilDue)} days overdue`
                                : data.status === 'due-soon'
                                ? `Due in ${data.daysUntilDue} days`
                                : `Due in ${data.daysUntilDue} days`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                data={chartData}
                shape="circle"
                fill={(entry) => {
                  const data = entry as (typeof chartData)[0];
                  return data.status === 'overdue'
                    ? '#ef4444' // red
                    : data.status === 'due-soon'
                    ? '#eab308' // yellow
                    : '#10b981'; // green
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
