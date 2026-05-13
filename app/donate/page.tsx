'use client'

import { useState } from 'react'

// ── UPDATE THESE with your actual Equity Bank account details ──────────────
const BANK = {
  name: 'Equity Bank (Kenya) Limited',
  bankCode: '68',
  accountName: 'PEOPLES RENAISSANCE MOVEMENTPM',
  accountNumber: '1410287336060',
  branch: 'Lavington Supreme Centre',
  branchCode: '141',
  swiftCode: 'EQBLKENA',
}
// ──────────────────────────────────────────────────────────────────────────

type Region = 'kenya' | 'international'
type KenyaMethod = 'mpesa' | 'bank'
type IntlMethod = 'card' | 'wire'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="ml-2 text-xs text-primary-blue hover:underline shrink-0"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 gap-2">
      <span className="text-xs text-gray-500 w-24 shrink-0">{label}</span>
      <span className="font-semibold text-gray-900 text-sm flex-1 min-w-0 break-all">{value}</span>
      <CopyButton text={value} />
    </div>
  )
}

export default function DonatePage() {
  const [region, setRegion] = useState<Region | null>(null)
  const [kenyaMethod, setKenyaMethod] = useState<KenyaMethod>('mpesa')
  const [intlMethod, setIntlMethod] = useState<IntlMethod>('card')

  const [amount, setAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorCountry, setDonorCountry] = useState('')
  const [mpesaPhone, setMpesaPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mpesaSent, setMpesaSent] = useState(false)

  const currency = region === 'kenya' ? 'KES' : 'USD'

  const reset = () => {
    setAmount('')
    setDonorName('')
    setDonorEmail('')
    setDonorCountry('')
    setMpesaPhone('')
    setError('')
    setMpesaSent(false)
  }

  const handleMpesa = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !mpesaPhone) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod: 'mpesa',
          currency: 'KES',
          name: donorName || null,
          email: donorEmail || null,
          phone: mpesaPhone,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initiate M-Pesa')
      setMpesaSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !donorEmail) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod: 'card',
          currency,
          name: donorName || null,
          email: donorEmail,
          country: donorCountry || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment')
      if (data.checkoutUrl) window.location.href = data.checkoutUrl
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const AmountInput = ({ placeholder }: { placeholder: string }) => (
    <div>
      <label className={labelCls}>Amount ({currency}) <span className="text-red-500">*</span></label>
      <input
        type="number"
        min="1"
        step="1"
        required
        placeholder={placeholder}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={inputCls}
      />
    </div>
  )

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">

      {/* Hero */}
      <div className="text-center mb-7">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Support Our Cause</h1>
        <div className="w-20 h-1 bg-primary-red mx-auto mb-3" />
        <p className="text-gray-500 text-sm sm:text-base max-w-sm mx-auto">
          Your contribution fuels the Kenyan Renaissance. Every shilling and every dollar counts.
        </p>
      </div>

      {/* Region selector */}
      {!region ? (
        <div>
          <p className="text-center text-xs font-semibold text-gray-400 mb-4 uppercase tracking-widest">Where are you donating from?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setRegion('kenya')}
              className="group flex-1 bg-white border-2 border-gray-100 hover:border-primary-blue rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🇰🇪</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-blue transition-colors">I&apos;m in Kenya</h3>
              </div>
              <div className="flex gap-1.5">
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">M-Pesa</span>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">Bank Transfer</span>
              </div>
            </button>

            <button
              onClick={() => setRegion('international')}
              className="group flex-1 bg-white border-2 border-gray-100 hover:border-primary-blue rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🌍</span>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-blue transition-colors">I&apos;m outside Kenya</h3>
              </div>
              <div className="flex gap-1.5">
                <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">Card</span>
                <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">Bank Wire</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Back */}
          <button
            onClick={() => { setRegion(null); reset() }}
            className="flex items-center gap-1 text-sm text-primary-blue hover:underline mb-5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change region
          </button>

          {/* ── KENYA ── */}
          {region === 'kenya' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(['mpesa', 'bank'] as KenyaMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setKenyaMethod(m); reset() }}
                    className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition ${
                      kenyaMethod === m
                        ? 'text-primary-blue border-b-2 border-primary-blue bg-primary-blue/5'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {m === 'mpesa' ? '📱 M-Pesa' : '🏦 Bank Transfer'}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {kenyaMethod === 'mpesa' && (
                  <>
                    {mpesaSent ? (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base mb-2">STK Push Sent!</h3>
                        <p className="text-gray-600 text-sm mb-4">Check your phone and enter your M-Pesa PIN to complete the donation of <strong>KSh {parseFloat(amount).toLocaleString()}</strong>.</p>
                        <button onClick={reset} className="text-primary-blue text-sm hover:underline">Make another donation</button>
                      </div>
                    ) : (
                      <form onSubmit={handleMpesa} className="space-y-4">
                        <AmountInput placeholder="e.g. 1000" />
                        <div>
                          <label className={labelCls}>M-Pesa Phone Number <span className="text-red-500">*</span></label>
                          <input type="tel" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} required placeholder="e.g. 0712345678" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Your Name (optional)</label>
                          <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} className={inputCls} placeholder="Full name" />
                        </div>
                        <div>
                          <label className={labelCls}>Email (optional)</label>
                          <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} className={inputCls} placeholder="your@email.com" />
                        </div>
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                        <button
                          type="submit"
                          disabled={loading || !amount || !mpesaPhone}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                        >
                          {loading ? 'Sending STK Push…' : `Donate KSh ${amount ? parseFloat(amount).toLocaleString() : '—'} via M-Pesa`}
                        </button>
                      </form>
                    )}
                  </>
                )}

                {kenyaMethod === 'bank' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Transfer directly to our Equity Bank account below. Use your <strong>full name</strong> as the payment reference.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <BankRow label="Bank" value={BANK.name} />
                      <BankRow label="Bank Code" value={BANK.bankCode} />
                      <BankRow label="Account Name" value={BANK.accountName} />
                      <BankRow label="Account No." value={BANK.accountNumber} />
                      <BankRow label="Branch" value={BANK.branch} />
                      <BankRow label="Branch Code" value={BANK.branchCode} />
                    </div>
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                      After transferring, email your proof of payment to <strong>info@peoplesrm.co.ke</strong> so we can acknowledge your contribution.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── INTERNATIONAL ── */}
          {region === 'international' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(['card', 'wire'] as IntlMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setIntlMethod(m); reset() }}
                    className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition ${
                      intlMethod === m
                        ? 'text-primary-blue border-b-2 border-primary-blue bg-primary-blue/5'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {m === 'card' ? '💳 Card Payment' : '🏦 Bank Wire'}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {intlMethod === 'card' && (
                  <form onSubmit={handleCard} className="space-y-4">
                    <AmountInput placeholder="e.g. 25" />
                    <div>
                      <label className={labelCls}>Full Name (optional)</label>
                      <input type="text" value={donorName} onChange={(e) => setDonorName(e.target.value)} className={inputCls} placeholder="Your name" />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                      <input type="email" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} required className={inputCls} placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className={labelCls}>Country</label>
                      <input type="text" value={donorCountry} onChange={(e) => setDonorCountry(e.target.value)} className={inputCls} placeholder="e.g. United Kingdom" />
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-xs text-blue-800 flex items-start gap-2">
                      <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      You will be redirected to a secure Stripe checkout. Visa, Mastercard, and Amex accepted.
                    </div>
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
                    <button
                      type="submit"
                      disabled={loading || !amount || !donorEmail}
                      className="w-full bg-primary-blue hover:bg-[#002244] text-white py-3 rounded-xl font-bold text-sm transition disabled:opacity-50"
                    >
                      {loading ? 'Redirecting to Stripe…' : `Donate $${amount ? parseFloat(amount).toLocaleString() : '—'} by Card`}
                    </button>
                  </form>
                )}

                {intlMethod === 'wire' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Send an international wire transfer to our Equity Bank account. Use your <strong>full name</strong> as the payment reference.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <BankRow label="Bank" value={BANK.name} />
                      <BankRow label="Bank Code" value={BANK.bankCode} />
                      <BankRow label="Account Name" value={BANK.accountName} />
                      <BankRow label="Account No." value={BANK.accountNumber} />
                      <BankRow label="SWIFT / BIC" value={BANK.swiftCode} />
                      <BankRow label="Branch" value={BANK.branch} />
                      <BankRow label="Branch Code" value={BANK.branchCode} />
                    </div>
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                      After transferring, email your confirmation to <strong>info@peoplesrm.co.ke</strong> so we can acknowledge your contribution.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* How your donation helps */}
      <div className="mt-8 bg-gradient-to-br from-primary-blue to-[#002244] text-white rounded-2xl p-5">
        <h3 className="text-base font-bold mb-3">How Your Donation Helps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            ['🤝', 'Grassroots organising & community outreach'],
            ['📋', 'Policy research and development'],
            ['📣', 'Campaigns, events and civic education'],
            ['💻', 'Digital platforms and communications'],
            ['🧑‍🤝‍🧑', 'Volunteer programmes and member services'],
            ['🏫', 'Youth and women empowerment programmes'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-start gap-2 text-xs text-blue-100">
              <span className="text-sm shrink-0">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-5">
        People&apos;s Renaissance Movement · All donations are used exclusively for party operations and programmes.
      </p>
    </div>
  )
}
