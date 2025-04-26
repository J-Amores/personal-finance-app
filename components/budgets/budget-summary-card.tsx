'use client'

import { BudgetSummary } from '@/types/budget'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { PieChart, DollarSign, TrendingDown } from 'lucide-react'

interface BudgetSummaryCardProps {
  summary: BudgetSummary
}

export function BudgetSummaryCard({ summary }: BudgetSummaryCardProps) {
  const stats = [
    {
      title: 'Total Budget',
      value: formatCurrency(summary.totalBudget),
      icon: PieChart,
      className: 'text-blue-500'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(summary.totalSpent),
      icon: DollarSign,
      className: 'text-green-500'
    },
    {
      title: 'Remaining',
      value: formatCurrency(summary.remainingBudget),
      icon: TrendingDown,
      className: summary.remainingBudget < 0 ? 'text-red-500' : 'text-yellow-500'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.title} className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.className}`} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
