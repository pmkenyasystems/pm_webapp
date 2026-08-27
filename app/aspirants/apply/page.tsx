'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const POSITION_LEVEL_LABELS: Record<string, string> = {
  '1': 'National',
  '2': 'County',
  '3': 'Constituency',
  '4': 'Ward',
}
const positionLevelLabel = (level: string) => POSITION_LEVEL_LABELS[level] ?? level

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
  countyCode: number
}

interface Ward {
  id: string
  wardCode: number
  wardName: string
  constituencyCode: number
}

interface PollingCentre {
  id: string
  centreCode: number
  centreName: string
  wardCode: number
}

export default function AspirantApplicationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
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
  const [pollingCentres, setPollingCentres] = useState<PollingCentre[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isRegisteredMember, setIsRegisteredMember] = useState(true)
  const [showMinCategoryDialog, setShowMinCategoryDialog] = useState(false)

  const positionMinCategories = [
    { level: 'National (1)', minCategory: 'Life Membership' },
    { level: 'County (2)', minCategory: 'Life Membership' },
    { level: 'Constituency (3)', minCategory: 'Life Membership' },
    { level: 'Ward (4)', minCategory: 'Ordinary Membership' },
  ]

  useEffect(() => {
    // Pre-fill ID from session if logged in
    const memberData = localStorage.getItem('memberSession')
    if (memberData) {
      try {
        const member = JSON.parse(memberData)
        if (member.idNumber) {
          setFormData(prev => ({
            ...prev,
            idNumber: member.idNumber,
            fullName: member.surname && member.otherNames
              ? `${member.surname} ${member.otherNames}`
              : prev.fullName,
            phone: member.phone || prev.phone,
            email: member.email || prev.email,
          }))
        }
      } catch {
        localStorage.removeItem('memberSession')
      }
    }

    // Load elections, positions and counties in parallel
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const next = { ...prev, [name]: value }
      if (name === 'countyCode') {
        next.constituencyCode = ''
        next.wardCode = ''
        next.pollingStation = ''
        fetchConstituencies(value)
      } else if (name === 'constituencyCode') {
        next.wardCode = ''
        next.pollingStation = ''
        fetchWards(value)
      } else if (name === 'wardCode') {
        next.pollingStation = ''
        fetchPollingCentres(value)
      }
      return next
    })
  }

  const fetchConstituencies = async (countyCode: string) => {
    if (!countyCode) { setConstituencies([]); return }
    try {
      const res = await fetch(`/api/locations/constituencies?countyCode=${countyCode}`)
      const data = await res.json()
      if (res.ok) setConstituencies(data.constituencies || [])
    } catch {
      console.error('Error fetching constituencies')
    }
  }

  const fetchWards = async (constituencyCode: string) => {
    if (!constituencyCode) { setWards([]); return }
    try {
      const res = await fetch(`/api/locations/wards?constituencyCode=${constituencyCode}`)
      const data = await res.json()
      if (res.ok) setWards(data.wards || [])
    } catch {
      console.error('Error fetching wards')
    }
  }

  const fetchPollingCentres = async (wardCode: string) => {
    if (!wardCode) { setPollingCentres([]); return }
    try {
      const res = await fetch(`/api/locations/polling-centres?wardCode=${wardCode}`)
      const data = await res.json()
      if (res.ok) setPollingCentres(data.pollingCentres || [])
    } catch {
      console.error('Error fetching polling centres')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/aspirants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: formData.idNumber.trim(),
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          electionId: formData.electionId,
          positionId: parseInt(formData.positionId),
          countyCode: formData.countyCode ? parseInt(formData.countyCode) : null,
          constituencyCode: formData.constituencyCode ? parseInt(formData.constituencyCode) : null,
          wardCode: formData.wardCode ? parseInt(formData.wardCode) : null,
          pollingStation: formData.pollingStation.trim() || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit application')

      setIsRegisteredMember(data.isRegisteredMember !== false)
      setSuccess(true)
      setFormData({
        fullName: '',
        idNumber: '',
        phone: '',
        email: '',
        electionId: '',
        positionId: '',
        countyCode: '',
        constituencyCode: '',
        wardCode: '',
        pollingStation: '',
      })
      setConstituencies([])
      setWards([])
      setPollingCentres([])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aspirant Application</h1>
          <p className="text-gray-600 mb-6">
            Fill in the details below to apply for a position in an upcoming election.
          </p>

          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-900 text-sm">
              Different positions require different minimum membership categories.{' '}
              <button
                type="button"
                onClick={() => setShowMinCategoryDialog(true)}
                className="text-primary-blue font-semibold hover:underline underline-offset-2"
              >
                View minimum categories by position.
              </button>
            </p>
          </div>

          {showMinCategoryDialog && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowMinCategoryDialog(false)}
            >
              <div
                className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Minimum membership categories by position level</h3>
                  <p className="text-sm text-gray-500 mt-1">You must meet the minimum category for the position you are applying for.</p>
                </div>
                <div className="p-6 overflow-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 pr-4 font-semibold text-gray-900">Position level</th>
                        <th className="py-2 font-semibold text-gray-900">Minimum membership category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positionMinCategories.map((row) => (
                        <tr key={row.level} className="border-b border-gray-100">
                          <td className="py-3 pr-4 text-gray-800">{row.level}</td>
                          <td className="py-3 text-gray-700">{row.minCategory}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowMinCategoryDialog(false)}
                    className="w-full bg-primary-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-[#002244] transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setSuccess(false)}
            >
              <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted</h3>
                  <p className="text-gray-700 text-sm">
                    Your application has been submitted successfully. You will get an update from the
                    National Elections Board very soon. For any inquiries, contact{' '}
                    <a href="mailto:neb@pmparty.ke" className="text-primary-blue font-semibold hover:underline">
                      neb@pmparty.ke
                    </a>
                    .
                  </p>
                  {!isRegisteredMember && (
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
                      <p className="text-amber-900 text-sm">
                        <strong>Note:</strong> Our records show you are not yet a registered member of the
                        Party. For your application to be approved by the National Elections Board, you must
                        first register as a <strong>Life Member</strong> of People&apos;s Renaissance Movement.
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="w-full bg-primary-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-[#002244] transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {loadingData ? (
            <div className="py-8 text-center text-gray-500">Loading form data...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullName" className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="idNumber" className={labelClass}>ID Number *</label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="National ID number"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0712 345 678"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Election & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="electionId" className={labelClass}>Election *</label>
                  <select
                    id="electionId"
                    name="electionId"
                    value={formData.electionId}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select an election</option>
                    {elections.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title} — {new Date(e.electionDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="positionId" className={labelClass}>Position Vying For *</label>
                  <select
                    id="positionId"
                    name="positionId"
                    value={formData.positionId}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Select a position</option>
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.positionTitle} ({positionLevelLabel(p.positionLevel)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="countyCode" className={labelClass}>County</label>
                  <select
                    id="countyCode"
                    name="countyCode"
                    value={formData.countyCode}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select a county</option>
                    {counties.map((c) => (
                      <option key={c.id} value={c.countyCode}>{c.countyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="constituencyCode" className={labelClass}>Constituency</label>
                  <select
                    id="constituencyCode"
                    name="constituencyCode"
                    value={formData.constituencyCode}
                    onChange={handleChange}
                    disabled={!formData.countyCode}
                    className={inputClass}
                  >
                    <option value="">
                      {formData.countyCode ? 'Select a constituency' : 'Select a county first'}
                    </option>
                    {constituencies.map((c) => (
                      <option key={c.id} value={c.constituencyCode}>{c.constituencyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="wardCode" className={labelClass}>Ward</label>
                  <select
                    id="wardCode"
                    name="wardCode"
                    value={formData.wardCode}
                    onChange={handleChange}
                    disabled={!formData.constituencyCode}
                    className={inputClass}
                  >
                    <option value="">
                      {formData.constituencyCode ? 'Select a ward' : 'Select a constituency first'}
                    </option>
                    {wards.map((w) => (
                      <option key={w.id} value={w.wardCode}>{w.wardName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="pollingStation" className={labelClass}>Polling Station</label>
                  <select
                    id="pollingStation"
                    name="pollingStation"
                    value={formData.pollingStation}
                    onChange={handleChange}
                    disabled={!formData.wardCode}
                    className={inputClass}
                  >
                    <option value="">
                      {formData.wardCode ? 'Select a polling station' : 'Select a ward first'}
                    </option>
                    {pollingCentres.map((p) => (
                      <option key={p.id} value={p.centreName}>{p.centreName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
                <Link
                  href="/membership/register"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition inline-block"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
