'use client';

import { useState } from 'react';
import { Bill } from '@/types/bills';
import { SectionHeader } from '@/components/common/section-header';
import { BillList } from '@/components/bills/bill-list';
import { BillSearch } from '@/components/bills/bill-search';
import { BillFilters } from '@/components/bills/bill-filters';
import { BillDialog } from '@/components/bills/bill-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { createBill, updateBill, deleteBill } from '@/app/actions/bills';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  'Utilities',
  'Rent/Mortgage',
  'Insurance',
  'Subscriptions',
  'Phone/Internet',
  'Other',
];

interface BillsClientProps {
  initialBills: Bill[];
}

export function BillsClient({ initialBills }: BillsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | undefined>();

  // Filter and sort bills
  const filteredBills = bills
    .filter((bill) => {
      const matchesSearch = bill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || bill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Calculate stats
  const stats = {
    total: bills.reduce((sum, bill) => sum + bill.amount, 0),
    paid: {
      count: bills.filter(b => b.isPaid).length,
      amount: bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0),
    },
    unpaid: {
      count: bills.filter(b => !b.isPaid).length,
      amount: bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0),
    },
  };

  const handleCreate = async (data: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      startTransition(async () => {
        const result = await createBill({
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
        });
        if (result.error) throw new Error(result.error);
        if (result.data) {
          setBills((prev) => [...prev, {
            ...result.data,
            dueDate: new Date(result.data.dueDate).toISOString(),
            createdAt: new Date(result.data.createdAt).toISOString(),
            updatedAt: new Date(result.data.updatedAt).toISOString(),
          }]);
          setDialogOpen(false);
        }
      });
    } catch (err) {
      setError('Failed to create bill');
      console.error(err);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Bill>) => {
    try {
      setError(null);
      startTransition(async () => {
        const result = await updateBill(id, {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        });
        if (result.error) throw new Error(result.error);
        if (result.data) {
          setBills((prev) => prev.map((bill) => (bill.id === id ? {
            ...result.data,
            dueDate: new Date(result.data.dueDate).toISOString(),
            createdAt: new Date(result.data.createdAt).toISOString(),
            updatedAt: new Date(result.data.updatedAt).toISOString(),
          } : bill)));
          setDialogOpen(false);
        }
      });
    } catch (err) {
      setError('Failed to update bill');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteBill(id);
      if (result.error) throw new Error(result.error);
      setBills((prev) => prev.filter((bill) => bill.id !== id));
      router.refresh();
    } catch (err) {
      setError('Failed to delete bill');
      console.error(err);
    }
  };

  const handleTogglePaid = async (bill: Bill) => {
    try {
      setError(null);
      startTransition(async () => {
        const result = await updateBill(bill.id, {
          isPaid: !bill.isPaid,
        });
        if (result.error) throw new Error(result.error);
        if (result.data) {
          setBills((prev) => prev.map((b) => (b.id === bill.id ? {
            ...result.data,
            dueDate: new Date(result.data.dueDate).toISOString(),
            createdAt: new Date(result.data.createdAt).toISOString(),
            updatedAt: new Date(result.data.updatedAt).toISOString(),
          } : b)));
        }
      });
    } catch (err) {
      setError('Failed to update bill status');
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        title="Bills"
        description="Manage your bills and recurring payments"
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <BillSearch value={searchQuery} onChange={setSearchQuery} />
          <BillFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-card rounded-lg border">
          <div className="text-sm font-medium text-muted-foreground">Total Bills</div>
          <div className="text-2xl font-bold">${stats.total.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <div className="text-sm font-medium text-muted-foreground">Paid</div>
          <div className="text-2xl font-bold">${stats.paid.amount.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{stats.paid.count} bills</div>
        </div>
        <div className="p-4 bg-card rounded-lg border">
          <div className="text-sm font-medium text-muted-foreground">Unpaid</div>
          <div className="text-2xl font-bold">${stats.unpaid.amount.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">{stats.unpaid.count} bills</div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md mb-4">
          {error}
        </div>
      )}

      <BillList
        bills={filteredBills}
        onEdit={(bill: Bill) => {
          setSelectedBill(bill);
          setDialogOpen(true);
        }}
        onDelete={handleDelete}
        onTogglePaid={handleTogglePaid}
      />

      <BillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bill={selectedBill}
        onSubmit={selectedBill ? 
          (data) => handleUpdate(selectedBill.id, data) : 
          handleCreate}
        categories={categories}
      />
    </div>
  );
}
