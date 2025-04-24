'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface BillSearchProps {
  onSearch: (query: string) => void
}

export function BillSearch({ onSearch }: BillSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search bills..."
        className="pl-8"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
