'use client'

import { useState } from 'react'
import { Bill } from '@/types/bill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface BillFormProps {
  bill?: Bill
  onSubmit: (bill: Partial<Bill>) => void
  onCancel: () => void
}

export function BillForm({ bill, onSubmit, onCancel }: BillFormProps) {
  const [formData, setFormData] = useState<Partial<Bill>>({
    name: bill?.name || '',
    amount: bill?.amount || 0,
    dueDate: bill?.dueDate || format(new Date(), 'yyyy-MM-dd'),
    category: bill?.category || '',
    frequency: bill?.frequency || 'monthly',
    automaticPayment: bill?.automaticPayment || false,
    notes: bill?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Bill Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dueDate ? format(new Date(formData.dueDate), 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dueDate ? new Date(formData.dueDate) : new Date()}
                onSelect={(date) => date && setFormData({ ...formData, dueDate: format(date, 'yyyy-MM-dd') })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label>Frequency</Label>
          <Select
            value={formData.frequency}
            onValueChange={(value) => setFormData({ ...formData, frequency: value as Bill['frequency'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="automaticPayment"
            checked={formData.automaticPayment}
            onCheckedChange={(checked) => setFormData({ ...formData, automaticPayment: checked })}
          />
          <Label htmlFor="automaticPayment">Automatic Payment</Label>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {bill ? 'Update Bill' : 'Create Bill'}
        </Button>
      </div>
    </form>
  )
}
