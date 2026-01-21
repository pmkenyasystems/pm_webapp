'use client'

import { useState } from 'react'

export default function DonatePage() {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'paypal'>('mpesa')
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod,
          ...donorInfo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      if (paymentMethod === 'mpesa') {
        // For M-Pesa, show STK push instructions
        setSuccess(true)
      } else if (paymentMethod === 'paypal') {
        // For PayPal, redirect to PayPal checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        }
      } else {
        // For card, redirect to Stripe checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Support Our Cause
        </h1>
        <div className="w-32 h-1 bg-primary-red mx-auto"></div>
        <p className="text-lg text-gray-600 mt-6">
          Your contribution helps us build a better Kenya
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {success && paymentMethod === 'mpesa' ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-md mb-6">
              <h3 className="text-xl font-semibold mb-2">M-Pesa STK Push Sent!</h3>
              <p>Please check your phone and enter your M-Pesa PIN to complete the payment.</p>
            </div>
            <button
              onClick={() => {
                setSuccess(false)
                setAmount('')
                setDonorInfo({ name: '', email: '', phone: '' })
              }}
              className="text-primary-blue hover:underline"
            >
              Make Another Donation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (KES) *
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent text-lg"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-4 border-2 rounded-md transition ${
                    paymentMethod === 'mpesa'
                      ? 'border-primary-red bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-lg mb-1">M-Pesa</div>
                  <div className="text-sm text-gray-600">Mobile Money</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-md transition ${
                    paymentMethod === 'card'
                      ? 'border-primary-red bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-lg mb-1">Card</div>
                  <div className="text-sm text-gray-600">Credit/Debit Card</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 rounded-md transition ${
                    paymentMethod === 'paypal'
                      ? 'border-primary-red bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-lg mb-1 flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.174 1.364 1.407 3.313 1.407 3.313s.17 1.821-.424 3.9c-.618 2.16-1.98 3.876-3.78 4.55.18.39.33.78.45 1.15.12.38.2.76.24 1.12.05.36.07.7.05 1.01-.02.31-.08.58-.18.81-.1.23-.24.42-.42.57-.18.15-.4.25-.66.32-.26.07-.55.1-.87.1l-1.19-.01c-.31 0-.6-.05-.87-.14-.27-.09-.5-.23-.69-.41-.19-.18-.34-.4-.45-.66l-.05-.12-1.1-2.66-.03-.08a.67.67 0 0 0-.06-.12.64.64 0 0 0-.09-.11.63.63 0 0 0-.1-.08l-.12-.07a.7.7 0 0 0-.15-.05.75.75 0 0 0-.16-.03H8.11l-.01-.02-1.5 9.1zm1.49-10.67.84 2.05h2.97c.08 0 .15.03.2.08a.3.3 0 0 1 .05.21c0 .05-.01.09-.03.13l-.7 1.74a.38.38 0 0 1-.05.1l-.03.04a.2.2 0 0 1-.1.05h-1.48a.38.38 0 0 1-.15-.03.35.35 0 0 1-.1-.08l-.02-.03a.3.3 0 0 1-.04-.1l-.72-1.79a.2.2 0 0 1-.01-.12c0-.05.02-.09.05-.13a.3.3 0 0 1 .1-.08.38.38 0 0 1 .13-.03h1.6l.85-2.05zm12.61-5.33c-.17-.2-.4-.36-.66-.5a4.1 4.1 0 0 0-.9-.33 5.7 5.7 0 0 0-1.06-.1H13.1c-.2 0-.4.04-.55.13a.9.9 0 0 0-.32.3c-.08.13-.14.28-.18.45l-1.4 6.78c-.01.07-.02.14-.02.2 0 .08.02.15.05.22.03.07.08.13.14.18a.4.4 0 0 0 .2.1h2.22l.24 1.2c.02.1.05.18.1.25a.5.5 0 0 0 .15.17c.06.04.14.07.22.08h1.7a.5.5 0 0 0 .48-.38l.72-3.47a.4.4 0 0 1 .04-.1l.02-.05a.3.3 0 0 1 .06-.1c.02-.03.05-.05.08-.07a.3.3 0 0 1 .1-.05.4.4 0 0 1 .12-.02h.44c1.4-.08 2.47-.5 3.23-1.27.76-.77 1.14-1.85 1.14-3.23 0-.48-.05-.92-.15-1.33-.1-.4-.25-.75-.45-1.05z"/>
                    </svg>
                    PayPal
                  </div>
                  <div className="text-sm text-gray-600">PayPal Account</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name {paymentMethod === 'mpesa' ? '' : '*'}
                </label>
                <input
                  type="text"
                  id="name"
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                  required={paymentMethod === 'card' || paymentMethod === 'paypal'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email {paymentMethod === 'mpesa' ? '' : '*'}
                </label>
                <input
                  type="email"
                  id="email"
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                  required={paymentMethod === 'card' || paymentMethod === 'paypal'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
            </div>

            {paymentMethod === 'mpesa' && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={donorInfo.phone}
                  onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                  required
                  placeholder="254712345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format: 254712345678 (without + or spaces)
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-red text-white px-6 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition disabled:opacity-50 text-lg"
            >
              {loading ? 'Processing...' : `Donate KES ${amount ? parseFloat(amount).toLocaleString() : '0'}`}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Your donation is secure and will be used to support our party operations and initiatives.
            </p>
          </form>
        )}
      </div>

      <div className="mt-8 bg-primary-light rounded-lg p-6">
        <h3 className="text-xl font-semibold text-primary-blue mb-3">How Your Donation Helps</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Supporting grassroots organizing and community outreach</li>
          <li>• Funding policy research and development</li>
          <li>• Organizing events and campaigns</li>
          <li>• Maintaining our digital platforms and communications</li>
          <li>• Supporting volunteer programs and member services</li>
        </ul>
      </div>
    </div>
  )
}

