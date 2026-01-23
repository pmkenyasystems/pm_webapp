'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Member {
  id: string
  firstName: string
  lastName: string
  idNumber: string
  membershipNo?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  religion?: string
  ethnicity?: string
  address?: string
  county?: string
  constituency?: string
  ward?: string
  youth?: boolean
  pwd?: boolean
  membershipDate: string
  status: string
  membershipCategory?: {
    id: string
    title: string
    fee: number
    timeline: string
  } | null
}

interface SubscriptionPayment {
  id: string
  amount: number
  currency: string
  paymentMethod: string
  status: string
  createdAt: string
  periodStart: string
  periodEnd: string
}

export default function MemberProfilePage() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [payments, setPayments] = useState<SubscriptionPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'profile' | 'payments' | 'pay' | 'aspirant' | 'change-password'>('profile')
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  
  // Aspirant application form state
  const [elections, setElections] = useState<any[]>([])
  const [positions, setPositions] = useState<any[]>([])
  const [counties, setCounties] = useState<any[]>([])
  const [constituencies, setConstituencies] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [aspirantFormData, setAspirantFormData] = useState({
    electionId: '',
    positionId: '',
    country: 'Kenya',
    countyCode: '',
    constituencyCode: '',
    wardCode: '',
  })
  const [aspirantLoading, setAspirantLoading] = useState(false)
  const [aspirantLoadingData, setAspirantLoadingData] = useState(false)
  const [aspirantError, setAspirantError] = useState('')
  const [aspirantSuccess, setAspirantSuccess] = useState(false)

  useEffect(() => {
    // Check if member is logged in
    const memberData = localStorage.getItem('memberSession')
    if (!memberData) {
      router.push('/membership')
      return
    }

    try {
      const memberObj = JSON.parse(memberData)
      setMember(memberObj)
      fetchPayments(memberObj.idNumber)
      
      // Check if there's a section parameter in the URL (e.g., from redirect)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const section = urlParams.get('section')
        if (section === 'aspirant') {
          setActiveSection('aspirant')
        }
      }
    } catch (e) {
      console.error('Error parsing member session:', e)
      localStorage.removeItem('memberSession')
      router.push('/membership')
    } finally {
      setLoading(false)
    }
  }, [router])

  // Fetch aspirant application data when section is active
  useEffect(() => {
    if (activeSection === 'aspirant' && !aspirantLoadingData && elections.length === 0) {
      fetchAspirantData()
    }
  }, [activeSection])

  const fetchAspirantData = async () => {
    setAspirantLoadingData(true)
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
      setAspirantError('Failed to load application data')
    } finally {
      setAspirantLoadingData(false)
    }
  }

  const handleAspirantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAspirantFormData(prev => {
      const newData = { ...prev, [name]: value }

      // Reset dependent fields when parent changes
      if (name === 'countyCode') {
        newData.constituencyCode = ''
        newData.wardCode = ''
        fetchConstituencies(value)
      } else if (name === 'constituencyCode') {
        newData.wardCode = ''
        fetchWards(value)
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

  const handleAspirantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAspirantLoading(true)
    setAspirantError('')
    setAspirantSuccess(false)

    if (!member) {
      setAspirantError('Please log in to apply')
      return
    }

    try {
      const response = await fetch('/api/aspirants/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: member.idNumber,
          electionId: aspirantFormData.electionId,
          positionId: parseInt(aspirantFormData.positionId),
          country: aspirantFormData.country,
          countyCode: aspirantFormData.countyCode ? parseInt(aspirantFormData.countyCode) : null,
          constituencyCode: aspirantFormData.constituencyCode ? parseInt(aspirantFormData.constituencyCode) : null,
          wardCode: aspirantFormData.wardCode ? parseInt(aspirantFormData.wardCode) : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setAspirantSuccess(true)
      setAspirantFormData({
        electionId: '',
        positionId: '',
        country: 'Kenya',
        countyCode: '',
        constituencyCode: '',
        wardCode: '',
      })
      setConstituencies([])
      setWards([])
    } catch (err: any) {
      setAspirantError(err.message)
    } finally {
      setAspirantLoading(false)
    }
  }

  const fetchPayments = async (idNumber: string) => {
    try {
      const response = await fetch(`/api/membership/payments?idNumber=${idNumber}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      } else {
        // If API returns error, just set empty array (model might not have data yet)
        setPayments([])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      setPayments([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('memberSession')
    router.push('/membership')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }

    setChangingPassword(true)

    try {
      const response = await fetch('/api/membership/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: member?.idNumber,
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowChangePassword(false)
    } catch (err: any) {
      setPasswordError(err.message)
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, {member.firstName} {member.lastName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex space-x-1 p-2" aria-label="Tabs">
            <button
              onClick={() => setActiveSection('profile')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeSection === 'profile'
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveSection('payments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeSection === 'payments'
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveSection('pay')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeSection === 'pay'
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pay Subscription
            </button>
            <button
              onClick={() => setActiveSection('aspirant')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeSection === 'aspirant'
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Apply As Aspirant
            </button>
            <button
              onClick={() => {
                setActiveSection('change-password')
                setShowChangePassword(true)
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeSection === 'change-password'
                  ? 'bg-primary-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Change Password
            </button>
          </nav>
        </div>

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{member.firstName} {member.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <p className="text-gray-900">{member.idNumber}</p>
              </div>
              {member.membershipNo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Number</label>
                  <p className="text-gray-900">{member.membershipNo}</p>
                </div>
              )}
              {member.membershipCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Category</label>
                  <p className="text-gray-900">{member.membershipCategory.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Fee: KSh {member.membershipCategory.fee.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | {member.membershipCategory.timeline}
                  </p>
                </div>
              )}
              {member.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{member.email}</p>
                </div>
              )}
              {member.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{member.phone}</p>
                </div>
              )}
              {member.dateOfBirth && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <p className="text-gray-900">{new Date(member.dateOfBirth).toLocaleDateString()}</p>
                </div>
              )}
              {member.gender && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <p className="text-gray-900">{member.gender}</p>
                </div>
              )}
              {member.religion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <p className="text-gray-900">{member.religion}</p>
                </div>
              )}
              {member.ethnicity && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                  <p className="text-gray-900">{member.ethnicity}</p>
                </div>
              )}
              {member.address && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">{member.address}</p>
                </div>
              )}
              {member.county && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                  <p className="text-gray-900">{member.county}</p>
                </div>
              )}
              {member.constituency && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Constituency</label>
                  <p className="text-gray-900">{member.constituency}</p>
                </div>
              )}
              {member.ward && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                  <p className="text-gray-900">{member.ward}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Date</label>
                <p className="text-gray-900">{new Date(member.membershipDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payments Section */}
        {activeSection === 'payments' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Membership Subscription Payments</h2>
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No payment records found.</p>
                <button
                  onClick={() => setActiveSection('pay')}
                  className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-[#002244] transition"
                >
                  Make Your First Payment
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.periodStart).toLocaleDateString()} - {new Date(payment.periodEnd).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pay Subscription Section */}
        {activeSection === 'pay' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pay Membership Subscription</h2>
            <div className="max-w-2xl">
              <p className="text-gray-600 mb-6">
                Membership subscription is valid for 5 years. Please select your payment method below.
              </p>
              <div className="space-y-4">
                <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-primary-blue transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">M-Pesa</h3>
                      <p className="text-sm text-gray-600">Pay via M-Pesa mobile money</p>
                    </div>
                    <button className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-[#002244] transition">
                      Pay Now
                    </button>
                  </div>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-primary-blue transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Card Payment</h3>
                      <p className="text-sm text-gray-600">Pay via credit or debit card</p>
                    </div>
                    <button className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-[#002244] transition">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Note: Payment processing will be implemented soon. Please contact support for manual payment processing.
              </p>
            </div>
          </div>
        )}

        {/* Aspirant Application Section */}
        {activeSection === 'aspirant' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Apply As Aspirant</h2>
            <p className="text-gray-600 mb-6">
              Apply to be an aspirant in an upcoming election. Please fill in all required details.
            </p>

            {aspirantSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                Application submitted successfully! Your application is pending review.
              </div>
            )}

            {aspirantError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {aspirantError}
              </div>
            )}

            {aspirantLoadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mx-auto mb-4"></div>
                <p className="text-gray-600">Loading application data...</p>
              </div>
            ) : (
              <form onSubmit={handleAspirantSubmit} className="space-y-6">
                <div>
                  <label htmlFor="electionId" className="block text-sm font-medium text-gray-700 mb-2">
                    Election *
                  </label>
                  <select
                    id="electionId"
                    name="electionId"
                    value={aspirantFormData.electionId}
                    onChange={handleAspirantChange}
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
                    value={aspirantFormData.positionId}
                    onChange={handleAspirantChange}
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
                    value={aspirantFormData.country}
                    onChange={handleAspirantChange}
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
                    value={aspirantFormData.countyCode}
                    onChange={handleAspirantChange}
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

                {aspirantFormData.countyCode && (
                  <div>
                    <label htmlFor="constituencyCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Constituency
                    </label>
                    <select
                      id="constituencyCode"
                      name="constituencyCode"
                      value={aspirantFormData.constituencyCode}
                      onChange={handleAspirantChange}
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

                {aspirantFormData.constituencyCode && (
                  <div>
                    <label htmlFor="wardCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Ward
                    </label>
                    <select
                      id="wardCode"
                      name="wardCode"
                      value={aspirantFormData.wardCode}
                      onChange={handleAspirantChange}
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
                    disabled={aspirantLoading}
                    className="bg-primary-blue text-white px-6 py-2 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
                  >
                    {aspirantLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAspirantFormData({
                        electionId: '',
                        positionId: '',
                        country: 'Kenya',
                        countyCode: '',
                        constituencyCode: '',
                        wardCode: '',
                      })
                      setConstituencies([])
                      setWards([])
                      setAspirantError('')
                      setAspirantSuccess(false)
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Change Password Section */}
        {(activeSection === 'change-password' || showChangePassword) && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {passwordError}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-[#002244] transition disabled:opacity-50"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false)
                    setActiveSection('profile')
                    setPasswordError('')
                    setPasswordSuccess('')
                  }}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

