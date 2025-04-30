'use client'

import { useState } from 'react'
import type { Transaction, SortOrder, CategoryFilter } from '@/types/transaction'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionSearch } from '@/components/transactions/transaction-search'

interface TransactionContainerProps {
  initialTransactions: Transaction[]
}

export function TransactionContainer({ initialTransactions }: TransactionContainerProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Get unique categories
  const categories = Array.from(new Set(initialTransactions.map((t) => t.category)))

  // Apply filters and sorting
  const filteredAndSortedTransactions = initialTransactions
    .filter(transaction => 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(transaction =>
      selectedCategory === 'all' || 
      transaction.category.toLowerCase() === selectedCategory.toLowerCase()
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'latest':
          return b.date.getTime() - a.date.getTime()
        case 'oldest':
          return a.date.getTime() - b.date.getTime()
        case 'highest':
          return b.amount - a.amount
        case 'lowest':
          return a.amount - b.amount
        default:
          return 0
      }
    })

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TransactionSearch
            onSearch={setSearchQuery}
            placeholder="Search transactions..."
          />
          <TransactionFilters
            onSortChange={setSortOrder}
            onCategoryChange={setSelectedCategory}
            selectedSort={sortOrder}
            selectedCategory={selectedCategory}
            categories={categories}
          />
        </div>

        <TransactionList
          transactions={filteredAndSortedTransactions}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
}
