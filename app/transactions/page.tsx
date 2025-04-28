'use client'

import { useState } from 'react'
import type { Transaction, SortOrder, CategoryFilter } from '@/types/transaction'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionSearch } from '@/components/transactions/transaction-search'
import { TransactionStats } from '@/components/transactions/transaction-stats'
import { SectionHeader } from '@/components/common/section-header'
import { getTransactions, saveTransaction } from '@/lib/transactions'
import { useToast } from '@/components/ui/use-toast'

export default function TransactionsPage() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions())
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((t: Transaction) => t.category)))

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

  const handleCreateTransaction = (transaction: Transaction) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() }
    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    saveTransaction(newTransaction)
  }

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    )
    setTransactions(updatedTransactions)
    saveTransaction(updatedTransaction)
  }

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id)
    setTransactions(updatedTransactions)
    // Delete operation handled by lib/transactions
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <SectionHeader
          title="Transactions"
          description="Manage your transactions and track your spending."
        />
      </div>

      <TransactionStats transactions={transactions} />

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
            isLoading={isLoading}
            searchQuery={searchQuery}
            onTransactionCreate={handleCreateTransaction}
            onTransactionUpdate={handleUpdateTransaction}
            onTransactionDelete={handleDeleteTransaction}
          />
        </div>
      </div>
    </div>
  )
}
