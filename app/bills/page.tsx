import { getBills } from '@/app/actions/bills';
import { BillsClient } from '@/components/bills/bills-client';

export default async function BillsPage() {
  // Fetch initial bills from the server
  const result = await getBills();
  const initialBills = (result.data || []).map(bill => ({
    ...bill,
    dueDate: bill.dueDate.toISOString(),
    createdAt: bill.createdAt.toISOString(),
    updatedAt: bill.updatedAt.toISOString(),
  }));

  return <BillsClient initialBills={initialBills} />;
}
