import { TransactionsClient } from '@/components/transactions/TransactionsClient';

export default function TransactionsPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <TransactionsClient />
    </main>
  );
}
