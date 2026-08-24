import { NextRequest, NextResponse } from 'next/server'
import { createAspirantApplication, AspirantApplicationError } from '@/lib/aspirants'

export const dynamic = 'force-dynamic'

// POST apply as aspirant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { positionId, countyCode, constituencyCode, wardCode, ...rest } = body

    const { aspirant } = await createAspirantApplication({
      ...rest,
      positionId: positionId != null ? Number(positionId) : positionId,
      countyCode: countyCode != null && countyCode !== '' ? Number(countyCode) : null,
      constituencyCode: constituencyCode != null && constituencyCode !== '' ? Number(constituencyCode) : null,
      wardCode: wardCode != null && wardCode !== '' ? Number(wardCode) : null,
    })

    return NextResponse.json(
      { aspirant, message: 'Application submitted successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating aspirant application:', error)
    if (error instanceof AspirantApplicationError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already applied for this position in this election' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}
