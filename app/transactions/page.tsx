'use client';

import { useState, useEffect } from 'react';
import { Transaction, SortOrder, CategoryFilter } from '@/types/transaction';

type TransactionInput = {
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: Date;
};
import { SectionHeader } from '@/components/common/section-header';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionSearch } from '@/components/transactions/transaction-search';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '@/app/actions/transactions';
import { useRouter } from 'next/navigation';

const categories = [
  'Groceries',
  'Transportation',
  'Entertainment',
  'Bills',
  'Shopping',
  'Healthcare',
  'Other',
];

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  // Load transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const result = await getTransactions(searchQuery, categoryFilter, sortOrder);
        if (result.error) {
          setError(result.error);
        } else {
          setTransactions(result.data || []);
          setError(null);
        }
      } catch (err) {
        setError('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [searchQuery, categoryFilter, sortOrder]);

  // Handle transaction submission
  const handleSubmit = async (formData: Partial<Transaction>) => {
    try {
      // Ensure required fields
      if (!formData.description || !formData.amount || !formData.category || !formData.type || !formData.date) {
        throw new Error('Please fill in all required fields');
      }
      
      const transactionInput: TransactionInput = {
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
        type: formData.type,
        date: formData.date
      };
      
      if (selectedTransaction) {
        // Update existing transaction
        const result = await updateTransaction(selectedTransaction.id, transactionInput);
        if (result.error) throw new Error(result.error);
      } else {
        // Create new transaction
        const result = await createTransaction(transactionInput);
        if (result.error) throw new Error(result.error);
      }
      
      // Refresh transactions and close dialog
      router.refresh();
      setDialogOpen(false);
      setSelectedTransaction(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction');
    }
  };

  // Handle transaction deletion
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteTransaction(id);
      if (result.error) {
        throw new Error(result.error);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TransactionSearch
            value={searchQuery}
            onChange={handleSearch}
          />
          <TransactionFilters
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
