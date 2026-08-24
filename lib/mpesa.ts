import axios from 'axios'

interface StkPushParams {
  phone: string
  amount: number
  accountReference: string
  transactionDesc: string
  callbackPath: string
}

/** Initiates an M-Pesa Daraja STK Push and returns the raw Safaricom response (includes CheckoutRequestID). */
export async function initiateStkPush({ phone, amount, accountReference, transactionDesc, callbackPath }: StkPushParams) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const shortcode = process.env.MPESA_SHORTCODE
  const passkey = process.env.MPESA_PASSKEY
  const environment = process.env.MPESA_ENVIRONMENT || 'sandbox'

  const baseUrl = environment === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

  try {
    const authResponse = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      auth: {
        username: consumerKey || '',
        password: consumerSecret || '',
      },
    })

    const accessToken = authResponse.data.access_token

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
        CallBackURL: `${(process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '')}${callbackPath}`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
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
