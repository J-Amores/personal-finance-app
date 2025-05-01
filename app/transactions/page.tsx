import { getTransactions } from '@/app/actions/transactions';
import { TransactionsClient } from '@/components/transactions/transactions-client';

export default async function TransactionsPage() {
  // Fetch initial transactions from the server
  const result = await getTransactions();
  const initialTransactions = result.data || [];

  return <TransactionsClient initialTransactions={initialTransactions} />;
}
