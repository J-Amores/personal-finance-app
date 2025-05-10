'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react"
import { TransactionFilters, type TransactionFilters as TransactionFiltersType } from '@/components/transactions/transaction-filters';
import { useTransactions } from '@/hooks/use-transactions';
import { TransactionDialog } from '@/components/transactions/transaction-dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const categoryAvatars: Record<string, string> = {
  'Income': 'james-thompson',
  'Bills': 'spark-electric-solutions',
  'Shopping': 'sofia-peterson',
  'Groceries': 'emma-richardson',
  'Entertainment': 'savory-bites-bistro',
  'Transportation': 'urban-services-hub',
  'General': 'daniel-carter'
};

export default function TransactionsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { transactions, deleteTransaction } = useTransactions();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [filters, setFilters] = useState<TransactionFilters>({
    dateRange: {},
    amountRange: {},
    categories: [],
    types: [],
  });
  
  const categories = transactions.data ? 
    Array.from(new Set(transactions.data.map(t => t.category))) : [];
  
  const filteredTransactions = transactions.data?.filter(transaction => {
    // Search filter
    const matchesSearch = search === '' || 
      transaction.description.toLowerCase().includes(search.toLowerCase());

    // Date range filter
    const date = new Date(transaction.date);
    const matchesDateRange = 
      (!filters.dateRange.from || date >= filters.dateRange.from) &&
      (!filters.dateRange.to || date <= filters.dateRange.to);

    // Amount range filter
    const amount = Math.abs(transaction.amount);
    const matchesAmountRange =
      (!filters.amountRange.min || amount >= filters.amountRange.min) &&
      (!filters.amountRange.max || amount <= filters.amountRange.max);

    // Categories filter
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(transaction.category);

    // Transaction type filter
    const matchesType =
      filters.types.length === 0 ||
      filters.types.includes(transaction.type);

    return (
      matchesSearch &&
      matchesDateRange &&
      matchesAmountRange &&
      matchesCategory &&
      matchesType
    );
  }) ?? [];

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleSort = () => {
    setSortBy(sortBy === 'latest' ? 'oldest' : 'latest');
  };


  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <TransactionDialog 
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          }
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search transaction" 
                className="pl-10" 
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by</span>
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={toggleSort}
                >
                  {sortBy === 'latest' ? 'Latest' : 'Oldest'} <span className="ml-2">▼</span>
                </Button>
              </div>
              <TransactionFilters
                categories={categories}
                filters={filters}
                onChange={setFilters}
              />
            </div>
          </div>

          {transactions.isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : transactions.isError ? (
            <div className="text-red-500 text-center py-8">
              Error loading transactions
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="py-4">
                      <td className="py-4">
                        <div className="flex items-center">
                          <img 
                            src={`/assets/images/avatars/${categoryAvatars[transaction.category] || 'default-avatar'}.jpg`}
                            alt={transaction.description}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = '/assets/images/avatars/default-avatar.jpg';
                            }}
                          />
                          <div>{transaction.description}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${transaction.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-4">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="py-4 text-right">
                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 pl-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Open menu</span>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                              >
                                <path
                                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <TransactionDialog
                              transaction={transaction}
                              trigger={
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              }
                            />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteId(transaction.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 bg-zinc-900 text-white">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                3
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                4
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                5
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
