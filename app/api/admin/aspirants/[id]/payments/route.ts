import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { hasModuleAccess } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

async function requireAccess() {
  const session = await getSession()
  if (!session?.user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const hasAccess = await hasModuleAccess('aspirants')
  if (!hasAccess) {
    return { error: NextResponse.json({ error: 'Forbidden: You do not have access to the Aspirants module' }, { status: 403 }) }
  }
  return { session }
}

// GET all payment attempts for an aspirant (admin)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireAccess()
  if (error) return error

  try {
    const payments = await prisma.aspirantPayment.findMany({
      where: { aspirantId: params.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ payments })
  } catch (err: any) {
    console.error('Error fetching aspirant payments:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch payments' }, { status: 500 })
  }
}

// POST admin records a payment directly (e.g. cash paid in person, or a verified deposit)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAccess()
  if (error) return error

  try {
    const aspirant = await prisma.aspirant.findUnique({
      where: { id: params.id },
      include: { position: { select: { applicationFee: true } } },
    })
    if (!aspirant) {
      return NextResponse.json({ error: 'Aspirant not found' }, { status: 404 })
    }

    const body = await request.json()
    const method = body.method as 'mpesa' | 'bank'
    if (method !== 'mpesa' && method !== 'bank') {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    const amount = body.amount != null ? Number(body.amount) : aspirant.position.applicationFee
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'A valid amount is required' }, { status: 400 })
    }

    const payment = await prisma.aspirantPayment.create({
      data: {
        aspirantId: aspirant.id,
        amount,
        method,
        phone: body.phone?.trim() || null,
        bankName: body.bankName?.trim() || null,
        transactionId: body.transactionId?.trim() || null,
        status: 'completed',
        verifiedBy: session!.user.id,
        verifiedAt: new Date(),
      },
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (err: any) {
    console.error('Error recording aspirant payment:', err)
    return NextResponse.json({ error: err.message || 'Failed to record payment' }, { status: 500 })
  }
}

// PATCH verify/update an existing payment (e.g. mark a pending bank deposit completed or failed)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAccess()
  if (error) return error

  try {
    const { paymentId, status } = await request.json()
    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }
    if (!['completed', 'failed', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    const payment = await prisma.aspirantPayment.findUnique({ where: { id: paymentId } })
    if (!payment || payment.aspirantId !== params.id) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const updated = await prisma.aspirantPayment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy: session!.user.id,
        verifiedAt: new Date(),
      },
    })

    return NextResponse.json({ payment: updated })
  } catch (err: any) {
    console.error('Error updating aspirant payment:', err)
    return NextResponse.json({ error: err.message || 'Failed to update payment' }, { status: 500 })
  }
}
