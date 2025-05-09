import type React from "react"
import { DollarSign, Home, ArrowUpDown, RefreshCw, Wallet, BarChart3 } from "lucide-react"
import Link from "next/link"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { QueryProvider } from "@/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Finance Dashboard",
  description: "Personal finance management dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <div className="flex h-screen bg-gray-50 dark:bg-zinc-900">
          {/* Sidebar */}
          <div className="w-16 bg-zinc-900 flex flex-col items-center py-6 space-y-8">
            <div className="text-white">
              <DollarSign size={24} />
            </div>
            <div className="flex flex-col space-y-6">
              <Link href="/" className="p-3 hover:bg-zinc-800 rounded-md">
                <Home size={20} className="text-gray-400" />
              </Link>
              <Link href="/transactions" className="p-3 hover:bg-zinc-800 rounded-md">
                <ArrowUpDown size={20} className="text-gray-400" />
              </Link>
              <Link href="/recurring-bills" className="p-3 hover:bg-zinc-800 rounded-md">
                <RefreshCw size={20} className="text-gray-400" />
              </Link>
              <Link href="/pots" className="p-3 hover:bg-zinc-800 rounded-md">
                <Wallet size={20} className="text-gray-400" />
              </Link>
              <Link href="/budgets" className="p-3 hover:bg-zinc-800 rounded-md">
                <BarChart3 size={20} className="text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">{children}</div>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
