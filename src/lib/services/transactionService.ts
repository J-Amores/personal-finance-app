import { Transaction } from '@/lib/db';

export type CreateTransactionInput = Omit<Transaction, 'id'>;
export type UpdateTransactionInput = Partial<CreateTransactionInput>;

export class TransactionService {
  private static instance: TransactionService;
  private baseUrl = '/api/transactions';

  private constructor() {}

  static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return response.json();
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }
    return response.json();
  }

  async createTransaction(data: CreateTransactionInput): Promise<Transaction> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    return response.json();
  }

  async updateTransaction(id: number, data: UpdateTransactionInput): Promise<Transaction> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }

    return response.json();
  }

  async deleteTransaction(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
  }
}
