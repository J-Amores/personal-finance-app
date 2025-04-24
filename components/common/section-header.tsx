'use client'

import { ReactNode } from 'react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface SectionHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
      {action}
    </CardHeader>
  )
}
