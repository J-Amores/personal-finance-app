'use client';

import { formatDate } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Transaction } from '@/types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  maxHeight?: string;
  showScrollbar?: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}

export function TransactionList({ 
  transactions,
  maxHeight = "400px",
  showScrollbar = true,
  isLoading = false,
  searchQuery = ''
}: TransactionListProps) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(value));
  };

  return (
    <div className="relative w-full" style={{ height: maxHeight }}>
      <ScrollArea className="h-full w-full" scrollHideDelay={0}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-6 w-6 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="ml-2">Loading transactions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg
                        className="h-12 w-12 mb-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      {searchQuery ? (
                        <p>No transactions found matching "{searchQuery}"</p>
                      ) : (
                        <p>No transactions found</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : null}
              <TableRow>
                <TableHead>Recipient/Sender</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={transaction.avatar.replace('./', '/')} 
                        alt={transaction.name}
                      />
                      <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>{transaction.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{transaction.category}</Badge>
                </TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : ''}`}>
                  {transaction.amount > 0 ? '+ ' : ''}{formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
