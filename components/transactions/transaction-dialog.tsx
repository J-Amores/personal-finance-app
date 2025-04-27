"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Transaction } from "@/types/transaction"
import { TransactionForm } from "./transaction-form"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
  onSubmit: (data: Transaction) => void
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
}: TransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit" : "Create"} Transaction
          </DialogTitle>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSubmit={(data) => {
            onSubmit(data)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
