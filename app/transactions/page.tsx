import { TransactionStats } from '@/components/transactions/transaction-stats'
import { TransactionContainer } from '@/components/transactions/transaction-container'
import { SectionHeader } from '@/components/common/section-header'
import { getTransactions } from '@/app/actions/transactions'

export default async function TransactionsPage() {
  const { data: transactions = [] } = await getTransactions()

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <SectionHeader
          title="Transactions"
          description="Manage your transactions and track your spending."
        />
      </div>

      <TransactionStats transactions={transactions} />

      <TransactionContainer initialTransactions={transactions} />
    </div>
  )
}
