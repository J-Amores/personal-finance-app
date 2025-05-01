'use client';

import { Transaction } from '@/types/transaction';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionForm } from './transaction-form';

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
  categories: string[];
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  categories,
}: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
