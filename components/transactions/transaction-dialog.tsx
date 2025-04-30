"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Transaction } from "@/types/transaction"
import { TransactionForm } from "./transaction-form"
import { createTransaction, updateTransaction } from "@/app/actions/transactions"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
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
          onSubmit={async (data) => {
            try {
              if (transaction) {
                const result = await updateTransaction(transaction.id, data)
                if (result.error) throw new Error(result.error)
                toast({
                  title: "Success",
                  description: "Transaction updated successfully",
                })
              } else {
                const result = await createTransaction(data)
                if (result.error) throw new Error(result.error)
                toast({
                  title: "Success",
                  description: "Transaction created successfully",
                })
              }
              router.refresh()
              onOpenChange(false)
            } catch (error) {
              toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save transaction",
                variant: "destructive",
              })
            }
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
