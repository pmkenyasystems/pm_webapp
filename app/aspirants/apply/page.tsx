'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

type Step = 1 | 2

interface VerifiedMember {
  surname: string
  otherNames: string
  idNumber: string
  membershipCategory: string | null
}

export default function AspirantApplicationPage() {
  const [step, setStep] = useState<Step>(1)
  const [idNumberInput, setIdNumberInput] = useState('')
  const [verifiedMember, setVerifiedMember] = useState<VerifiedMember | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [formData, setFormData] = useState({
    idNumber: '',
    electionId: '',
    positionId: '',
    country: 'Kenya',
    countyCode: '',
    constituencyCode: '',
    wardCode: '',
  })
  const [elections, setElections] = useState<Election[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showNotMemberDialog, setShowNotMemberDialog] = useState(false)
  const [showMinCategoryDialog, setShowMinCategoryDialog] = useState(false)

  // Position level → minimum membership category (update as per party policy)
  const positionMinCategories = [
    { level: 'National', minCategory: 'Life Membership' },
    { level: 'County', minCategory: 'Life Membership' },
    { level: 'Constituency', minCategory: 'Life Membership' },
    { level: 'Ward', minCategory: 'Ordinary Membership' },
    { level: 'Polling Station', minCategory: 'Ordinary Membership' },
  ]

  // Pre-fill ID from session if logged in (step 1 only)
  useEffect(() => {
    const memberData = localStorage.getItem('memberSession')
    if (memberData) {
      try {
        const member = JSON.parse(memberData)
        if (member.idNumber) setIdNumberInput(member.idNumber)
      } catch {
        localStorage.removeItem('memberSession')
      }
    }
  }, [])

  const handleProceed = async () => {
    const id = idNumberInput.trim()
    if (!id) {
      setError('Please enter your ID number.')
      return
    }
    setVerifying(true)
    setError('')
    try {
      const res = await fetch(`/api/aspirants/verify-member?idNumber=${encodeURIComponent(id)}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to verify member.')
        setVerifying(false)
        return
      }
      if (!data.found) {
        setShowNotMemberDialog(true)
        setVerifying(false)
        return
      }
      setVerifiedMember(data.member)
      setFormData(prev => ({ ...prev, idNumber: data.member.idNumber }))
      setStep(2)
      setLoadingData(true)
      fetchInitialData()
    } catch {
      setError('Failed to verify member. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const fetchInitialData = async () => {
    try {
      const [electionsRes, positionsRes, countiesRes] = await Promise.all([
        fetch('/api/aspirants/elections'),
        fetch('/api/aspirants/positions'),
        fetch('/api/locations/counties'),
      ])

      const [electionsData, positionsData, countiesData] = await Promise.all([
        electionsRes.json(),
        positionsRes.json(),
        countiesRes.json(),
      ])

      if (electionsRes.ok) setElections(electionsData.elections || [])
      if (positionsRes.ok) setPositions(positionsData.positions || [])
      if (countiesRes.ok) setCounties(countiesData.counties || [])
    } catch (err: any) {
      setError('Failed to load application data')
    } finally {
      setLoadingData(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }

      // Reset dependent fields when parent changes
      if (name === 'countyCode') {
        newData.constituencyCode = ''
        newData.wardCode = ''
        fetchConstituencies(value)
      } else if (name === 'constituencyCode') {
        newData.wardCode = ''
        fetchWards(value)
      } else if (name === 'positionId') {
        // Filter positions based on selected position level if needed
        const selectedPosition = positions.find(p => p.id.toString() === value)
        if (selectedPosition) {
          // You can add logic here to filter counties/constituencies/wards based on position level
        }
      }

      return newData
    })
  }

  const fetchConstituencies = async (countyCode: string) => {
    if (!countyCode) {
      setConstituencies([])
      return
    }

    try {
      const response = await fetch(`/api/locations/constituencies?countyCode=${countyCode}`)
      const data = await response.json()
      if (response.ok) {
        setConstituencies(data.constituencies || [])
      }
    } catch (err) {
      console.error('Error fetching constituencies:', err)
    }
  }

  const fetchWards = async (constituencyCode: string) => {
    if (!constituencyCode) {
      setWards([])
      return
    }

    try {
      const response = await fetch(`/api/locations/wards?constituencyCode=${constituencyCode}`)
      const data = await response.json()
      if (response.ok) {
        setWards(data.wards || [])
      }
    } catch (err) {
      console.error('Error fetching wards:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!formData.idNumber?.trim()) {
      setError('ID Number is required to apply.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/aspirants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: formData.idNumber.trim(),
          electionId: formData.electionId,
          positionId: parseInt(formData.positionId),
          country: formData.country,
          countyCode: formData.countyCode ? parseInt(formData.countyCode) : null,
          constituencyCode: formData.constituencyCode ? parseInt(formData.constituencyCode) : null,
          wardCode: formData.wardCode ? parseInt(formData.wardCode) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setSuccess(true)
      setFormData(prev => ({
        ...prev,
        electionId: '',
        positionId: '',
        country: 'Kenya',
        countyCode: '',
        constituencyCode: '',
        wardCode: '',
      }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Step 1: Enter ID number and proceed
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aspirant Application</h1>
            <p className="text-gray-600 mb-8">
              Apply to be an aspirant in an upcoming election. First, enter your ID number to verify your membership.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            {showNotMemberDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowNotMemberDialog(false)}>
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-gray-900">Not registered as a member</h3>
                  <p className="text-gray-600">
                    You must first be a member of the party in order to apply as an aspirant.
                  </p>
                  <p className="text-sm text-gray-500">
                    Register through the Integrated Political Party Management System (IPPMS), then return here to apply.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href="https://ippms.ke"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-primary-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-[#002244] transition"
                    >
                      Go to IPPMS to register
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowNotMemberDialog(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                ID Number *
              </label>
              <input
                type="text"
                id="idNumber"
                value={idNumberInput}
                onChange={(e) => setIdNumberInput(e.target.value)}
                placeholder="Enter your national ID number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                disabled={verifying}
              />
              <p className="text-sm text-gray-500">
                You must be a registered party member. Not yet a member? <Link href="/membership" className="text-primary-blue hover:underline">Join here</Link>.
              </p>
              <button
                type="button"
                onClick={handleProceed}
                disabled={verifying}
                className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Proceed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Application form (member verified)
  if (loadingData) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aspirant Application</h1>
          {verifiedMember && (
            <div className="text-gray-600 mb-2 space-y-0.5">
              <p>
                Applying as <strong>{verifiedMember.surname} {verifiedMember.otherNames}</strong> (ID: {verifiedMember.idNumber})
              </p>
              {verifiedMember.membershipCategory && (
                <p className="text-sm text-gray-500">
                  Membership category: <strong>{verifiedMember.membershipCategory}</strong>
                </p>
              )}
            </div>
          )}
          <p className="text-gray-600 mb-8">
            Fill in the details below to apply for a position in an upcoming election.
          </p>
          <button
            type="button"
            onClick={() => { setStep(1); setVerifiedMember(null); setError(''); setIdNumberInput(''); }}
            className="text-sm text-primary-blue hover:underline mb-4"
          >
            ← Use a different ID number
          </button>

          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-900 text-sm">
              Different positions require different minimum membership categories.{' '}
              <button
                type="button"
                onClick={() => setShowMinCategoryDialog(true)}
                className="text-primary-blue font-semibold hover:underline underline-offset-2"
              >
                Click here to view the minimum categories for the various positions.
              </button>
            </p>
          </div>

          {showMinCategoryDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowMinCategoryDialog(false)}>
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
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
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
              Application submitted successfully! Your application is pending review.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="electionId" className="block text-sm font-medium text-gray-700 mb-2">
                Election *
              </label>
              <select
                id="electionId"
                name="electionId"
                value={formData.electionId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">Select an election</option>
                {elections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.title} - {new Date(election.electionDate).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="positionId" className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <select
                id="positionId"
                name="positionId"
                value={formData.positionId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">Select a position</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.positionTitle} ({position.positionLevel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="countyCode" className="block text-sm font-medium text-gray-700 mb-2">
                County
              </label>
              <select
                id="countyCode"
                name="countyCode"
                value={formData.countyCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="">Select a county</option>
                {counties.map((county) => (
                  <option key={county.id} value={county.countyCode}>
                    {county.countyName}
                  </option>
                ))}
              </select>
            </div>

            {formData.countyCode && (
              <div>
                <label htmlFor="constituencyCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Constituency
                </label>
                <select
                  id="constituencyCode"
                  name="constituencyCode"
                  value={formData.constituencyCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="">Select a constituency</option>
                  {constituencies.map((constituency) => (
                    <option key={constituency.id} value={constituency.constituencyCode}>
                      {constituency.constituencyName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.constituencyCode && (
              <div>
                <label htmlFor="wardCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Ward
                </label>
                <select
                  id="wardCode"
                  name="wardCode"
                  value={formData.wardCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="">Select a ward</option>
                  {wards.map((ward) => (
                    <option key={ward.id} value={ward.wardCode}>
                      {ward.wardName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <Link
                href="/membership"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition inline-block"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

