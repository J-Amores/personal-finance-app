'use client'

import { Bill } from '@/types/bill'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BillForm } from './bill-form'

interface BillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill?: Bill
  onSubmit: (bill: Partial<Bill>) => void
}

export function BillDialog({
  open,
  onOpenChange,
  bill,
  onSubmit,
}: BillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{bill ? 'Edit Bill' : 'Create New Bill'}</DialogTitle>
        </DialogHeader>
        <BillForm
          bill={bill}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
