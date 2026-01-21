'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AspirantApplicationPage() {
  const router = useRouter()
  const [loggedInMember, setLoggedInMember] = useState<any>(null)
  const [elections, setElections] = useState<Election[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [formData, setFormData] = useState({
    electionId: '',
    positionId: '',
    country: 'Kenya',
    countyCode: '',
    constituencyCode: '',
    wardCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Check if member is logged in
    const memberData = localStorage.getItem('memberSession')
    if (memberData) {
      try {
        const member = JSON.parse(memberData)
        setLoggedInMember(member)
      } catch (e) {
        console.error('Error parsing member session:', e)
        localStorage.removeItem('memberSession')
        router.push('/membership')
      }
    } else {
      router.push('/membership')
      return
    }

    // Fetch initial data
    fetchInitialData()
  }, [router])

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

    if (!loggedInMember) {
      setError('Please log in to apply')
      router.push('/membership')
      return
    }

    try {
      const response = await fetch('/api/aspirants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: loggedInMember.idNumber,
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
      setFormData({
        electionId: '',
        positionId: '',
        country: 'Kenya',
        countyCode: '',
        constituencyCode: '',
        wardCode: '',
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return <div className="p-8">Loading...</div>
  }

  if (!loggedInMember) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aspirant Application</h1>
          <p className="text-gray-600 mb-8">
            Apply to be an aspirant in an upcoming election. Please fill in all required details.
          </p>

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

