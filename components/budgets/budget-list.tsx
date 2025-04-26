'use client'

import { Budget } from '@/types/budget'
import { BudgetCard } from './budget-card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BudgetListProps {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
}

export function BudgetList({ budgets, onEdit, onDelete }: BudgetListProps) {
  if (!budgets.length) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground">
        No budgets set. Create one to start tracking your spending.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <BudgetCard key={budget.id} budget={budget} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </ScrollArea>
  )
}
