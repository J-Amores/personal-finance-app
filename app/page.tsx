"use client"

import { DollarSign, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { FinancialSummaryCard } from "@/components/cards/FinancialSummaryCard"
import { TransactionList } from "@/components/transactions/TransactionList"
import { TransactionFilters } from "@/components/transactions/TransactionFilters"
import { SectionHeader } from "@/components/common/SectionHeader"

import { getBalance, formatCurrency, getTransactions, Balance } from '@/lib/data';
import { useState, useEffect } from "react"

import { Transaction, SortOrder, CategoryFilter } from '@/types/transaction';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Fetch data
  useEffect(() => {
    try {
      const balanceData = getBalance();
      const transactionsData = getTransactions();
      setBalance(balanceData);
      setAllTransactions(transactionsData);
      setFilteredTransactions(transactionsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const categories = [...new Set(allTransactions.map(t => t.category))];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

  const filterTransactions = (transactions: Transaction[], query: string, category: CategoryFilter) => {
    return transactions.filter(transaction => {
      const matchesSearch = query === '' || 
        transaction.name.toLowerCase().includes(query.toLowerCase()) ||
        transaction.category.toLowerCase().includes(query.toLowerCase()) ||
        transaction.amount.toString().includes(query);

      const matchesCategory = category === 'all' || 
        transaction.category.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  };

  const sortTransactions = (transactions: Transaction[], order: SortOrder) => {
    return [...transactions].sort((a, b) => {
      switch (order) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        default: // 'latest'
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const filtered = filterTransactions(allTransactions, value, selectedCategory);
    const sorted = sortTransactions(filtered, sortOrder);
    setFilteredTransactions(sorted);
  };

  const handleSortChange = (value: SortOrder) => {
    setSortOrder(value);
    const filtered = filterTransactions(allTransactions, searchQuery, selectedCategory);
    const sorted = sortTransactions(filtered, value);
    setFilteredTransactions(sorted);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const filtered = filterTransactions(allTransactions, searchQuery, value);
    const sorted = sortTransactions(filtered, sortOrder);
    setFilteredTransactions(sorted);
  };
  return (
    <div className="p-8">
      {error ? (
        <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      ) : null}

      <SectionHeader 
        title="Overview" 
        description="Your financial summary and recent activity"
      />



      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {balance ? (
          <>
            <FinancialSummaryCard
              title="Current Balance"
              amount={balance.current}
              variant="dark"
            />
            <FinancialSummaryCard
              title="Monthly Income"
              amount={balance.income}
              variant="success"
            />
            <FinancialSummaryCard
              title="Monthly Expenses"
              amount={balance.expenses}
              variant="destructive"
            />
          </>
        ) : (
          // Loading skeletons for cards
          <>
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">Your latest financial activity</p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search transactions" 
                  className="pl-10" 
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <TransactionFilters 
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                categories={categories}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionList 
            transactions={filteredTransactions}
            maxHeight="400px"
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href="/transactions" className="flex items-center gap-1">
                View All Transactions
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pots and Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pots Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Pots</CardTitle>
            <Link href="/pots" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
              See Details <ChevronRight size={16} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-md flex items-center justify-center mr-3">
                    <DollarSign size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-600">Total Saved</div>
                </div>
                <div className="text-4xl font-bold">$935</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-emerald-500 rounded-full mr-4"></div>
                    <div>Savings</div>
                  </div>
                  <div className="font-semibold">$159</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-gray-600 rounded-full mr-4"></div>
                    <div>Concert Ticket</div>
                  </div>
                  <div className="font-semibold">$125</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-sky-400 rounded-full mr-4"></div>
                    <div>Gift</div>
                  </div>
                  <div className="font-semibold">$110</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-purple-500 rounded-full mr-4"></div>
                    <div>Holiday</div>
                  </div>
                  <div className="font-semibold">$531</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-orange-300 rounded-full mr-4"></div>
                    <div>New Laptop</div>
                  </div>
                  <div className="font-semibold">$10</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budgets Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Budgets</CardTitle>
            <Link href="/budgets" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
              View All <ChevronRight size={16} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <DonutChart />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-2"></div>
                <span className="text-sm">Entertainment</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-sky-400 rounded-sm mr-2"></div>
                <span className="text-sm">Bills</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-300 rounded-sm mr-2"></div>
                <span className="text-sm">Dining Out</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-600 rounded-sm mr-2"></div>
                <span className="text-sm">Personal Care</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Transactions</CardTitle>
          <Link href="/transactions" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
            View All <ChevronRight size={16} />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center mr-3">
                  <DollarSign size={16} className="text-white" />
                </div>
                <div>Savory Bites Bistro</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">- $55.50</div>
                <div className="text-sm text-gray-500">Aug 19, 2024</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <div className="w-full h-full bg-gray-400"></div>
                </div>
                <div>Emma Richardson</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">+ $75.50</div>
                <div className="text-sm text-gray-500">Aug 19, 2024</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Bills Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Recurring Bills</CardTitle>
          <Link href="/recurring-bills" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
            See Details <ChevronRight size={16} />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">AQ</span>
                </div>
                <div>Aqua Flow Utilities</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">$100.00</div>
                <div className="text-sm text-gray-500">Monthly - 30th</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">EF</span>
                </div>
                <div>EcoFuel Energy</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">$35.00</div>
                <div className="text-sm text-gray-500">Monthly - 29th</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DonutChart() {
  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="20" />
        {/* Dining Out - Largest segment (peach color) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#fcd9bd"
          strokeWidth="20"
          strokeDasharray="125.6 125.6"
          strokeDashoffset="188.4"
          transform="rotate(-90 50 50)"
        />
        {/* Bills - Second largest (blue) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="20"
          strokeDasharray="94.2 157"
          strokeDashoffset="62.8"
          transform="rotate(-90 50 50)"
        />
        {/* Personal Care - Medium (dark gray) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#4b5563"
          strokeWidth="20"
          strokeDasharray="47.1 204.1"
          strokeDashoffset="-31.4"
          transform="rotate(-90 50 50)"
        />
        {/* Entertainment - Smallest (green) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#10b981"
          strokeWidth="20"
          strokeDasharray="15.7 235.5"
          strokeDashoffset="-78.5"
          transform="rotate(-90 50 50)"
        />
        {/* Inner white circle to create donut */}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
    </div>
  )
}
