import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import { initiateStkPush } from '@/lib/mpesa'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

async function initiateMpesaSTK(phone: string, amount: number) {
  return initiateStkPush({
    phone,
    amount,
    accountReference: 'PM Party',
    transactionDesc: "Donation to People's Renaissance Movement",
    callbackPath: '/api/donate/callback',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { amount, paymentMethod, name, email, phone } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!paymentMethod || !['mpesa', 'card', 'paypal'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        currency: 'KES',
        paymentMethod,
        donorName: name || null,
        donorEmail: email || null,
        donorPhone: phone || null,
        status: 'pending',
      },
    })

    if (paymentMethod === 'mpesa') {
      if (!phone) {
        return NextResponse.json(
          { error: 'Phone number is required for M-Pesa payment' },
          { status: 400 }
        )
      }

      try {
        const stkResult = await initiateMpesaSTK(phone, amount)
        
        // Update donation with transaction ID
        await prisma.donation.update({
          where: { id: donation.id },
          data: {
            transactionId: stkResult.CheckoutRequestID,
            metadata: JSON.stringify(stkResult),
          },
        })

        return NextResponse.json({
          message: 'M-Pesa STK push sent successfully',
          checkoutRequestId: stkResult.CheckoutRequestID,
        })
      } catch (error: any) {
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'failed' },
        })
        throw error
      }
    } else if (paymentMethod === 'paypal') {
      // PayPal payment
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required for PayPal payment' },
          { status: 400 }
        )
      }

      try {
        // TODO: Implement PayPal integration
        // For now, we'll create a PayPal checkout session
        // You'll need to install @paypal/checkout-server-sdk and configure PayPal credentials
        
        // Example PayPal integration structure:
        // const paypal = require('@paypal/checkout-server-sdk')
        // const environment = new paypal.core.SandboxEnvironment(
        //   process.env.PAYPAL_CLIENT_ID,
        //   process.env.PAYPAL_CLIENT_SECRET
        // )
        // const client = new paypal.core.PayPalHttpClient(environment)
        // 
        // const request = new paypal.orders.OrdersCreateRequest()
        // request.prefer("return=representation")
        // request.requestBody({
        //   intent: 'CAPTURE',
        //   purchase_units: [{
        //     amount: {
        //       currency_code: 'KES',
        //       value: amount.toString()
        //     }
        //   }]
        // })
        // 
        // const order = await client.execute(request)
        // const approvalUrl = order.result.links.find(link => link.rel === 'approve').href

        // For now, return a placeholder URL
        // In production, replace this with actual PayPal checkout URL
        const paypalCheckoutUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/donate/paypal?donationId=${donation.id}&amount=${amount}`
        
        // Update donation with PayPal order ID (placeholder for now)
        await prisma.donation.update({
          where: { id: donation.id },
          data: {
            transactionId: `paypal_${donation.id}`,
            metadata: JSON.stringify({ status: 'pending', method: 'paypal' }),
          },
        })

        return NextResponse.json({ 
          checkoutUrl: paypalCheckoutUrl,
          message: 'Redirecting to PayPal...'
        })
      } catch (error: any) {
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'failed' },
        })
        throw error
      }
    } else {
      // Card payment via Stripe
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required for card payment' },
          { status: 400 }
        )
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'kes',
                product_data: {
                  name: 'Donation to People\'s Renaissance Movement',
                },
                unit_amount: Math.round(amount * 100), // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/donate`,
          customer_email: email,
          metadata: {
            donationId: donation.id,
          },
        })

        // Update donation with Stripe session ID
        await prisma.donation.update({
          where: { id: donation.id },
          data: {
            transactionId: session.id,
          },
        })

        return NextResponse.json({ checkoutUrl: session.url })
      } catch (error: any) {
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'failed' },
        })
        throw error
      }
    }
  } catch (error: any) {
    console.error('Donation error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    )
  }
}

