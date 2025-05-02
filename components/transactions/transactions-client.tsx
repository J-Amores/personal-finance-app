'use client';

import { useState, useEffect } from 'react';
import { Transaction, SortOrder, CategoryFilter } from '@/types/transaction';
import { SectionHeader } from '@/components/common/section-header';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionSearch } from '@/components/transactions/transaction-search';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import SpendingTrendsChart from '@/components/transactions/spending-trends-chart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createTransaction, updateTransaction, deleteTransaction, getTransactions } from '@/app/actions/transactions';
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

type TransactionInput = {
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: Date;
};

interface TransactionsClientProps {
  initialTransactions: Transaction[];
}

export function TransactionsClient({ initialTransactions }: TransactionsClientProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    category: 'all',
    amount: 'all'
  });
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

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

  // Load and filter transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setError(null);
        const result = await getTransactions({
          query: searchQuery,
          category: filters.category !== 'all' ? filters.category : undefined,
          sortOrder: sortOrder,
        });
        
        if (result.error) {
          setError(result.error);
          return;
        }

        let filteredData = result.data || [];
        
        // Apply amount filter
        if (filters.amount === 'positive') {
          filteredData = filteredData.filter(t => t.amount > 0);
        } else if (filters.amount === 'negative') {
          filteredData = filteredData.filter(t => t.amount < 0);
        }
        
        // Apply sorting
        filteredData.sort((a, b) => {
          const multiplier = sortOrder === 'asc' ? 1 : -1;
          if (sortColumn === 'date') {
            return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
          } else if (sortColumn === 'amount') {
            return multiplier * (a.amount - b.amount);
          }
          return 0;
        });
        
        setTransactions(filteredData);
      } catch (err) {
        setError('Failed to load transactions');
        console.error('Error loading transactions:', err);
      }
    };

    loadTransactions();
  }, [searchQuery, filters, sortColumn, sortOrder]);



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
        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <SpendingTrendsChart transactions={transactions} />
          <TransactionList
            transactions={transactions}
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
        onSubmit={handleSubmit}
        categories={categories}
      />
    </div>
  );
}
