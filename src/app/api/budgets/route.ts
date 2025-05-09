import { NextResponse } from 'next/server'
import { db_operations } from '@/lib/db'

export async function GET() {
  try {
    const budgets = await db_operations.getBudgets()
    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newBudget = db_operations.createBudget(body)
    return NextResponse.json(newBudget, { status: 201 })
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    db_operations.updateBudget(id, data)
    return NextResponse.json({ message: 'Budget updated' })
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json(
      { error: 'Failed to update budget' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Budget ID is required' },
        { status: 400 }
      )
    }
    // TODO: Implement deleteBudget in db_operations
    // await db_operations.deleteBudget(Number(id))
    return NextResponse.json({ message: 'Budget deleted' })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json(
      { error: 'Failed to delete budget' },
      { status: 500 }
    )
  }
}
