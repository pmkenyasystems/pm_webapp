import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<number, string> = { 0: 'Pending', 1: 'Approved', 2: 'Rejected' }

// GET the applications a member has submitted as an aspirant, with fee payment status
export async function GET(request: NextRequest) {
  try {
    const idNumber = request.nextUrl.searchParams.get('idNumber')?.trim()
    if (!idNumber) {
      return NextResponse.json({ error: 'ID Number is required' }, { status: 400 })
    }

    const aspirants = await prisma.aspirant.findMany({
      where: { idNumber },
      include: {
        election: { select: { id: true, title: true, electionDate: true } },
        position: { select: { id: true, positionTitle: true, positionLevel: true, applicationFee: true } },
        county: { select: { countyName: true } },
        constituency: { select: { constituencyName: true } },
        ward: { select: { wardName: true } },
        payments: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const applications = aspirants.map((a) => {
      const feePaid = a.payments.some((p) => p.status === 'completed')
      const feePending = a.payments.some((p) => p.status === 'pending')
      const area =
        [a.ward?.wardName, a.constituency?.constituencyName, a.county?.countyName]
          .filter(Boolean)
          .join(', ') || null
      return {
        id: a.id,
        election: a.election,
        position: a.position,
        area,
        status: a.status,
        statusLabel: STATUS_LABELS[a.status],
        certificateNumber: a.certificateNumber,
        certificateIssuedAt: a.certificateIssuedAt,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        applicationFee: a.position.applicationFee,
        feeStatus: feePaid ? 'paid' : feePending ? 'pending' : 'unpaid',
        payments: a.payments,
      }
    })

    return NextResponse.json({ applications })
  } catch (error: any) {
    console.error('Error fetching aspirant applications:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch applications' }, { status: 500 })
  }
}
