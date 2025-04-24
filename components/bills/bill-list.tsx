'use client'

import { Bill } from '@/types/bill'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, cn } from '@/lib/utils'

interface BillListProps {
  bills: Bill[]
  isLoading?: boolean
  onBillClick?: (bill: Bill) => void
}

export function BillList({ bills, isLoading = false, onBillClick }: BillListProps) {
  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>
  }

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-muted-foreground">
        <p>No bills found</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[600px] rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Auto-Pay</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow 
              key={bill.id} 
              className={cn(onBillClick && "cursor-pointer hover:bg-muted/50")} 
              onClick={() => onBillClick?.(bill)}
            >
              <TableCell className="font-medium">{bill.name}</TableCell>
              <TableCell>{formatCurrency(bill.amount)}</TableCell>
              <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    bill.status === 'paid' ? 'secondary' :
                    bill.status === 'overdue' ? 'destructive' : 'default'
                  }
                >
                  {bill.status}
                </Badge>
              </TableCell>
              <TableCell>{bill.frequency}</TableCell>
              <TableCell>
                {bill.automaticPayment ? (
                  <Badge variant="outline">Auto-Pay On</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">Manual</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
