'use client'

import { Budget, BudgetProgress } from '@/types/budget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { BudgetActions } from './budget-actions'

interface BudgetCardProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (budget: Budget) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const progress: BudgetProgress = {
    percentage: (budget.spent / budget.amount) * 100,
    status: budget.spent >= budget.amount ? 'over' : 
           budget.spent / budget.amount > 0.8 ? 'near' : 'under'
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {budget.category}
        </CardTitle>
        <div className="flex items-center gap-2">
        <Badge 
          variant={progress.status === 'over' ? 'destructive' : 
                 progress.status === 'near' ? 'secondary' : 'default'}
        >
          {progress.status === 'over' ? 'Over Budget' :
           progress.status === 'near' ? 'Near Limit' : 'On Track'}
        </Badge>
        <BudgetActions budget={budget} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(budget.spent)} 
          <span className="text-sm text-muted-foreground">
            / {formatCurrency(budget.amount)}
          </span>
        </div>
        <Progress 
          value={Math.min(progress.percentage, 100)} 
          className={`mt-2 [&>div]:bg-[${budget.color}]`}
        />
        <div className="mt-2 text-xs text-muted-foreground">
          {budget.period === 'monthly' ? 'Monthly' : 'Yearly'} Budget
        </div>
      </CardContent>
    </Card>
  )
}
