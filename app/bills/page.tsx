import { getBills } from '@/app/actions/bills';
import { BillsClient } from '@/components/bills/bills-client';
import { BillsTimeline } from '@/components/bills/charts/BillsTimeline';
import { AlertCircle, Plus } from 'lucide-react';

export default async function BillsPage() {
  // Fetch initial bills from the server
  const result = await getBills();
  const bills = result.data || [];
  const initialBills = bills.map(bill => ({
    id: bill.id,
    name: bill.name,
    amount: bill.amount,
    category: bill.category,
    dueDate: bill.dueDate.toISOString(),
    frequency: 'monthly' as 'monthly' | 'weekly' | 'yearly' | 'once',
    status: (bill.isPaid ? 'paid' : bill.dueDate < new Date() ? 'overdue' : 'pending') as 'paid' | 'pending' | 'overdue',
    automaticPayment: false,
    notes: '',
    createdAt: bill.createdAt.toISOString(),
    updatedAt: bill.updatedAt.toISOString()
  }));

  return (
    <div>
      <div className="mb-6">
        <BillsTimeline />
      </div>
      <BillsClient initialBills={initialBills} />
    </div>
  );
}
