'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BudgetCardProps {
  category: string;
  amount: number;
  spent: number;
  period: string;
}

export function BudgetCard({ category, amount, spent, period }: BudgetCardProps) {
  const progress = (spent / amount) * 100;
  const remaining = amount - spent;

  return (
    <Card data-testid={`budget-card-${category}`}>
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>Spent: ${spent}</span>
          <span>Remaining: ${remaining}</span>
        </div>
        <Progress value={progress} />
        <div className="text-sm text-muted-foreground">
          Budget: ${amount} ({period})
        </div>
      </CardContent>
    </Card>
  );
}
