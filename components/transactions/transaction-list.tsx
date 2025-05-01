'use client';

import { useState } from 'react';
import { Transaction, SortOrder, CategoryFilter } from '@/types/transaction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2, Trash2, ChevronDown, ArrowUpDown, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { categoryAvatars } from '@/lib/category-avatars';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onSortChange: (column: string, order: 'asc' | 'desc') => void;
  onFilterChange: (column: string, value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  onSortChange,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: TransactionListProps) {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2 w-full">
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Filter by description..."
                    className="w-full bg-transparent focus:outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        onSearchChange('');
                      }
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  )}
                </div>
              </TableHead>
              <TableHead>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center hover:text-foreground/80">
                    Category
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => onFilterChange('category', 'all')}>All Categories</DropdownMenuItem>
                    {Array.from(new Set(transactions.map(t => t.category))).map(category => (
                      <DropdownMenuItem key={category} onSelect={() => onFilterChange('category', category)}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="h-8 p-0" onClick={() => onSortChange('date', 'desc')}>
                  Date
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center hover:text-foreground/80 ml-auto">
                    Amount
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => onFilterChange('amount', 'all')}>All Amounts</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onFilterChange('amount', 'positive')}>Income Only</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onFilterChange('amount', 'negative')}>Expenses Only</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onSortChange('amount', 'desc')}>Highest First</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onSortChange('amount', 'asc')}>Lowest First</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/assets/images/avatars/${transaction.description.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                          alt={transaction.description}
                        />
                        <AvatarFallback className={transaction.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {transaction.description[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {transaction.description}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.type === 'income'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(transaction)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
