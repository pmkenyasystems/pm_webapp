'use client'

import { useState } from 'react'

interface Payment {
  id: string
  method: string
  amount: number
  currency: string
  bankName: string | null
  transactionId: string | null
  status: string
  createdAt: string
}

interface Application {
  id: string
  election: { title: string }
  position: { positionTitle: string; positionLevel: string }
  status: number
  statusLabel: string
  applicationFee: number | null
  feeStatus: 'paid' | 'pending' | 'unpaid'
  payments: Payment[]
}

const APPLICATION_STATUS_STYLE: Record<number, string> = {
  0: 'bg-amber-50 text-amber-700',
  1: 'bg-green-50 text-green-700',
  2: 'bg-red-50 text-red-700',
}

function formatMoney(amount: number, currency = 'KES') {
  return `${currency} ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AspirantPaymentPanel({
  application,
  idNumber,
  onUpdate,
}: {
  application: Application
  idNumber: string
  onUpdate: () => void
}) {
  const [method, setMethod] = useState<'mpesa' | 'bank' | null>(null)
  const [phone, setPhone] = useState('')
  const [bankName, setBankName] = useState('')
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const latestPayment = application.payments[0]

  const submitMpesa = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`/api/aspirants/${application.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, method: 'mpesa', phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initiate payment')
      setMessage(data.message)
      setMethod(null)
      onUpdate()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const submitBank = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`/api/aspirants/${application.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber, method: 'bank', bankName: bankName.trim(), transactionId: reference.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to record deposit')
      setMessage(data.message)
      setMethod(null)
      setBankName('')
      setReference('')
      onUpdate()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
        <div>
          <div className="font-semibold text-[14.5px]">{application.position.positionTitle}</div>
          <div className="text-[13px] text-gray-500">{application.election.title}</div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${APPLICATION_STATUS_STYLE[application.status]}`}>
          {application.statusLabel}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-[13px] font-semibold text-gray-700">Application Fee</div>
          {application.feeStatus === 'paid' && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700">Paid</span>
          )}
          {application.feeStatus === 'pending' && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
              {latestPayment?.method === 'mpesa' ? 'Awaiting M-Pesa confirmation' : 'Awaiting verification'}
            </span>
          )}
          {application.feeStatus === 'unpaid' && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">Not paid</span>
          )}
        </div>

        {application.applicationFee == null ? (
          <p className="text-[13px] text-gray-400 mt-2">
            The application fee for this position hasn't been set yet — check back soon.
          </p>
        ) : (
          <>
            <p className="text-[13px] text-gray-500 mt-1">
              {formatMoney(application.applicationFee)}
              {application.feeStatus === 'paid' && latestPayment && (
                <span> · paid via {latestPayment.method === 'mpesa' ? 'M-Pesa' : 'bank deposit'} on {formatDate(latestPayment.createdAt)}</span>
              )}
            </p>

            {application.feeStatus === 'unpaid' && application.status !== 2 && (
              <div className="mt-3">
                {!method ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMethod('mpesa')}
                      className="text-xs font-bold px-3 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition"
                    >
                      Pay via M-Pesa
                    </button>
                    <button
                      onClick={() => setMethod('bank')}
                      className="text-xs font-bold px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                      I paid via bank deposit
                    </button>
                  </div>
                ) : method === 'mpesa' ? (
                  <form onSubmit={submitMpesa} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="M-Pesa phone number (07XXXXXXXX)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    />
                    <div className="flex gap-2">
                      <button type="submit" disabled={submitting} className="text-xs font-bold px-3 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition disabled:opacity-50">
                        {submitting ? 'Sending…' : 'Send STK Push'}
                      </button>
                      <button type="button" onClick={() => setMethod(null)} className="text-xs font-semibold text-gray-400 hover:text-gray-600">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={submitBank} className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Bank name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Deposit slip / reference number"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={submitting} className="text-xs font-bold px-3 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition disabled:opacity-50">
                        {submitting ? 'Submitting…' : 'Submit Deposit Reference'}
                      </button>
                      <button type="button" onClick={() => setMethod(null)} className="text-xs font-semibold text-gray-400 hover:text-gray-600">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </>
        )}

        {message && <p className="text-[13px] text-green-700 mt-2">{message}</p>}
        {error && <p className="text-[13px] text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  )
}
