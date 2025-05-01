import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

interface CategoryDetails {
  isIncome: boolean
  typical: number
  budget?: number
}

// Categories with their typical monthly budgets
const categories: Record<string, CategoryDetails> = {
  'Salary': { isIncome: true, typical: 5000 },
  'Freelance': { isIncome: true, typical: 2000 },
  'Rent': { isIncome: false, typical: 1800, budget: 2000 },
  'Groceries': { isIncome: false, typical: 500, budget: 600 },
  'Dining Out': { isIncome: false, typical: 300, budget: 400 },
  'Transportation': { isIncome: false, typical: 200, budget: 250 },
  'Entertainment': { isIncome: false, typical: 150, budget: 200 },
  'Shopping': { isIncome: false, typical: 200, budget: 300 },
  'Healthcare': { isIncome: false, typical: 100, budget: 200 },
  'Utilities': { isIncome: false, typical: 150, budget: 200 },
  'Savings': { isIncome: false, typical: 1000, budget: 1000 },
  'Investment': { isIncome: false, typical: 500, budget: 500 }
}

// Themes for visual variety
const themes = [
  'red', 'blue', 'green', 'yellow', 'purple', 'pink',
  'orange', 'indigo', 'teal', 'cyan', 'emerald', 'violet'
]

// Function to generate a random date within a range
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Function to add some randomness to amounts
function randomizeAmount(base: number, variance: number = 0.2) {
  const variation = base * variance
  return base + (Math.random() * variation * 2 - variation)
}

async function main() {
  try {
    // Clear existing data
    await prisma.transaction.deleteMany()
    await prisma.budget.deleteMany()
    await prisma.pot.deleteMany()
    await prisma.bill.deleteMany()

    console.log('🗑️  Cleared existing data')

    // Generate 6 months of transactions
    const endDate = new Date()
    const startDate = new Date(endDate)
    startDate.setMonth(endDate.getMonth() - 6)

    // Create transactions
    const transactions = []
    for (const [category, details] of Object.entries(categories)) {
      // Generate monthly transactions
      for (let month = 0; month < 6; month++) {
        const monthStart = new Date(startDate)
        monthStart.setMonth(startDate.getMonth() + month)
        const monthEnd = new Date(monthStart)
        monthEnd.setMonth(monthStart.getMonth() + 1)

        // Generate 1-3 transactions per category per month
        const numTransactions = details.isIncome ? 1 : Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < numTransactions; i++) {
          const amount = details.isIncome ? details.typical : -details.typical / numTransactions
          transactions.push({
            amount: randomizeAmount(amount),
            type: details.isIncome ? TransactionType.income : TransactionType.expense,
            category,
            description: `${category} - ${month + 1}`,
            date: randomDate(monthStart, monthEnd),
          })
        }
      }
    }

    // Create transactions in database
    const createdTransactions = await Promise.all(
      transactions.map(transaction =>
        prisma.transaction.create({ data: transaction })
      )
    )

    console.log(`💰 Created ${createdTransactions.length} transactions`)

    // Create budgets
    const budgets = await Promise.all(
      Object.entries(categories)
        .filter(([_, details]) => !details.isIncome && 'budget' in details)
        .map(([category, details], index) =>
          prisma.budget.create({
            data: {
              category,
              amount: details.budget!,
              spent: 0, // This will be updated by the application
              period: 'monthly',
              theme: themes[index % themes.length],
            },
          })
        )
    )

    console.log(`📊 Created ${budgets.length} budgets`)

    // Create savings pots
    const pots = await Promise.all([
      {
        name: 'Emergency Fund',
        target: 10000,
        total: 5000,
        theme: 'blue'
      },
      {
        name: 'Vacation',
        target: 3000,
        total: 1500,
        theme: 'yellow'
      },
      {
        name: 'New Car',
        target: 20000,
        total: 8000,
        theme: 'green'
      },
      {
        name: 'Home Down Payment',
        target: 50000,
        total: 15000,
        theme: 'purple'
      }
    ].map(pot => prisma.pot.create({ data: pot })))

    console.log(`🏺 Created ${pots.length} pots`)

    // Create bills
    const bills = await Promise.all([
      {
        name: 'Rent',
        amount: 1800,
        dueDate: new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1),
        isPaid: false,
        category: 'Rent'
      },
      {
        name: 'Electricity',
        amount: 80,
        dueDate: new Date(endDate.getFullYear(), endDate.getMonth() + 1, 15),
        isPaid: false,
        category: 'Utilities'
      },
      {
        name: 'Internet',
        amount: 70,
        dueDate: new Date(endDate.getFullYear(), endDate.getMonth() + 1, 10),
        isPaid: true,
        category: 'Utilities'
      },
      {
        name: 'Phone',
        amount: 50,
        dueDate: new Date(endDate.getFullYear(), endDate.getMonth() + 1, 5),
        isPaid: true,
        category: 'Utilities'
      },
      {
        name: 'Gym Membership',
        amount: 40,
        dueDate: new Date(endDate.getFullYear(), endDate.getMonth() + 1, 1),
        isPaid: false,
        category: 'Entertainment'
      }
    ].map(bill => prisma.bill.create({ data: bill })))

    console.log(`📝 Created ${bills.length} bills`)

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
