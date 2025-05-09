'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useTransactions } from '@/hooks/use-transactions';

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
  const { transactions } = useTransactions();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [category, setCategory] = useState<string>('all');
  
  const categories = transactions.data ? 
    Array.from(new Set(transactions.data.map(t => t.category))) : [];
  
  const filteredTransactions = transactions.data?.filter(transaction => {
    const matchesSearch = search === '' || 
      transaction.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || 
      transaction.category === category;
    return matchesSearch && matchesCategory;
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

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
  };
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

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
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Category</span>
                <select
                  className="form-select border rounded-md px-3 py-2"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
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
