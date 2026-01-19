'use client'

import { useState } from 'react'

export default function DonatePage() {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa')
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
              <div className="mt-2 flex gap-2">
                {[100, 500, 1000, 5000, 10000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="px-4 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    KES {val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method *
              </label>
              <div className="grid grid-cols-2 gap-4">
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
                  required={paymentMethod === 'card'}
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
                  required={paymentMethod === 'card'}
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

