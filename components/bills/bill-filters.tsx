'use client'

import { BillSortOrder, BillFilters as BillFiltersType } from '@/types/bill'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface BillFiltersProps {
  onSortChange: (sort: BillSortOrder) => void
  onFilterChange: (filters: Partial<BillFiltersType>) => void
  currentSort: BillSortOrder
  currentFilters: Partial<BillFiltersType>
}

export function BillFilters({
  onSortChange,
  onFilterChange,
  currentSort,
  currentFilters,
}: BillFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Sort by</Label>
          <Select
            value={currentSort}
            onValueChange={(value) => onSortChange(value as BillSortOrder)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate-asc">Due Date (Earliest)</SelectItem>
              <SelectItem value="dueDate-desc">Due Date (Latest)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Select
            value={currentFilters.status}
            onValueChange={(value) => onFilterChange({ ...currentFilters, status: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Frequency</Label>
          <Select
            value={currentFilters.frequency}
            onValueChange={(value) => onFilterChange({ ...currentFilters, frequency: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="auto-pay"
          checked={currentFilters.automaticPayment}
          onCheckedChange={(checked) =>
            onFilterChange({ ...currentFilters, automaticPayment: checked })
          }
        />
        <Label htmlFor="auto-pay">Show Auto-Pay Only</Label>
      </div>
    </div>
  )
}
