'use client';

import { Transaction } from '@/types/transaction';
import { type TransactionFormValues } from '@/lib/validations/transaction';
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/use-transactions';
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
  categories: string[];
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  categories,
}: TransactionDialogProps) {
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
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
          onSubmit={async (data: TransactionFormValues) => {
            if (transaction) {
              await updateTransaction.mutateAsync({ id: transaction.id, data });
            } else {
              await createTransaction.mutateAsync(data);
            }
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
