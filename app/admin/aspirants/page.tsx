'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'

interface AspirantItem {
  id: string
  idNumber: string
  memberName: string | null
  fullName: string | null
  email: string | null
  phone: string | null
  membership: { category: string | null; paid: boolean } | null
  election: { id: string; title: string; electionDate: string }
  position: { id: number; positionTitle: string; positionLevel: string; applicationFee: number | null }
  county: string | null
  constituency: string | null
  ward: string | null
  status: number
  feeStatus: 'paid' | 'pending' | 'unpaid'
  country: string
  certificateNumber: string | null
  certificateIssuedAt: string | null
  createdAt: string
}

const ASPIRANT_STATUS: Record<number, { label: string; className: string }> = {
  0: { label: 'Pending',  className: 'bg-amber-50 text-amber-700' },
  1: { label: 'Approved', className: 'bg-green-50 text-green-700' },
  2: { label: 'Rejected', className: 'bg-red-50 text-red-700' },
}

const FEE_STATUS: Record<string, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-green-50 text-green-700' },
  pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700' },
  unpaid: { label: 'Unpaid', className: 'bg-gray-100 text-gray-600' },
}

interface ElectionOption { id: string; title: string }
interface PositionOption { id: number; positionTitle: string; positionLevel: string }

const POSITION_LEVEL_LABELS: Record<string, string> = {
  '1': 'National', '2': 'County', '3': 'Constituency', '4': 'Ward',
}
const posLevelLabel = (l: string) => POSITION_LEVEL_LABELS[l] ?? l

// ── Email modal ──────────────────────────────────────────────────────────────
function EmailModal({
  filters,
  elections,
  onClose,
}: {
  filters: { status: string; electionId: string }
  elections: ElectionOption[]
  onClose: () => void
}) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null)
  const [error, setError] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/admin/aspirants/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          statusFilter: filters.status,
          electionId: filters.electionId || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const electionLabel = elections.find((e) => e.id === filters.electionId)?.title || 'All elections'
  const statusLabel =
    filters.status === '0' ? 'Pending' :
    filters.status === '1' ? 'Approved' :
    filters.status === '2' ? 'Rejected' : 'All statuses'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Send Email Notification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-800 mb-4">
            Recipients: aspirants matching <strong>{statusLabel}</strong> · <strong>{electionLabel}</strong>
          </div>

          {result ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 mb-1">Emails Sent</p>
              <p className="text-sm text-gray-600">
                <span className="text-green-600 font-semibold">{result.sent}</span> sent
                {result.failed > 0 && <>, <span className="text-red-600 font-semibold">{result.failed}</span> failed</>}
                {' '}out of <strong>{result.total}</strong> recipients
              </p>
              <button onClick={onClose} className="mt-5 bg-primary-blue text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#002244] transition">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                  placeholder="e.g. Important Update on Your Application"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button type="submit" disabled={sending} className="flex-1 bg-primary-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#002244] transition disabled:opacity-50">
                  {sending ? 'Sending…' : 'Send Email'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Payments modal ───────────────────────────────────────────────────────────
interface AspirantPaymentRecord {
  id: string
  method: string
  amount: number
  currency: string
  phone: string | null
  bankName: string | null
  transactionId: string | null
  status: string
  verifiedAt: string | null
  createdAt: string
}

const PAYMENT_STATUS_STYLE: Record<string, string> = {
  completed: 'bg-green-50 text-green-700',
  pending: 'bg-amber-50 text-amber-700',
  failed: 'bg-red-50 text-red-700',
}

function PaymentsModal({
  aspirant,
  onClose,
  onChanged,
}: {
  aspirant: AspirantItem
  onClose: () => void
  onChanged: () => void
}) {
  const [payments, setPayments] = useState<AspirantPaymentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [method, setMethod] = useState<'mpesa' | 'bank'>('bank')
  const [amount, setAmount] = useState(aspirant.position.applicationFee != null ? String(aspirant.position.applicationFee) : '')
  const [bankName, setBankName] = useState('')
  const [reference, setReference] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/aspirants/${aspirant.id}/payments`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load payments')
      setPayments(data.payments || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const verify = async (paymentId: string, status: 'completed' | 'failed') => {
    setBusyId(paymentId)
    setError('')
    try {
      const res = await fetch(`/api/admin/aspirants/${aspirant.id}/payments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update payment')
      await load()
      onChanged()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const recordPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/aspirants/${aspirant.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          amount: amount || undefined,
          bankName: method === 'bank' ? bankName : undefined,
          phone: method === 'mpesa' ? phone : undefined,
          transactionId: reference || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to record payment')
      setShowForm(false)
      setBankName('')
      setReference('')
      setPhone('')
      await load()
      onChanged()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Application Fee Payments</h2>
            <p className="text-xs text-gray-500">{aspirant.fullName || aspirant.memberName || aspirant.idNumber} · {aspirant.position.positionTitle}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto space-y-4">
          {aspirant.position.applicationFee != null && (
            <p className="text-xs text-gray-500">Application fee for this position: <span className="font-semibold text-gray-800">KES {aspirant.position.applicationFee.toLocaleString()}</span></p>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          {loading ? (
            <p className="text-sm text-gray-400 py-4 text-center">Loading…</p>
          ) : payments.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No payment attempts recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {payments.map((p) => (
                <div key={p.id} className="border border-gray-100 rounded-xl p-3.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-sm font-semibold text-gray-800 capitalize">{p.method === 'mpesa' ? 'M-Pesa' : `Bank — ${p.bankName || 'N/A'}`}</div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${PAYMENT_STATUS_STYLE[p.status] ?? 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    KES {p.amount.toLocaleString()} {p.transactionId && <>· Ref: <span className="font-mono">{p.transactionId}</span></>}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{new Date(p.createdAt).toLocaleString()}</div>
                  {p.status === 'pending' && (
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => verify(p.id, 'completed')}
                        disabled={busyId === p.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
                      >
                        Mark Verified
                      </button>
                      <button
                        onClick={() => verify(p.id, 'failed')}
                        disabled={busyId === p.id}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-semibold text-primary-blue hover:underline"
            >
              + Record a payment directly
            </button>
          ) : (
            <form onSubmit={recordPayment} className="border border-gray-100 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500">Use this when an aspirant pays cash in person, or you've verified their deposit outside the portal.</p>
              <div className="flex gap-2">
                <select value={method} onChange={(e) => setMethod(e.target.value as 'mpesa' | 'bank')} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="bank">Bank / Cash</option>
                  <option value="mpesa">M-Pesa</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="Amount (KES)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              {method === 'bank' ? (
                <input
                  type="text"
                  placeholder="Bank name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              ) : (
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              )}
              <input
                type="text"
                placeholder="Reference / receipt number"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="text-sm font-semibold px-4 py-2 rounded-lg bg-primary-blue text-white hover:bg-[#002244] transition disabled:opacity-50">
                  {saving ? 'Saving…' : 'Record Payment'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm font-semibold px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Delete confirmation modal ────────────────────────────────────────────────
function DeleteModal({
  aspirant,
  onConfirm,
  onClose,
}: {
  aspirant: AspirantItem
  onConfirm: () => Promise<void>
  onClose: () => void
}) {
  const [input, setInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const expectedName = (aspirant.fullName || aspirant.memberName || aspirant.idNumber).trim()
  const match = input.trim().toLowerCase() === expectedName.toLowerCase()

  const handleDelete = async () => {
    if (!match) return
    setDeleting(true)
    setError('')
    try {
      await onConfirm()
    } catch (err: any) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Delete Aspirant</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
            This action is <strong>permanent</strong> and cannot be undone. The aspirant application will be removed from all records.
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-3">
              To confirm, type the aspirant&apos;s name below:
              <span className="ml-1 font-semibold text-gray-900 font-mono">{expectedName}</span>
            </p>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && match && handleDelete()}
              autoFocus
              placeholder="Type name to confirm"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!match || deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-40"
            >
              {deleting ? 'Deleting…' : 'Delete Aspirant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminAspirantsPage() {
  const [aspirants, setAspirants] = useState<AspirantItem[]>([])
  const [elections, setElections] = useState<ElectionOption[]>([])
  const [positions, setPositions] = useState<PositionOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ status: '', electionId: '', positionId: '' })
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AspirantItem | null>(null)
  const [paymentsTarget, setPaymentsTarget] = useState<AspirantItem | null>(null)
  const [issuingId, setIssuingId] = useState<string | null>(null)

  useEffect(() => { fetchAspirants() }, [filters])

  const handleIssueCertificate = async (aspirant: AspirantItem) => {
    if (!confirm(`Issue a nomination certificate to ${aspirant.fullName || aspirant.memberName || aspirant.idNumber} for ${aspirant.position.positionTitle}? This makes them an official PM Party candidate.`)) {
      return
    }
    setIssuingId(aspirant.id)
    setError('')
    try {
      const res = await fetch(`/api/admin/aspirants/${aspirant.id}/certificate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to issue certificate')
      setAspirants((all) => all.map((a) => a.id === aspirant.id ? {
        ...a,
        certificateNumber: data.aspirant.certificateNumber,
        certificateIssuedAt: data.aspirant.certificateIssuedAt,
      } : a))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIssuingId(null)
    }
  }

  const fetchAspirants = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filters.status)     params.append('status', filters.status)
      if (filters.electionId) params.append('electionId', filters.electionId)
      if (filters.positionId) params.append('positionId', filters.positionId)
      const res = await fetch(`/api/admin/aspirants?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch aspirants')
      setAspirants(data.aspirants || [])
      setElections(data.elections || [])
      setPositions(data.positions || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load aspirants')
      setAspirants([])
    } finally {
      setLoading(false)
    }
  }

  // ── Excel export ────────────────────────────────────────────────────────
  const handleExportExcel = async () => {
    setExporting('excel')
    try {
      const { utils, writeFile } = await import('xlsx')
      const rows = aspirants.map((a, i) => ({
        '#': i + 1,
        'Full Name': a.fullName || a.memberName || a.idNumber,
        'ID Number': a.idNumber,
        'Email': a.email || '',
        'Phone': a.phone || '',
        'Election': a.election.title,
        'Position': a.position.positionTitle,
        'Level': posLevelLabel(a.position.positionLevel),
        'County': a.county || '',
        'Constituency': a.constituency || '',
        'Ward': a.ward || '',
        'Status': (ASPIRANT_STATUS[a.status] ?? ASPIRANT_STATUS[0]).label,
        'Applied On': new Date(a.createdAt).toLocaleDateString(),
      }))
      const ws = utils.json_to_sheet(rows)
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Aspirants')
      writeFile(wb, `aspirants-${new Date().toISOString().slice(0, 10)}.xlsx`)
    } finally {
      setExporting(null)
    }
  }

  // ── PDF export ──────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

      doc.setFontSize(14)
      doc.setTextColor(0, 51, 102)
      doc.text("People's Renaissance Movement", 14, 14)
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      doc.text(`Aspirant Applications — Generated ${new Date().toLocaleDateString()}`, 14, 21)
      doc.text(`Total: ${aspirants.length} records`, 14, 27)

      autoTable(doc, {
        startY: 32,
        head: [['#', 'Name', 'ID Number', 'Election', 'Position', 'Level', 'Area', 'Status', 'Applied']],
        body: aspirants.map((a, i) => [
          i + 1,
          a.fullName || a.memberName || a.idNumber,
          a.idNumber,
          a.election.title,
          a.position.positionTitle,
          posLevelLabel(a.position.positionLevel),
          [a.county, a.constituency, a.ward].filter(Boolean).join(', ') || '—',
          (ASPIRANT_STATUS[a.status] ?? ASPIRANT_STATUS[0]).label,
          new Date(a.createdAt).toLocaleDateString(),
        ]),
        headStyles: { fillColor: [0, 51, 102], textColor: 255, fontSize: 8, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8, textColor: 30 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: 14, right: 14 },
      })

      doc.save(`aspirants-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setExporting(null)
    }
  }

  const handleStatusChange = async (aspirant: AspirantItem, newStatus: number) => {
    const prev = aspirant.status
    // Optimistic update
    setAspirants((all) => all.map((a) => a.id === aspirant.id ? { ...a, status: newStatus } : a))
    try {
      const res = await fetch('/api/admin/aspirants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: aspirant.id, status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update')
      }
    } catch (err: any) {
      // Revert on failure
      setAspirants((all) => all.map((a) => a.id === aspirant.id ? { ...a, status: prev } : a))
      setError(err.message)
    }
  }

  const handleDelete = async (aspirant: AspirantItem) => {
    const res = await fetch('/api/admin/aspirants', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: aspirant.id }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to delete')
    setAspirants((prev) => prev.filter((a) => a.id !== aspirant.id))
    setDeleteTarget(null)
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white'

  if (loading && aspirants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Aspirant Applications" />
        <div className="p-8 text-center text-gray-500 text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Aspirant Applications">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/aspirants/new"
            className="flex items-center gap-1.5 px-3 py-2 bg-primary-blue hover:bg-[#002244] text-white text-xs font-semibold rounded-lg transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Register Aspirant
          </Link>
          <button
            onClick={handleExportExcel}
            disabled={exporting !== null || aspirants.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {exporting === 'excel' ? 'Exporting…' : 'Excel'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting !== null || aspirants.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {exporting === 'pdf' ? 'Exporting…' : 'PDF'}
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            disabled={aspirants.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary-blue hover:bg-[#002244] text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </button>
        </div>
      </AdminHeader>

      <div className="p-4 sm:p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-[10px] border border-gray-200 p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
              <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))} className={inputCls}>
                <option value="">All statuses</option>
                <option value="0">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Election</label>
              <select value={filters.electionId} onChange={(e) => setFilters((p) => ({ ...p, electionId: e.target.value }))} className={inputCls}>
                <option value="">All elections</option>
                {elections.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Position</label>
              <select value={filters.positionId} onChange={(e) => setFilters((p) => ({ ...p, positionId: e.target.value }))} className={inputCls}>
                <option value="">All positions</option>
                {positions.map((p) => <option key={p.id} value={String(p.id)}>{p.positionTitle} ({posLevelLabel(p.positionLevel)})</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', electionId: '', positionId: '' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {aspirants.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-gray-200 p-10 text-center">
            <p className="text-gray-400 text-sm">No aspirant applications found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-800">{aspirants.length}</span> application{aspirants.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Applicant', 'ID Number', 'Membership', 'Election', 'Position', 'Area', 'Status', 'Fee', 'Certificate', 'Applied', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {aspirants.map((a) => {
                    const s = ASPIRANT_STATUS[a.status] ?? ASPIRANT_STATUS[0]
                    return (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-medium text-gray-900">{a.fullName || a.memberName || a.idNumber}</p>
                          {a.email && <p className="text-xs text-gray-400">{a.email}</p>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs font-mono">{a.idNumber}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {a.membership ? (
                            <>
                              <p className="text-xs font-medium text-gray-800">{a.membership.category || 'Member'}</p>
                              {a.membership.paid ? (
                                <span className="inline-block mt-0.5 text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Paid</span>
                              ) : (
                                <span className="inline-block mt-0.5 text-[10px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Unpaid</span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Not a member</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800">{a.election.title}</p>
                          <p className="text-xs text-gray-400">{new Date(a.election.electionDate).toLocaleDateString()}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-800">{a.position.positionTitle}</p>
                          <p className="text-xs text-gray-400">{posLevelLabel(a.position.positionLevel)}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {[a.county, a.constituency, a.ward].filter(Boolean).join(' · ') || '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <select
                            value={a.status}
                            onChange={(e) => handleStatusChange(a, Number(e.target.value))}
                            className={`text-xs font-semibold rounded-md px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary-blue outline-none ${s.className}`}
                          >
                            <option value={0}>Pending</option>
                            <option value={1}>Approved</option>
                            <option value={2}>Rejected</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => setPaymentsTarget(a)}
                            className={`text-xs font-semibold rounded-full px-2.5 py-1 transition hover:opacity-80 ${FEE_STATUS[a.feeStatus].className}`}
                            title="View / record payments"
                          >
                            {FEE_STATUS[a.feeStatus].label}
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {a.certificateIssuedAt ? (
                            <span
                              className="text-xs font-semibold rounded-full px-2.5 py-1 bg-green-50 text-green-700"
                              title={a.certificateNumber ?? undefined}
                            >
                              Issued
                            </span>
                          ) : a.status === 1 ? (
                            <button
                              onClick={() => handleIssueCertificate(a)}
                              disabled={issuingId === a.id}
                              className="text-xs font-semibold rounded-full px-2.5 py-1 bg-primary-blue text-white hover:bg-[#002244] transition disabled:opacity-50"
                            >
                              {issuingId === a.id ? 'Issuing…' : 'Issue Certificate'}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => setDeleteTarget(a)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete aspirant"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showEmailModal && (
        <EmailModal
          filters={{ status: filters.status, electionId: filters.electionId }}
          elections={elections}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          aspirant={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {paymentsTarget && (
        <PaymentsModal
          aspirant={paymentsTarget}
          onClose={() => setPaymentsTarget(null)}
          onChanged={fetchAspirants}
        />
      )}
    </div>
  )
}
