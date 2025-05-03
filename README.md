# Personal Finance App

A modern and intuitive personal finance application built with Next.js and Tailwind CSS. Track your transactions, manage budgets, monitor recurring bills, and organize savings pots all in one place.

## Features

- **Dashboard Overview**: View your current balance, recent transactions, and financial summary
- **Transaction Management**: Track and categorize all your financial transactions
- **Budget Tracking**: Set and monitor budgets across different categories
- **Recurring Bills**: Keep track of regular payments and due dates
- **Savings Pots**: Organize and track progress towards savings goals

## Tech Stack

- **Framework**: Next.js 15.2.4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: Light/Dark mode support with next-themes
- **Language**: TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
personal-finance-app/
├── app/                    # Next.js app directory
│   ├── budgets/           # Budgets page
│   ├── pots/             # Savings pots page
│   ├── bills/           # Bills management page
│   └── transactions/     # Transactions page
├── components/            # React components
│   ├── ui/              # shadcn/ui components
│   └── theme-provider.tsx
├── lib/                   # Utility functions
├── public/               # Static assets
│   └── assets/
├── styles/              # Global styles
└── data.json           # Sample financial data
```

## Features in Detail

### Dashboard
- Current balance display
- Income and expense summary
- Recent transactions list
- Upcoming bills preview
- Budget overview

### Transactions
- List all financial transactions
- Transaction categorization
- Search and filter capabilities
- Transaction history

### Budgets
- Set budget limits by category
- Track spending against budgets
- Visual progress indicators
- Budget period management

### Recurring Bills
- Bill payment tracking
- Due date reminders
- Payment history
- Bill categorization

### Savings Pots
- Create savings goals
- Track progress
- Add/withdraw funds
- Goal completion tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
