import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(path.join(dataDir, 'dev.db'));

// Read and execute schema
const schema = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'db', 'schema.sql'), 'utf8');
db.exec(schema);

// Add some sample data
const sampleData = [
  {
    id: '1',
    description: 'Salary',
    amount: 2800,
    category: 'Income',
    date: '2025-05-01',
    type: 'income'
  },
  {
    id: '2',
    description: 'Rent',
    amount: 1200,
    category: 'Housing',
    date: '2025-05-01',
    type: 'expense'
  },
  {
    id: '3',
    description: 'Groceries',
    amount: 200,
    category: 'Food',
    date: '2025-05-02',
    type: 'expense'
  }
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO transactions (id, description, amount, category, date, type)
  VALUES (@id, @description, @amount, @category, @date, @type)
`);

for (const data of sampleData) {
  insert.run(data);
}

console.log('Database initialized with schema and sample data');
db.close();
