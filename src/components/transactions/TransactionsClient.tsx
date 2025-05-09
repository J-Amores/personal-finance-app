'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { TransactionList } from '@/components/transactions/TransactionList';

export function TransactionsClient() {
  const { data: transactions, isLoading } = useTransactions();

  return <TransactionList transactions={transactions ?? []} isLoading={isLoading} />;
}
