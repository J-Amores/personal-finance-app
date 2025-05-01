import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  // Delete existing data
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.pot.deleteMany()

  // Read data from data.json
  const data = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, 'data.json'),
      'utf-8'
    )
  )

  // Create transactions
  for (const transaction of data.transactions) {
    await prisma.transaction.create({
      data: {
        amount: transaction.amount,
        category: transaction.category,
        date: new Date(transaction.date),
        description: transaction.name,
        type: transaction.amount > 0 ? 'income' : 'expense'
      }
    })
  }

  // Create budgets
  for (const budget of data.budgets) {
    await prisma.budget.create({
      data: {
        category: budget.category,
        amount: budget.maximum,
        spent: budget.spent,
        period: budget.period,
        theme: budget.theme
      }
    })
  }

  // Create pots
  for (const pot of data.pots) {
    await prisma.pot.create({
      data: {
        name: pot.name,
        target: pot.target,
        total: pot.total,
        theme: pot.theme
      }
    })
  }

  console.log('Database has been seeded with:')
  console.log(`- ${data.transactions.length} transactions`)
  console.log(`- ${data.budgets.length} budgets`)
  console.log(`- ${data.pots.length} savings pots`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
