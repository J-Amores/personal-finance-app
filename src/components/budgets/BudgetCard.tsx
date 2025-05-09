import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, AlertTriangle, Calendar } from "lucide-react"
import { type Budget } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BudgetCardProps {
  budget: Budget
  onEdit: (budget: Budget) => void
  onDelete: (id: string) => void
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const spent = budget.spent || 0
  const remaining = budget.amount - spent
  const progress = (spent / budget.amount) * 100
  const isOverBudget = spent > budget.amount
  const isNearLimit = !isOverBudget && progress >= (budget.alerts?.threshold || 80)

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500'
    if (isNearLimit) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const formatPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-3 h-3 rounded-full", getProgressColor())} />
              <h3 className="text-lg font-semibold">{budget.name}</h3>
              {(isOverBudget || isNearLimit) && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatPeriod(budget.period)}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(budget)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(budget.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-2">
          <div className="text-sm text-gray-500">
            Budget: {formatCurrency(budget.amount)}
          </div>
        </div>

        <div className="mb-4">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                getProgressColor()
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Spent</div>
            <div className={cn(
              "text-xl font-bold",
              isOverBudget && "text-red-600"
            )}>
              {formatCurrency(spent)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Remaining</div>
            <div className={cn(
              "text-xl font-bold",
              isOverBudget && "text-red-600"
            )}>
              {formatCurrency(remaining)}
            </div>
          </div>
        </div>

        {budget.notes && (
          <div className="mt-4 text-sm text-gray-500">
            <p>{budget.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
