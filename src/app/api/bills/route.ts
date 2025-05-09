import { NextResponse } from 'next/server'
import { db_operations } from '@/lib/db'

export async function GET() {
  try {
    const bills = await db_operations.getBills()
    return NextResponse.json(bills)
  } catch (error) {
    console.error('Error fetching bills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bills' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newBill = db_operations.createBill(body)
    return NextResponse.json(newBill, { status: 201 })
  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    db_operations.updateBill(id, data)
    return NextResponse.json({ message: 'Bill updated' })
  } catch (error) {
    console.error('Error updating bill:', error)
    return NextResponse.json(
      { error: 'Failed to update bill' },
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
        { error: 'Bill ID is required' },
        { status: 400 }
      )
    }
    // TODO: Implement deleteBill in db_operations
    // await db_operations.deleteBill(Number(id))
    return NextResponse.json({ message: 'Bill deleted' })
  } catch (error) {
    console.error('Error deleting bill:', error)
    return NextResponse.json(
      { error: 'Failed to delete bill' },
      { status: 500 }
    )
  }
}
