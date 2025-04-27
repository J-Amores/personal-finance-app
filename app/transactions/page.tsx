'use client'

import { useState } from 'react'
import type { Transaction, SortOrder, CategoryFilter } from '@/types/transaction'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionSearch } from '@/components/transactions/transaction-search'
import { SectionHeader } from '@/components/common/section-header'
import { StatsCard } from '@/components/common/stats-card'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpDown, ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { getTransactions } from '@/lib/transactions'

export default function TransactionsPage() {
  const transactions = getTransactions()
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((t: Transaction) => t.category)))
  // Calculate stats
  const totalTransactions = transactions.length
  const totalIncome = transactions
    .filter((t: Transaction) => t.type === 'income')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
  const totalExpenses = transactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0)
  const netAmount = totalIncome - totalExpenses

  // Apply filters and sorting
  const filteredAndSortedTransactions = transactions
    .filter(transaction => 
      transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(transaction =>
      selectedCategory === 'all' || 
      transaction.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'latest':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'highest':
          return b.amount - a.amount
        case 'lowest':
          return a.amount - b.amount
        default:
          return 0
      }
    })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Transactions"
          value={totalTransactions.toString()}
          icon={Receipt}
          description="Number of transactions"
        />
        <StatsCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={ArrowUpRight}
          description="Total incoming transactions"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={ArrowDownLeft}
          description="Total outgoing transactions"
        />
        <StatsCard
          title="Net Amount"
          value={formatCurrency(netAmount)}
          icon={ArrowUpDown}
          description="Net transaction amount"
        />
      </div>

      <Card>
        <SectionHeader
          title="Transactions"
          description="View and manage your transactions"
        />
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:w-96">
                <TransactionSearch onSearch={setSearchQuery} />
              </div>
              <TransactionFilters
                onSortChange={setSortOrder}
                onCategoryChange={setSelectedCategory}
                selectedSort={sortOrder}
                selectedCategory={selectedCategory}
                categories={categories}
              />
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-[250px] bg-muted animate-pulse rounded" />
                <div className="h-4 w-[200px] bg-muted animate-pulse rounded" />
                <div className="h-4 w-[300px] bg-muted animate-pulse rounded" />
              </div>
            ) : (
              <TransactionList
                transactions={filteredAndSortedTransactions}
                maxHeight="600px"
                isLoading={isLoading}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
