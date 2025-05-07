'use client';

import { Budget } from '@/types/budget';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

interface BudgetCardProps {
  budget: Budget;
  onEdit: () => void;
  onDelete: () => void;
  onAddAmount: (id: string) => void;
  onWithdrawAmount: (id: string) => void;
}

export function BudgetCard({
  budget,
  onEdit,
  onDelete,
  onAddAmount,
  onWithdrawAmount,
}: BudgetCardProps) {
  const progress = (budget.spent / budget.amount) * 100;
  const remaining = budget.amount - budget.spent;
  const isOverBudget = remaining < 0;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{budget.name}</h3>
            <p className="text-sm text-muted-foreground">
              {budget.category} • {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent: {formatCurrency(budget.spent)}</span>
            <span>Budget: {formatCurrency(budget.amount)}</span>
          </div>
          <Progress
            value={progress}
            className={isOverBudget ? "bg-destructive" : undefined}
          />
          <p className={`text-sm ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
            {isOverBudget
              ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
              : `${formatCurrency(remaining)} remaining`
            }
          </p>
        </div>

        {budget.alerts.enabled && budget.alerts.threshold && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">
              Alert at: {formatCurrency(budget.alerts.threshold)}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/50 p-3">
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddAmount(budget.id)}
            className="w-[48%]"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWithdrawAmount(budget.id)}
            className="w-[48%]"
          >
            <Minus className="h-4 w-4 mr-1" />
            Withdraw
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
