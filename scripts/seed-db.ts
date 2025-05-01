import { PrismaClient } from '@prisma/client'

interface DataType {
  balance: {
    current: number
    income: number
    expenses: number
  }
  transactions: {
    avatar: string
    name: string
    category: string
    date: string
    amount: number
    recurring: boolean
    description: string
  }[]
  budgets: {
    category: string
    maximum: number
    theme: string
  }[]
  pots: {
    name: string
    target: number
    total: number
    theme: string
  }[]
  bills: {
    name: string
    amount: number
    dueDate: string
    isPaid: boolean
    category: string
  }[]
}

import { readFileSync } from 'fs'
const data: DataType = JSON.parse(readFileSync('./data.json', 'utf-8'))

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data
    await prisma.transaction.deleteMany()
    await prisma.budget.deleteMany()
    await prisma.pot.deleteMany()
    await prisma.bill.deleteMany()

    console.log('🗑️  Cleared existing data')

    // Seed transactions
    const transactions = await Promise.all(
      data.transactions.map(async (transaction) => {
        return prisma.transaction.create({
          data: {
            amount: transaction.amount,
            type: transaction.amount > 0 ? 'income' : 'expense',
            category: transaction.category,
            description: transaction.name, // Use name as description since that's what we have in the data
            date: new Date(transaction.date),
          },
        })
      })
    )

    console.log(`💰 Created ${transactions.length} transactions`)

    // Seed budgets
    const budgets = await Promise.all(
      data.budgets.map(async (budget) => {
        // Calculate spent amount from transactions
        const spent = data.transactions
          .filter(t => t.category === budget.category && t.amount < 0)
          .reduce((total, t) => total + Math.abs(t.amount), 0)

        return prisma.budget.create({
          data: {
            category: budget.category,
            amount: budget.maximum,
            spent,
            period: 'monthly',
            theme: budget.theme,
          },
        })
      })
    )

    console.log(`📊 Created ${budgets.length} budgets`)

    // Seed pots
    const pots = await Promise.all(
      data.pots.map(async (pot) => {
        return prisma.pot.create({
          data: {
            name: pot.name,
            target: pot.target,
            total: pot.total,
            theme: pot.theme,
          },
        })
      })
    )

    console.log(`🏺 Created ${pots.length} pots`)

    // Seed bills (if they exist)
    if (data.bills) {
      const bills = await Promise.all(
        data.bills.map(async (bill) => {
          return prisma.bill.create({
            data: {
              name: bill.name,
              amount: bill.amount,
              dueDate: new Date(bill.dueDate),
              isPaid: bill.isPaid,
              category: bill.category,
            },
          })
        })
      )
      console.log(`📝 Created ${bills.length} bills`)
    } else {
      console.log('ℹ️  No bills to seed')
    }

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
