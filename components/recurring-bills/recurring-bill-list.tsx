'use client'

import { Bill } from '@/types/bills'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface RecurringBillListProps {
  bills: Bill[]
  onBillClick?: (bill: Bill) => void
}

export function RecurringBillList({ bills, onBillClick }: RecurringBillListProps) {
  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'overdue':
        return 'text-red-500'
      default:
        return 'text-yellow-500'
    }
  }

  const getStatusIcon = (status: Bill['status']) => {
    switch (status) {
      case 'paid':
        return '✓'
      case 'overdue':
        return '⚠️'
      default:
        return '⏰'
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 text-sm text-gray-500 mb-4">
          <div>Bill Title</div>
          <div className="text-center">Due Date</div>
          <div className="text-right">Amount</div>
        </div>

        <div className="space-y-6">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={cn(
                'flex items-center cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors',
                onBillClick && 'cursor-pointer'
              )}
              onClick={() => onBillClick?.(bill)}
            >
              <div className="flex items-center flex-1">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center mr-3',
                  bill.status === 'paid' ? 'bg-green-600' :
                  bill.status === 'overdue' ? 'bg-red-600' :
                  'bg-yellow-600'
                )}>
                  <span className="text-white text-xs">
                    {bill.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>{bill.name}</div>
              </div>
              <div className={cn(
                'flex-1 text-center text-sm',
                getStatusColor(bill.status)
              )}>
                {bill.frequency} - {format(new Date(bill.dueDate), 'do')} {getStatusIcon(bill.status)}
              </div>
              <div className={cn(
                'flex-1 text-right font-semibold',
                bill.status === 'overdue' && 'text-red-500'
              )}>
                ${bill.amount.toFixed(2)}
              </div>
            </div>
          ))}

          {bills.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No recurring bills found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
