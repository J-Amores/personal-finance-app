import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Transaction {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

// Template transactions from the original data
const templateTransactions: Transaction[] = [
  {
    avatar: "./assets/images/avatars/emma-richardson.jpg",
    name: "Emma Richardson",
    category: "General",
    date: "2024-08-19T14:23:11Z",
    amount: 75.50,
    recurring: false
  },
  {
    avatar: "./assets/images/avatars/savory-bites-bistro.jpg",
    name: "Savory Bites Bistro",
    category: "Dining Out",
    date: "2024-08-19T20:23:11Z",
    amount: -55.50,
    recurring: false
  }
  // ... more templates will be loaded from data.json
];

const categories = [
  "General",
  "Dining Out",
  "Groceries",
  "Entertainment",
  "Transportation",
  "Bills",
  "Shopping",
  "Healthcare"
];

const people = [
  { name: "Emma Richardson", avatar: "./assets/images/avatars/emma-richardson.jpg" },
  { name: "Daniel Carter", avatar: "./assets/images/avatars/daniel-carter.jpg" },
  { name: "Sun Park", avatar: "./assets/images/avatars/sun-park.jpg" },
  { name: "Liam Hughes", avatar: "./assets/images/avatars/liam-hughes.jpg" },
  { name: "Lily Ramirez", avatar: "./assets/images/avatars/lily-ramirez.jpg" },
  { name: "Ethan Clark", avatar: "./assets/images/avatars/ethan-clark.jpg" },
  { name: "James Thompson", avatar: "./assets/images/avatars/james-thompson.jpg" },
  { name: "Ella Phillips", avatar: "./assets/images/avatars/ella-phillips.jpg" },
  { name: "Sofia Peterson", avatar: "./assets/images/avatars/sofia-peterson.jpg" },
  { name: "Mason Martinez", avatar: "./assets/images/avatars/mason-martinez.jpg" }
];

const businesses = [
  { name: "Savory Bites Bistro", avatar: "./assets/images/avatars/savory-bites-bistro.jpg", category: "Dining Out" },
  { name: "Urban Services Hub", avatar: "./assets/images/avatars/urban-services-hub.jpg", category: "General" },
  { name: "Pixel Playground", avatar: "./assets/images/avatars/pixel-playground.jpg", category: "Entertainment" },
  { name: "Spark Electric Solutions", avatar: "./assets/images/avatars/spark-electric-solutions.jpg", category: "Bills" }
];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateAmount(category: string): number {
  const ranges = {
    "General": { min: 20, max: 200 },
    "Dining Out": { min: 15, max: 100 },
    "Groceries": { min: 30, max: 200 },
    "Entertainment": { min: 10, max: 100 },
    "Transportation": { min: 5, max: 50 },
    "Bills": { min: 50, max: 300 },
    "Shopping": { min: 20, max: 200 },
    "Healthcare": { min: 20, max: 500 }
  };

  const range = ranges[category as keyof typeof ranges] || ranges["General"];
  const amount = Math.random() * (range.max - range.min) + range.min;
  return Number(amount.toFixed(2));
}

function generateTransactions(startDate: Date, endDate: Date, count: number): Transaction[] {
  const transactions: Transaction[] = [];

  // Generate recurring transactions first
  const recurringTransactions = businesses.map(business => ({
    avatar: business.avatar,
    name: business.name,
    category: business.category,
    amount: -generateAmount(business.category),
    recurring: true
  }));

  // Add monthly occurrences for recurring transactions
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    recurringTransactions.forEach(rt => {
      transactions.push({
        ...rt,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString()
      });
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Generate random transactions
  for (let i = 0; i < count; i++) {
    const isExpense = Math.random() > 0.3; // 70% chance of being an expense
    const category = categories[Math.floor(Math.random() * categories.length)];
    const isPerson = Math.random() > 0.4; // 60% chance of being a business transaction
    const entity = isPerson 
      ? people[Math.floor(Math.random() * people.length)]
      : businesses[Math.floor(Math.random() * businesses.length)];

    transactions.push({
      avatar: entity.avatar,
      name: entity.name,
      category,
      date: randomDate(startDate, endDate).toISOString(),
      amount: (isExpense ? -1 : 1) * generateAmount(category),
      recurring: false
    });
  }

  // Sort by date
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate data for 8 months (current month + 7 previous months)
const endDate = new Date();
const startDate = new Date(endDate);
startDate.setMonth(startDate.getMonth() - 7);

// Generate approximately 15-20 transactions per month
const totalTransactions = Math.floor(Math.random() * (160 - 120) + 120);

const generatedTransactions = generateTransactions(startDate, endDate, totalTransactions);

// Create detailed budgets with realistic limits and current spending
const budgets = [
  {
    category: "Bills",
    maximum: 1200,
    spent: 980.45,
    period: "monthly",
    theme: "blue"
  },
  {
    category: "Groceries",
    maximum: 600,
    spent: 423.12,
    period: "monthly",
    theme: "green"
  },
  {
    category: "Entertainment",
    maximum: 200,
    spent: 156.89,
    period: "monthly",
    theme: "purple"
  },
  {
    category: "Transportation",
    maximum: 150,
    spent: 98.50,
    period: "monthly",
    theme: "yellow"
  },
  {
    category: "Healthcare",
    maximum: 300,
    spent: 158.49,
    period: "monthly",
    theme: "red"
  },
  {
    category: "Shopping",
    maximum: 400,
    spent: 285.75,
    period: "monthly",
    theme: "pink"
  },
  {
    category: "Dining Out",
    maximum: 300,
    spent: 245.32,
    period: "monthly",
    theme: "orange"
  },
  {
    category: "General",
    maximum: 500,
    spent: 324.18,
    period: "monthly",
    theme: "gray"
  }
];

// Create savings pots with goals and progress
const pots = [
  {
    name: "Emergency Fund",
    target: 10000,
    total: 6500.75,
    theme: "blue",
    description: "3-6 months of living expenses"
  },
  {
    name: "New Car",
    target: 25000,
    total: 12750.25,
    theme: "green",
    description: "Saving for a new electric vehicle"
  },
  {
    name: "Vacation",
    target: 5000,
    total: 3250.50,
    theme: "purple",
    description: "Summer vacation fund"
  },
  {
    name: "Home Down Payment",
    target: 50000,
    total: 15750.80,
    theme: "orange",
    description: "20% down payment for a house"
  },
  {
    name: "Tech Gadgets",
    target: 2000,
    total: 750.25,
    theme: "pink",
    description: "New laptop and accessories"
  }
];

// Write to data.json
const data = {
  transactions: generatedTransactions,
  budgets,
  pots
};

fs.writeFileSync(
  path.join(__dirname, '../prisma/data.json'),
  JSON.stringify(data, null, 2)
);

console.log('Generated new data.json with', generatedTransactions.length, 'transactions');
