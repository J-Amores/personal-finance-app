'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface TransactionFilters {
  dateRange: {
    from?: Date;
    to?: Date;
  };
  amountRange: {
    min?: number;
    max?: number;
  };
  categories: string[];
  types: ('income' | 'expense')[];
}

interface TransactionFiltersProps {
  categories: string[];
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function TransactionFilters({
  categories,
  filters,
  onChange,
}: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    onChange({
      ...filters,
      dateRange: range,
    });
  };

  const handleAmountRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onChange({
      ...filters,
      amountRange: {
        ...filters.amountRange,
        [field]: numValue,
      },
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleTypeToggle = (type: 'income' | 'expense') => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({
      ...filters,
      types: newTypes,
    });
  };

  const clearFilters = () => {
    onChange({
      dateRange: {},
      amountRange: {},
      categories: [],
      types: [],
    });
    setIsOpen(false);
  };

  const activeFiltersCount = [
    filters.dateRange.from || filters.dateRange.to,
    filters.amountRange.min || filters.amountRange.max,
    filters.categories.length > 0,
    filters.types.length > 0,
  ].filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 rounded-sm px-1 font-normal"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Date Range</h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !filters.dateRange.from &&
                      !filters.dateRange.to &&
                      'text-muted-foreground'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                        {format(filters.dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(filters.dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to,
                  }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Amount Range</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Min Amount</Label>
                <Input
                  id="min"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={filters.amountRange.min || ''}
                  onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Max Amount</Label>
                <Input
                  id="max"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={filters.amountRange.max || ''}
                  onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                />
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    filters.categories.includes(category)
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Transaction Type</h4>
            <div className="flex gap-2">
              <Button
                variant={
                  filters.types.includes('income') ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => handleTypeToggle('income')}
              >
                Income
              </Button>
              <Button
                variant={
                  filters.types.includes('expense') ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => handleTypeToggle('expense')}
              >
                Expense
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
          <Button onClick={() => setIsOpen(false)}>Apply Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
