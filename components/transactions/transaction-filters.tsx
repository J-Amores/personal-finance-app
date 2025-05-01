'use client';

import { SortOrder, CategoryFilter } from '@/types/transaction';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionFiltersProps {
  sortOrder: SortOrder;
  onSortChange: (value: SortOrder) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  categories: string[];
}

export function TransactionFilters({
  sortOrder,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Select value={sortOrder} onValueChange={(value) => onSortChange(value as SortOrder)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="highest">Highest Amount</SelectItem>
          <SelectItem value="lowest">Lowest Amount</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={categoryFilter}
        onValueChange={(value) => onCategoryChange(value as CategoryFilter)}
      >
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
