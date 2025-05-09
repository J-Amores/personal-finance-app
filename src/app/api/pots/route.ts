import { NextResponse } from 'next/server'
import { db_operations } from '@/lib/db'

export async function GET() {
  try {
    const pots = await db_operations.getPots()
    return NextResponse.json(pots)
  } catch (error) {
    console.error('Error fetching pots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pots' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newPot = db_operations.createPot(body)
    return NextResponse.json(newPot, { status: 201 })
  } catch (error) {
    console.error('Error creating pot:', error)
    return NextResponse.json(
      { error: 'Failed to create pot' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    db_operations.updatePot(id, data)
    return NextResponse.json({ message: 'Pot updated' })
  } catch (error) {
    console.error('Error updating pot:', error)
    return NextResponse.json(
      { error: 'Failed to update pot' },
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
        { error: 'Pot ID is required' },
        { status: 400 }
      )
    }
    // TODO: Implement deletePot in db_operations
    // await db_operations.deletePot(Number(id))
    return NextResponse.json({ message: 'Pot deleted' })
  } catch (error) {
    console.error('Error deleting pot:', error)
    return NextResponse.json(
      { error: 'Failed to delete pot' },
      { status: 500 }
    )
  }
}
