export default function Home() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-white p-6 space-y-6">
        <div className="text-2xl font-bold">finance</div>
        
        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 p-3 bg-zinc-800 rounded-lg">
            <span>Overview</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-zinc-400 hover:bg-zinc-800 rounded-lg">
            <span>Transactions</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-zinc-400 hover:bg-zinc-800 rounded-lg">
            <span>Budgets</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-zinc-400 hover:bg-zinc-800 rounded-lg">
            <span>Pots</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-zinc-400 hover:bg-zinc-800 rounded-lg">
            <span>Recurring Bills</span>
          </a>
        </nav>

        <div className="absolute bottom-6">
          <button className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white">
            <span>Minimize Menu</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-8">Overview</h1>

        {/* Balance Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-zinc-900 rounded-lg text-white">
            <div className="text-sm text-zinc-400 mb-2">Current Balance</div>
            <div className="text-3xl font-semibold">$4,836.00</div>
          </div>
          <div className="p-6 bg-white rounded-lg">
            <div className="text-sm text-zinc-500 mb-2">Income</div>
            <div className="text-3xl font-semibold">$3,814.25</div>
          </div>
          <div className="p-6 bg-white rounded-lg">
            <div className="text-sm text-zinc-500 mb-2">Expenses</div>
            <div className="text-3xl font-semibold">$1,700.50</div>
          </div>
        </div>

        {/* Pots and Budgets Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Pots */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Pots</h2>
              <button className="text-sm text-zinc-500">See Details</button>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-blue-600">$</span>
              </div>
              <div>
                <div className="text-2xl font-semibold">$920.00</div>
                <div className="text-sm text-zinc-500">Total Saved</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Savings</span>
                <span className="text-sm font-medium">$159</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Gift</span>
                <span className="text-sm font-medium">$110</span>
              </div>
            </div>
          </div>

          {/* Budgets */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Budgets</h2>
              <button className="text-sm text-zinc-500">See Details</button>
            </div>
            <div className="relative w-48 h-48 mx-auto mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-semibold">$338</div>
                  <div className="text-sm text-zinc-500">of $975 limit</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Entertainment</span>
                <span className="text-sm font-medium">$50.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bills</span>
                <span className="text-sm font-medium">$750.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions and Bills Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Transactions */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Transactions</h2>
              <button className="text-sm text-zinc-500">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full"></div>
                  <div>
                    <div className="font-medium">Emma Richardson</div>
                    <div className="text-sm text-zinc-500">19 Aug 2024</div>
                  </div>
                </div>
                <div className="text-green-600">+$75.50</div>
              </div>
              {/* More transactions... */}
            </div>
          </div>

          {/* Recurring Bills */}
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recurring Bills</h2>
              <button className="text-sm text-zinc-500">See Details</button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Paid Bills</span>
                  <span className="text-sm">$190.00</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full">
                  <div className="h-full w-1/3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Upcoming</span>
                <span className="text-sm font-medium">$194.98</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Due Soon</span>
                <span className="text-sm font-medium">$59.98</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
