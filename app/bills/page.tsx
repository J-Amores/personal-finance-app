'use client'

import { useState } from 'react'
import { Bill, BillSortOrder, BillFilters as BillFiltersType } from '@/types/bill'
import { BillList } from '@/components/bills/bill-list'
import { BillFilters } from '@/components/bills/bill-filters'
import { BillDialog } from '@/components/bills/bill-dialog'
import { BillSearch } from '@/components/bills/bill-search'
import { SectionHeader } from '@/components/common/section-header'
import { StatsCard } from '@/components/common/stats-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircle, Receipt, AlertCircle, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Temporary mock data - replace with actual API call
const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Electricity Bill',
    amount: 150.00,
    dueDate: '2025-05-15',
    category: 'Utilities',
    status: 'pending',
    frequency: 'monthly',
    automaticPayment: true,
  },
  {
    id: '2',
    name: 'Internet Service',
    amount: 89.99,
    dueDate: '2025-05-01',
    category: 'Utilities',
    status: 'paid',
    frequency: 'monthly',
    automaticPayment: true,
  },
  {
    id: '3',
    name: 'Car Insurance',
    amount: 210.50,
    dueDate: '2025-04-20',
    category: 'Insurance',
    status: 'overdue',
    frequency: 'quarterly',
    automaticPayment: false,
  },
]

export default function BillsPage() {
  const [sortOrder, setSortOrder] = useState<BillSortOrder>('dueDate-asc')
  const [filters, setFilters] = useState<Partial<BillFiltersType>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [bills, setBills] = useState<Bill[]>(mockBills)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState<Bill | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const handleCreateBill = (newBill: Partial<Bill>) => {
    const bill: Bill = {
      ...newBill as Omit<Bill, 'id'>,
      id: Math.random().toString(36).substr(2, 9)
    }
    setBills([...bills, bill])
    setDialogOpen(false)
  }

  const handleUpdateBill = (updatedBill: Partial<Bill>) => {
    setBills(bills.map(bill => 
      bill.id === selectedBill?.id ? { ...bill, ...updatedBill } : bill
    ))
    setDialogOpen(false)
    setSelectedBill(undefined)
  }

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill)
    setDialogOpen(true)
  }

  // Calculate stats
  const totalBills = bills.length
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const overdueBills = bills.filter(bill => bill.status === 'overdue').length
  const autoPayEnabled = bills.filter(bill => bill.automaticPayment).length

  // Apply filters and sorting
  const filteredAndSortedBills = bills
    .filter(bill => 
      bill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((bill) => {
      if (filters.status && filters.status !== 'all' && bill.status !== filters.status) return false
      if (filters.frequency && filters.frequency !== 'all' && bill.frequency !== filters.frequency) return false
      if (filters.automaticPayment !== undefined && bill.automaticPayment !== filters.automaticPayment) return false
      return true
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'dueDate-asc':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'dueDate-desc':
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        case 'amount-asc':
          return a.amount - b.amount
        case 'amount-desc':
          return b.amount - a.amount
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bills"
          value={totalBills.toString()}
          icon={Receipt}
          description="Active recurring bills"
        />
        <StatsCard
          title="Monthly Total"
          value={formatCurrency(totalAmount)}
          icon={CreditCard}
          description="Total monthly payments"
        />
        <StatsCard
          title="Overdue"
          value={overdueBills.toString()}
          icon={AlertCircle}
          description="Bills past due date"
        />
        <StatsCard
          title="Auto-Pay Enabled"
          value={autoPayEnabled.toString()}
          icon={Receipt}
          description="Bills on automatic payment"
        />
      </div>

      <Card>
        <SectionHeader
          title="Recurring Bills"
          description="Manage your recurring bills and payments"
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Bill
            </Button>
          }
        />
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:w-96">
                <BillSearch onSearch={setSearchQuery} />
              </div>
              <BillFilters
                onSortChange={setSortOrder}
                onFilterChange={setFilters}
                currentSort={sortOrder}
                currentFilters={filters}
              />
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
            ) : (
              <BillList
                bills={filteredAndSortedBills}
                isLoading={isLoading}
                onBillClick={handleBillClick}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <BillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bill={selectedBill}
        onSubmit={selectedBill ? handleUpdateBill : handleCreateBill}
      />
    </div>
  )
}
