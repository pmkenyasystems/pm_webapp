import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initiateStkPush } from '@/lib/mpesa'

export const dynamic = 'force-dynamic'

// GET this aspirant's payment attempts (member self-service — requires their own idNumber)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idNumber = request.nextUrl.searchParams.get('idNumber')?.trim()
    if (!idNumber) {
      return NextResponse.json({ error: 'ID Number is required' }, { status: 400 })
    }

    const aspirant = await prisma.aspirant.findUnique({
      where: { id: params.id },
      include: { position: { select: { applicationFee: true } } },
    })
    if (!aspirant || aspirant.idNumber !== idNumber) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const payments = await prisma.aspirantPayment.findMany({
      where: { aspirantId: aspirant.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      applicationFee: aspirant.position.applicationFee,
      payments,
    })
  } catch (error: any) {
    console.error('Error fetching aspirant payments:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch payments' }, { status: 500 })
  }
}

// POST initiate/record a payment attempt for this aspirant (member self-service)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const idNumber = body.idNumber?.trim()
    const method = body.method as 'mpesa' | 'bank'

    if (!idNumber) {
      return NextResponse.json({ error: 'ID Number is required' }, { status: 400 })
    }
    if (method !== 'mpesa' && method !== 'bank') {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    const aspirant = await prisma.aspirant.findUnique({
      where: { id: params.id },
      include: { position: { select: { applicationFee: true, positionTitle: true } } },
    })
    if (!aspirant || aspirant.idNumber !== idNumber) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const fee = aspirant.position.applicationFee
    if (!fee || fee <= 0) {
      return NextResponse.json(
        { error: 'An application fee has not been configured for this position yet. Please contact the secretariat.' },
        { status: 400 }
      )
    }

    const existingCompleted = await prisma.aspirantPayment.findFirst({
      where: { aspirantId: aspirant.id, status: 'completed' },
    })
    if (existingCompleted) {
      return NextResponse.json({ error: 'The application fee for this position has already been paid' }, { status: 400 })
    }

    if (method === 'mpesa') {
      const phone = body.phone?.trim()
      if (!phone) {
        return NextResponse.json({ error: 'Phone number is required for M-Pesa payment' }, { status: 400 })
      }

      const payment = await prisma.aspirantPayment.create({
        data: {
          aspirantId: aspirant.id,
          amount: fee,
          method: 'mpesa',
          phone,
          status: 'pending',
        },
      })

      try {
        const stkResult = await initiateStkPush({
          phone,
          amount: fee,
          accountReference: `Aspirant ${aspirant.idNumber}`,
          transactionDesc: `PM Party application fee — ${aspirant.position.positionTitle}`,
          callbackPath: '/api/aspirants/payments/callback',
        })

        await prisma.aspirantPayment.update({
          where: { id: payment.id },
          data: { transactionId: stkResult.CheckoutRequestID },
        })

        return NextResponse.json({
          message: 'M-Pesa STK push sent. Enter your PIN on your phone to complete payment.',
          paymentId: payment.id,
          checkoutRequestId: stkResult.CheckoutRequestID,
        }, { status: 201 })
      } catch (err: any) {
        await prisma.aspirantPayment.update({ where: { id: payment.id }, data: { status: 'failed' } })
        throw err
      }
    }

    // Bank deposit — recorded as pending, awaiting admin verification
    const bankName = body.bankName?.trim()
    const transactionId = body.transactionId?.trim()
    if (!bankName || !transactionId) {
      return NextResponse.json(
        { error: 'Bank name and deposit reference number are required' },
        { status: 400 }
      )
    }

    const payment = await prisma.aspirantPayment.create({
      data: {
        aspirantId: aspirant.id,
        amount: fee,
        method: 'bank',
        bankName,
        transactionId,
        status: 'pending',
      },
    })

    return NextResponse.json({
      message: 'Deposit recorded. It will be verified by the Elections Board before your application can be approved.',
      payment,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error recording aspirant payment:', error)
    return NextResponse.json({ error: error.message || 'Failed to record payment' }, { status: 500 })
  }
}
