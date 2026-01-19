import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // M-Pesa callback data structure
    const body = data.Body
    if (body && body.stkCallback) {
      const callback = body.stkCallback
      const checkoutRequestId = callback.CheckoutRequestID
      const resultCode = callback.ResultCode
      const resultDesc = callback.ResultDesc

      // Find donation by checkout request ID
      const donation = await prisma.donation.findFirst({
        where: {
          transactionId: checkoutRequestId,
        },
      })

      if (donation) {
        if (resultCode === 0) {
          // Payment successful
          const callbackMetadata = callback.CallbackMetadata
          const item = callbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')
          const receiptNumber = item?.Value

          await prisma.donation.update({
            where: { id: donation.id },
            data: {
              status: 'completed',
              transactionId: receiptNumber || checkoutRequestId,
            },
          })
        } else {
          // Payment failed
          await prisma.donation.update({
            where: { id: donation.id },
            data: { status: 'failed' },
          })
        }
      }
    }

    return NextResponse.json({ message: 'Callback received' })
  } catch (error: any) {
    console.error('Donation callback error:', error)
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    )
  }
}

