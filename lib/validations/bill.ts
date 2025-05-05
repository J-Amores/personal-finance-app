import * as z from 'zod';

export const billSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  category: z.string().min(1, 'Category is required'),
  frequency: z.enum(['monthly', 'weekly', 'yearly', 'once'], {
    required_error: 'Please select a frequency',
  }),
  status: z.enum(['paid', 'pending', 'overdue'], {
    required_error: 'Please select a status',
  }),
  notes: z.string().optional(),
  automaticPayment: z.boolean().default(false),
});

export type BillFormValues = z.infer<typeof billSchema>;
