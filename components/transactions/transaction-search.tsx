'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface TransactionSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function TransactionSearch({ onSearch, placeholder = 'Search transactions...' }: TransactionSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
