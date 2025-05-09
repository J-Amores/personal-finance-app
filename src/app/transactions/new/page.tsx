import { TransactionForm } from '@/components/transactions/TransactionForm';

export default function NewTransactionPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">New Transaction</h1>
      <TransactionForm />
    </main>
  );
}
