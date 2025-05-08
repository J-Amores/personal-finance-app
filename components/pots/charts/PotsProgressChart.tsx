'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { getPotsProgress, type PotProgress } from "@/lib/services/pots";

export function PotsProgressChart() {
  const { data, isLoading } = useQuery<PotProgress[]>({
    queryKey: ['pots', 'progress'],
    queryFn: getPotsProgress
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals Progress</CardTitle>
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
          <CardTitle>Savings Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No savings goals available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Transform data for the radial chart
  const chartData = data.map((pot, index) => ({
    name: pot.name,
    value: pot.percentage,
    fill: [
      '#10b981', // green
      '#6366f1', // indigo
      '#0ea5e9', // sky
      '#8b5cf6', // violet
      '#ec4899', // pink
    ][index % 5],
    current: pot.current,
    target: pot.target,
    remaining: pot.remainingAmount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={chartData}
              innerRadius="30%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                minAngle={15}
                background
                dataKey="value"
                cornerRadius={8}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {data.name}
                            </span>
                            <span className="font-bold">
                              ${data.current} / ${data.target}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ${data.remaining} remaining
                            </span>
                            <span className={`text-sm ${
                              data.value >= 100 
                                ? 'text-green-500' 
                                : data.value >= 75 
                                ? 'text-emerald-500'
                                : data.value >= 50
                                ? 'text-sky-500'
                                : 'text-indigo-500'
                            }`}>
                              {data.value}% complete
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
