'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { SectionHeader } from '@/components/common/section-header';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionSearch } from '@/components/transactions/transaction-search';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import SpendingTrendsChart from '@/components/transactions/spending-trends-chart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTransactions, useDeleteTransaction } from '@/hooks/use-transactions';

const categories = [
  'Groceries',
  'Transportation',
  'Entertainment',
  'Bills',
  'Shopping',
  'Healthcare',
  'Other',
];



interface TransactionsClientProps {}

export function TransactionsClient({}: TransactionsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    category: 'all',
    amount: 'all'
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  const { data: transactionsData, error: transactionsError } = useTransactions({
    query: searchQuery,
    category: filters.category !== 'all' ? filters.category : undefined,
    sortOrder: sortOrder,
  });

  const deleteTransactionMutation = useDeleteTransaction();







  // Handle transaction deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteTransactionMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  // Handle transaction edit
  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Transactions"
          description="Manage your transactions and track your spending."
        />

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="space-y-4">
        {transactionsError && (
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
            Failed to load transactions
          </div>
        )}

        <div className="space-y-6">
          <SpendingTrendsChart transactions={transactionsData?.data || []} />
          <TransactionList
            transactions={transactionsData?.data || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSortChange={(column, order) => {
              setSortColumn(column);
              setSortOrder(order);
            }}
            onFilterChange={(column, value) => {
              setFilters(prev => ({
                ...prev,
                [column]: value
              }));
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
        categories={categories}
      />
    </div>
  );
}
