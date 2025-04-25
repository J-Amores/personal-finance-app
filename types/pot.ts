export interface Pot {
  id: string;
  name: string;
  description?: string;
  currentAmount: number;
  targetAmount: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PotFormData = Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>;
