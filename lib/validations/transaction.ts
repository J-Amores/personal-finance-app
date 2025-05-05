import * as z from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Please select a transaction type',
  }),
  category: z.string().min(1, 'Category is required'),
  date: z.date({
    required_error: 'Please select a date',
  }),
  notes: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
