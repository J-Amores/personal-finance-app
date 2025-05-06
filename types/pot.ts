export type Pot = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline?: Date
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type CreatePotInput = {
  name: string
  targetAmount: number
  currentAmount?: number
  deadline?: Date
  description?: string
}

export type UpdatePotInput = Partial<CreatePotInput> & {
  id: string
}
