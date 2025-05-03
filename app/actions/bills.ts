'use server'

import { db } from '@/lib/db'
import { Bill } from '@/types/bills'

export async function getBills() {
  try {
    const bills = await db.bill.findMany({
      orderBy: { dueDate: 'asc' },
    })
    return { data: bills, error: null }
  } catch (error) {
    console.error('Error fetching bills:', error)
    return { data: null, error: 'Failed to fetch bills' }
  }
}

export async function createBill(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const newBill = await db.bill.create({
      data: {
        name: bill.name,
        amount: bill.amount,
        dueDate: bill.dueDate,
        category: bill.category,
        isPaid: bill.isPaid,
      },
    })
    return { data: newBill, error: null }
  } catch (error) {
    console.error('Error creating bill:', error)
    return { data: null, error: 'Failed to create bill' }
  }
}

export async function updateBill(id: string, bill: Partial<Bill>) {
  try {
    if (!id) throw new Error('Bill ID is required')
    
    const updatedBill = await db.bill.update({
      where: { id },
      data: {
        ...bill,
        // Ensure dates are handled properly
        dueDate: bill.dueDate ? new Date(bill.dueDate) : undefined,
        updatedAt: new Date(),
      },
    })
    return { data: updatedBill, error: null }
  } catch (error) {
    console.error('Error updating bill:', error)
    return { data: null, error: 'Failed to update bill' }
  }
}

export async function deleteBill(id: string) {
  try {
    await db.bill.delete({
      where: { id },
    })
    return { error: null }
  } catch (error) {
    console.error('Error deleting bill:', error)
    return { error: 'Failed to delete bill' }
  }
}
