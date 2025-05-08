Technical Architecture - Personal Finance Application
Last Updated: May 7, 2025 11:12 PM EDT

1. Core Technology Stack
Frontend:
- Next.js 15.2.4
- TypeScript
- Tailwind CSS
- shadcn/ui with Radix UI
- TanStack Query for data fetching
- React Hook Form with Zod validation
- next-themes
- Lucide React icons
- Recharts for data visualization

Backend & Data:
- Prisma ORM
- SQLite Database

2. Project Structure
/app - Routes and pages
/components 
  /budgets
    /charts - Budget visualization components
    /budget-card
    /budget-form
  /transactions
    /charts - Transaction visualization components
    /transaction-list
    /transaction-form
  /pots
    /charts - Savings visualization components
    /pot-card
    /pot-form
  /bills
    /charts - Bills visualization components
    /bill-list
    /bill-form
  /overview
    /charts - Dashboard visualization components
  /ui - Shared UI components
/hooks - Custom React hooks
/lib 
  /services - Service layer implementations
  /utils - Utility functions
  /validations - Zod schemas
  /db - Database configuration
/public - Static assets
/styles - CSS files
/types - TypeScript definitions
/prisma - Database schema
/providers - Context providers

3. Implementation Standards
- Airbnb Style Guide compliance
- PascalCase for component files
- Named exports
- Server vs client component separation
- Type-safe database operations
- Service layer pattern for data operations
- Comprehensive error handling with custom error classes
- Real-time updates with TanStack Query
- Form handling with React Hook Form + Zod
- Responsive design with Tailwind
- Modern React patterns

4. Component Architecture
Each feature implements:
- Page component
- List/Card component
- Form component
- Service layer
- Type definitions
- Visualization components

5. Visualization Patterns
Chart Components:
- Client-side components with 'use client'
- TanStack Query for data fetching
- Loading states with Skeleton
- Empty state handling
- Error boundaries
- Responsive containers
- Color-coded status indicators
- Interactive tooltips

Chart Types:
- Area charts for trends (SpendingTrendsChart)
- Bar charts for comparisons (BudgetProgressChart)
- Radial charts for progress (PotsProgressChart)
- Scatter plots for timelines (BillsTimeline)

Service Layer:
- Type-safe data fetching
- Data transformation for charts
- Date handling with ISO strings
- Numeric calculations
- Status computations
- Error handling