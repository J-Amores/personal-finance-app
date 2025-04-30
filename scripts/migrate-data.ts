import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface LegacyTransaction {
  avatar: string
  name: string
  category: string
  date: string
  amount: number
  recurring: boolean
}

interface LegacyData {
  balance: {
    current: number
    income: number
    expenses: number
  }
  transactions: LegacyTransaction[]
  budgets: Array<{
    category: string
    maximum: number
    theme: string
  }>
  pots: Array<{
    name: string
    target: number
    total: number
    theme: string
  }>
}

async function migrateData() {
  try {
    // Read the JSON file
    const dataPath = path.join(process.cwd(), 'data.json')
    const rawData = fs.readFileSync(dataPath, 'utf8')
    const data: LegacyData = JSON.parse(rawData)

    // Clear existing data
    await prisma.transaction.deleteMany()
    await prisma.budget.deleteMany()
    await prisma.pot.deleteMany()

    // Migrate transactions
    const transactions = data.transactions.map(t => ({
      description: t.name,
      category: t.category,
      date: new Date(t.date),
      amount: Math.abs(t.amount), // Store amount as positive
      type: t.amount >= 0 ? 'income' : 'expense',
    }))

    console.log(`Migrating ${transactions.length} transactions...`)
    
    for (const transaction of transactions) {
      await prisma.transaction.create({
        data: transaction
      })
    }

    // Migrate budgets
    const budgets = data.budgets.map(b => ({
      category: b.category,
      amount: b.maximum,
      spent: 0,
      period: 'monthly' as const,
      theme: b.theme
    }))

    console.log(`Migrating ${budgets.length} budgets...`)

    for (const budget of budgets) {
      await prisma.budget.create({
        data: budget
      })
    }

    // Migrate pots
    const pots = data.pots.map(p => ({
      name: p.name,
      target: p.target,
      total: p.total,
      theme: p.theme
    }))

    console.log(`Migrating ${pots.length} pots...`)

    for (const pot of pots) {
      await prisma.pot.create({
        data: pot
      })
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Error during migration:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateData()
