Data Structure and Patterns - Personal Finance Application
Last Updated: May 7, 2025 11:22 AM EDT

1. Database Schema
Budget Model:
- Fields: 
  - id: string (UUID)
  - name: string
  - category: string
  - amount: number
  - spent: number
  - period: 'monthly' | 'quarterly' | 'yearly'
  - startDate: string (ISO date)
  - endDate?: string (ISO date)
  - notes?: string
  - isRecurring: boolean
  - alerts: {
      enabled: boolean
      threshold?: number
    }
  - createdAt: string (ISO date)
  - updatedAt: string (ISO date)
- JSON handling for alerts
- Proper type definitions using Prisma types
- Service layer with CRUD operations

Transaction Model:
- Income/expense tracking
- Category-based organization
- Full CRUD operations
- Type-safe operations
- Amount tracking

Bill Model:
- Recurring bills tracking
- Status management
- Category organization
- Due date handling
- Payment tracking

Pot Model:
- Savings goals tracking
- Progress monitoring
- Target amount tracking
- Current balance

2. Financial Patterns
Monthly Base Income:
- Salary: $2,800
- Investment Dividends: $150 (recurring)
- Freelance: $400-800 (variable)

Expense Patterns:
- Seasonal (Nov-Dec): Winter clothing, holidays
- Annual (Apr): Insurance, home maintenance
- Monthly: Regular bills and utilities

3. Data Management
- TanStack Query for data fetching
  - Automatic background refetching
  - Optimistic updates
  - Cache invalidation
- Type-safe database operations
  - Prisma type generation
  - Zod schema validation
  - Custom type definitions
- Error boundary implementation
  - Custom error classes
  - Consistent error handling
- Loading state management
  - Skeleton loaders
  - Loading spinners
  - Disabled states
- Real-time data synchronization
  - Query invalidation
  - Automatic refetching
  - Optimistic updates

4. Service Layer Pattern
All features implement:
- CRUD operations
- Custom error handling
- Type-safe methods
- Prisma integration
- Data transformation
- Input validation