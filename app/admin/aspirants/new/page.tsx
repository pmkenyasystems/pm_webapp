'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'

interface Election {
  id: string
  title: string
  electionDate: string
}
interface Position {
  id: number
  positionTitle: string
  positionLevel: string
}
interface County {
  id: string
  countyCode: number
  countyName: string
}
interface Constituency {
  id: string
  constituencyCode: number
  constituencyName: string
}
interface Ward {
  id: string
  wardCode: number
  wardName: string
}

type LookupState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'found'; name: string; category: string | null }
  | { status: 'inactive'; message: string }
  | { status: 'not-found' }
  | { status: 'error'; message: string }

export default function RegisterAspirantPage() {
  const router = useRouter()

  const [idNumber, setIdNumber] = useState('')
  const [lookup, setLookup] = useState<LookupState>({ status: 'idle' })

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    electionId: '',
    positionId: '',
    countyCode: '',
    constituencyCode: '',
    wardCode: '',
    pollingStation: '',
  })

  const [elections, setElections] = useState<Election[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ confirmationSent: boolean; confirmationEmail: string | null } | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/aspirants/elections'),
      fetch('/api/aspirants/positions'),
      fetch('/api/locations/counties'),
    ])
      .then(([eRes, pRes, cRes]) => Promise.all([eRes.json(), pRes.json(), cRes.json()]))
      .then(([eData, pData, cData]) => {
        setElections(eData.elections || [])
        setPositions(pData.positions || [])
        setCounties(cData.counties || [])
      })
      .catch(() => setError('Failed to load form data. Please refresh the page.'))
      .finally(() => setLoadingData(false))
  }, [])

  const runLookup = async () => {
    const trimmed = idNumber.trim()
    if (!trimmed) return
    setLookup({ status: 'loading' })
    try {
      const res = await fetch(`/api/aspirants/verify-member?idNumber=${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (!res.ok) {
        setLookup({ status: 'error', message: data.error || 'Failed to look up member' })
        return
      }
      if (data.found) {
        const name = `${data.member.surname} ${data.member.otherNames}`.trim()
        setLookup({ status: 'found', name, category: data.member.membershipCategory })
        setFormData((prev) => ({ ...prev, fullName: prev.fullName || name }))
      } else if (data.error) {
        // Member exists but isn't active — admin may still proceed, so surface as a warning, not a hard stop
        setLookup({ status: 'inactive', message: data.error })
      } else {
        setLookup({ status: 'not-found' })
      }
    } catch {
      setLookup({ status: 'error', message: 'Failed to look up member' })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'countyCode') {
        next.constituencyCode = ''
        next.wardCode = ''
        fetchConstituencies(value)
      } else if (name === 'constituencyCode') {
        next.wardCode = ''
        fetchWards(value)
      }
      return next
    })
  }

  const fetchConstituencies = async (countyCode: string) => {
    if (!countyCode) {
      setConstituencies([])
      return
    }
    try {
      const res = await fetch(`/api/locations/constituencies?countyCode=${countyCode}`)
      const data = await res.json()
      if (res.ok) setConstituencies(data.constituencies || [])
    } catch {
      console.error('Error fetching constituencies')
    }
  }

  const fetchWards = async (constituencyCode: string) => {
    if (!constituencyCode) {
      setWards([])
      return
    }
    try {
      const res = await fetch(`/api/locations/wards?constituencyCode=${constituencyCode}`)
      const data = await res.json()
      if (res.ok) setWards(data.wards || [])
    } catch {
      console.error('Error fetching wards')
    }
  }

  const memberVerified = lookup.status === 'found' || lookup.status === 'inactive'
  const canSubmit = memberVerified && formData.fullName.trim() && formData.electionId && formData.positionId

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/admin/aspirants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: idNumber.trim(),
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          electionId: formData.electionId,
          positionId: parseInt(formData.positionId),
          countyCode: formData.countyCode || null,
          constituencyCode: formData.constituencyCode || null,
          wardCode: formData.wardCode || null,
          pollingStation: formData.pollingStation.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to register aspirant')

      setResult({ confirmationSent: data.confirmationSent, confirmationEmail: data.confirmationEmail })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader title="Register Aspirant" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-[10px] border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aspirant registered</h2>
            {result.confirmationSent ? (
              <p className="text-gray-600 mb-6">
                A confirmation email with the position, election, area, and next steps has been sent to{' '}
                <strong>{result.confirmationEmail}</strong>.
              </p>
            ) : result.confirmationEmail ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6 text-sm">
                Aspirant was registered, but the confirmation email to {result.confirmationEmail} could not be
                sent. You may want to inform them directly.
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6 text-sm">
                Aspirant was registered, but no email address is on file for them, so no confirmation email
                was sent.
              </div>
            )}
            <div className="flex gap-3">
              <Link href="/admin/aspirants" className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition">
                Back to Aspirants
              </Link>
              <button
                onClick={() => {
                  setResult(null)
                  setIdNumber('')
                  setLookup({ status: 'idle' })
                  setFormData({
                    fullName: '', phone: '', email: '', electionId: '', positionId: '',
                    countyCode: '', constituencyCode: '', wardCode: '', pollingStation: '',
                  })
                  setConstituencies([])
                  setWards([])
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
              >
                Register Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Register Aspirant" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-gray-500 mb-6">
          Register a member as an aspirant on their behalf. They'll receive an email confirming their
          registration, the position and area they're vying for, and what happens next.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-[10px] border border-gray-200 p-8 space-y-6">
          <div>
            <label className={labelCls}>Member ID Number *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value)
                  setLookup({ status: 'idle' })
                }}
                onBlur={runLookup}
                placeholder="National ID number"
                required
                className={inputCls}
              />
              <button
                type="button"
                onClick={runLookup}
                disabled={!idNumber.trim() || lookup.status === 'loading'}
                className="whitespace-nowrap px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-md transition disabled:opacity-50"
              >
                {lookup.status === 'loading' ? 'Checking…' : 'Look Up'}
              </button>
            </div>

            {lookup.status === 'found' && (
              <p className="mt-2 text-sm text-green-700 flex items-center gap-1.5">
                <span>✓</span> {lookup.name}{lookup.category ? ` · ${lookup.category}` : ''}
              </p>
            )}
            {lookup.status === 'inactive' && (
              <p className="mt-2 text-sm text-amber-600">
                Member found, but {lookup.message.charAt(0).toLowerCase() + lookup.message.slice(1)} You can
                still register them — please enter their full name below.
              </p>
            )}
            {lookup.status === 'not-found' && (
              <p className="mt-2 text-sm text-red-600">
                No member found with this ID number. They need a member profile before they can be
                registered as an aspirant.
              </p>
            )}
            {lookup.status === 'error' && (
              <p className="mt-2 text-sm text-red-600">{lookup.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">
              Used to send the registration confirmation. If left blank, we'll use the member's email on file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Election *</label>
              <select name="electionId" value={formData.electionId} onChange={handleChange} required className={inputCls} disabled={loadingData}>
                <option value="">Select an election</option>
                {elections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.title} - {new Date(election.electionDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Position *</label>
              <select name="positionId" value={formData.positionId} onChange={handleChange} required className={inputCls} disabled={loadingData}>
                <option value="">Select a position</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.positionTitle} ({position.positionLevel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelCls}>County</label>
              <select name="countyCode" value={formData.countyCode} onChange={handleChange} className={inputCls}>
                <option value="">Select a county</option>
                {counties.map((county) => (
                  <option key={county.id} value={county.countyCode}>{county.countyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Constituency</label>
              <select name="constituencyCode" value={formData.constituencyCode} onChange={handleChange} disabled={!formData.countyCode} className={`${inputCls} disabled:bg-gray-100`}>
                <option value="">Select a constituency</option>
                {constituencies.map((c) => (
                  <option key={c.id} value={c.constituencyCode}>{c.constituencyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Ward</label>
              <select name="wardCode" value={formData.wardCode} onChange={handleChange} disabled={!formData.constituencyCode} className={`${inputCls} disabled:bg-gray-100`}>
                <option value="">Select a ward</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.wardCode}>{w.wardName}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Polling Station</label>
            <input type="text" name="pollingStation" value={formData.pollingStation} onChange={handleChange} className={inputCls} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
            >
              {submitting ? 'Registering…' : 'Register Aspirant'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
          {!canSubmit && lookup.status !== 'loading' && (
            <p className="text-xs text-gray-400">Look up a valid member ID and select an election and position to continue.</p>
          )}
        </form>
      </div>
    </div>
  )
}
