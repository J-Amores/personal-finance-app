'use client';

import { SortOrder, CategoryFilter } from '@/types/transaction';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionFiltersProps {
  sortOrder: SortOrder;
  onSortChange: (value: SortOrder) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  categories: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  transactionType: 'all' | 'income' | 'expense';
  onTransactionTypeChange: (value: 'all' | 'income' | 'expense') => void;
}

export function TransactionFilters({
  sortOrder,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  categories,
  startDate,
  endDate,
  onDateChange,
  transactionType,
  onTransactionTypeChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Category Filter */}
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
