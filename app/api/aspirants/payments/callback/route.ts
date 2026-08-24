import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const body = data.Body
    if (body && body.stkCallback) {
      const callback = body.stkCallback
      const checkoutRequestId = callback.CheckoutRequestID
      const resultCode = callback.ResultCode

      const payment = await prisma.aspirantPayment.findFirst({
        where: { transactionId: checkoutRequestId },
      })

      if (payment) {
        if (resultCode === 0) {
          const callbackMetadata = callback.CallbackMetadata
          const item = callbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')
          const receiptNumber = item?.Value

          await prisma.aspirantPayment.update({
            where: { id: payment.id },
            data: {
              status: 'completed',
              transactionId: receiptNumber || checkoutRequestId,
              verifiedAt: new Date(),
            },
          })
        } else {
          await prisma.aspirantPayment.update({
            where: { id: payment.id },
            data: { status: 'failed' },
          })
        }
      }
    }

    return NextResponse.json({ message: 'Callback received' })
  } catch (error: any) {
    console.error('Aspirant payment callback error:', error)
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 })
  }
}
