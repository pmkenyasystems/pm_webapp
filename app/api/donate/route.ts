import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

// M-Pesa STK Push function
async function initiateMpesaSTK(phone: string, amount: number) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY
  const environment = process.env.MPESA_ENVIRONMENT || 'sandbox'

  const baseUrl = environment === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke'

  try {
    // Get access token
    const authResponse = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      auth: {
        username: consumerKey || '',
        password: consumerSecret || '',
      },
    })

    const accessToken = authResponse.data.access_token

    // Initiate STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
    const phoneNumber = phone.startsWith('254') ? phone : `254${phone.replace(/^0/, '')}`

    const stkResponse = await axios.post(
      `${baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/donate/callback`,
        AccountReference: 'PRM Donation',
        TransactionDesc: 'Donation to People\'s Renaissance Movement',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return stkResponse.data
  } catch (error: any) {
    console.error('M-Pesa STK Push error:', error)
    throw new Error(error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payment')
  }
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

    if (!paymentMethod || !['mpesa', 'card'].includes(paymentMethod)) {
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

