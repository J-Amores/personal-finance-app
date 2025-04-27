'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Receipt } from 'lucide-react'
import { Bill } from '@/types/bills'
import { BillForm } from '@/components/bills/bill-form'
import { RecurringBillList } from '@/components/recurring-bills/recurring-bill-list'
import { 
  getRecurringBills,
  saveRecurringBill,
  sortRecurringBills,
  filterRecurringBills,
  getRecurringBillStats,
} from '@/lib/recurring-bills'
import { Dialog } from '@/components/ui/dialog'

export default function RecurringBillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [stats, setStats] = useState({
    total: 0,
    paid: { count: 0, amount: 0 },
    upcoming: { count: 0, amount: 0 },
    overdue: { count: 0, amount: 0 },
  })
  const [selectedBill, setSelectedBill] = useState<Bill | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const loadBills = () => {
      const allBills = getRecurringBills()
      const sortedBills = sortRecurringBills(allBills, sortOrder)
      setBills(sortedBills)
      setStats(getRecurringBillStats())
    }

    loadBills()
  }, [sortOrder])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const allBills = getRecurringBills()
    const filteredBills = filterRecurringBills(allBills, query)
    const sortedBills = sortRecurringBills(filteredBills, sortOrder)
    setBills(sortedBills)
  }

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newOrder)
  }

  const handleSubmit = (bill: Bill) => {
    saveRecurringBill(bill)
    const allBills = getRecurringBills()
    const filteredBills = filterRecurringBills(allBills, searchQuery)
    const sortedBills = sortRecurringBills(filteredBills, sortOrder)
    setBills(sortedBills)
    setStats(getRecurringBillStats())
    setIsFormOpen(false)
    setSelectedBill(undefined)
  }

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill)
    setIsFormOpen(true)
  }
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recurring Bills</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          Add Recurring Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-zinc-900 text-white mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Receipt className="h-6 w-6" />
                <CardTitle className="text-sm font-medium">Total bills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">${stats.total.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Bills</span>
                  <span className="font-medium">{stats.paid.count} (${stats.paid.amount.toFixed(2)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Upcoming</span>
                  <span className="font-medium">{stats.upcoming.count} (${stats.upcoming.amount.toFixed(2)})</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Due Soon</span>
                  <span className="font-medium">{stats.overdue.count} (${stats.overdue.amount.toFixed(2)})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bills"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by</span>
              <Button
                variant="outline"
                className="flex items-center"
                onClick={handleSort}
              >
                {sortOrder === 'desc' ? 'Latest' : 'Oldest'}
                <span className="ml-2">{sortOrder === 'desc' ? '▼' : '▲'}</span>
              </Button>
            </div>
          </div>

          <RecurringBillList bills={bills} onBillClick={handleBillClick} />

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <BillForm
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleSubmit}
              bill={selectedBill}
            />
          </Dialog>
        </div>
      </div>
    </div>
  )
}
