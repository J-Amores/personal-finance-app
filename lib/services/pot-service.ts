import { Prisma, Pot } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export class PotServiceError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'PotServiceError'
  }
}

export const potService = {
  async getPots(): Promise<Pot[]> {
    try {
      return await prisma.pot.findMany({
        orderBy: { updatedAt: 'desc' }
      })
    } catch (error) {
      throw new PotServiceError(
        'Failed to fetch pots',
        'FETCH_ERROR'
      )
    }
  },

  async createPot(data: Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pot> {
    try {
      // Validate target amount
      if (data.target <= 0) {
        throw new PotServiceError(
          'Target amount must be greater than 0',
          'INVALID_TARGET'
        )
      }

      // Validate initial total if provided
      if (data.total < 0) {
        throw new PotServiceError(
          'Total amount cannot be negative',
          'INVALID_TOTAL'
        )
      }

      return await prisma.pot.create({
        data: {
          ...data,
          total: data.total ?? 0 // Ensure total has a default value
        }
      })
    } catch (error) {
      if (error instanceof PotServiceError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new PotServiceError(
            'A pot with this name already exists',
            'DUPLICATE_NAME'
          )
        }
      }
      throw new PotServiceError(
        'Failed to create pot',
        'CREATE_ERROR'
      )
    }
  },

  async updatePot(
    id: string,
    data: Partial<Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Pot> {
    try {
      // Validate target amount if provided
      if (data.target !== undefined && data.target <= 0) {
        throw new PotServiceError(
          'Target amount must be greater than 0',
          'INVALID_TARGET'
        )
      }

      // Validate total if provided
      if (data.total !== undefined && data.total < 0) {
        throw new PotServiceError(
          'Total amount cannot be negative',
          'INVALID_TOTAL'
        )
      }

      const pot = await prisma.pot.update({
        where: { id },
        data
      })

      return pot
    } catch (error) {
      if (error instanceof PotServiceError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new PotServiceError(
            'Pot not found',
            'NOT_FOUND'
          )
        }
        if (error.code === 'P2002') {
          throw new PotServiceError(
            'A pot with this name already exists',
            'DUPLICATE_NAME'
          )
        }
      }
      throw new PotServiceError(
        'Failed to update pot',
        'UPDATE_ERROR'
      )
    }
  },

  async deletePot(id: string): Promise<void> {
    try {
      await prisma.pot.delete({
        where: { id }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new PotServiceError(
            'Pot not found',
            'NOT_FOUND'
          )
        }
      }
      throw new PotServiceError(
        'Failed to delete pot',
        'DELETE_ERROR'
      )
    }
  },

  async addToPot(id: string, amount: number): Promise<Pot> {
    try {
      if (amount <= 0) {
        throw new PotServiceError(
          'Amount must be greater than 0',
          'INVALID_AMOUNT'
        )
      }

      return await prisma.pot.update({
        where: { id },
        data: {
          total: {
            increment: amount
          }
        }
      })
    } catch (error) {
      if (error instanceof PotServiceError) throw error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new PotServiceError(
            'Pot not found',
            'NOT_FOUND'
          )
        }
      }
      throw new PotServiceError(
        'Failed to add to pot',
        'ADD_ERROR'
      )
    }
  },

  async withdrawFromPot(id: string, amount: number): Promise<Pot> {
    try {
      if (amount <= 0) {
        throw new PotServiceError(
          'Amount must be greater than 0',
          'INVALID_AMOUNT'
        )
      }

      const pot = await prisma.pot.findUnique({
        where: { id }
      })

      if (!pot) {
        throw new PotServiceError(
          'Pot not found',
          'NOT_FOUND'
        )
      }

      if (pot.total < amount) {
        throw new PotServiceError(
          'Insufficient funds in pot',
          'INSUFFICIENT_FUNDS'
        )
      }

      return await prisma.pot.update({
        where: { id },
        data: {
          total: {
            decrement: amount
          }
        }
      })
    } catch (error) {
      if (error instanceof PotServiceError) throw error
      throw new PotServiceError(
        'Failed to withdraw from pot',
        'WITHDRAW_ERROR'
      )
    }
  }
}
