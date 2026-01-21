'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'login'>('create')
  const [nationalId, setNationalId] = useState('')
  const [loginIdNumber, setLoginIdNumber] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [memberData, setMemberData] = useState<any>(null)
  const [loggedInMember, setLoggedInMember] = useState<any>(null)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Load member session from localStorage on page load
  useEffect(() => {
    const memberData = localStorage.getItem('memberSession')
    if (memberData) {
      try {
        const member = JSON.parse(memberData)
        setLoggedInMember(member)
        setActiveTab('login')
      } catch (e) {
        console.error('Error parsing member session:', e)
        localStorage.removeItem('memberSession')
      }
    }
  }, [])

  const handleFetchMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/membership/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch member data')
      }

      setMemberData(data.member)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/membership/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile')
      }

      setSuccess(true)
      if (data.tempPassword) {
        alert(`Profile created successfully! Your temporary password is: ${data.tempPassword}\n\nPlease change it after logging in.`)
      } else {
        alert('Profile created successfully!')
      }
      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/membership/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: loginIdNumber, password: loginPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      setLoggedInMember(data.member)
      // Store member session in localStorage
      localStorage.setItem('memberSession', JSON.stringify(data.member))
      setSuccess(true)
      setError('')
    } catch (err: any) {
      setError(err.message)
      setLoggedInMember(null)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!loginIdNumber) {
      setError('Please enter your ID Number first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/membership/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: loginIdNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      alert('A temporary password has been sent to your registered phone number.')
      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/membership/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: loggedInMember.idNumber,
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      alert('Password changed successfully!')
      setShowChangePassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setLoggedInMember(null)
    setLoginIdNumber('')
    setLoginPassword('')
    setSuccess(false)
    setShowChangePassword(false)
    localStorage.removeItem('memberSession')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Membership
        </h1>
        <div className="w-32 h-1 bg-primary-red mx-auto"></div>
        <p className="text-lg text-gray-600 mt-6">
          Join People&apos;s Renaissance Movement and be part of the change
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('create')
              setError('')
              setSuccess(false)
              setMemberData(null)
            }}
            className={`flex-1 py-3 px-4 text-center font-semibold transition ${
              activeTab === 'create'
                ? 'text-primary-blue border-b-2 border-primary-blue'
                : 'text-gray-600 hover:text-primary-blue'
            }`}
          >
            Create Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login')
              setError('')
              setSuccess(false)
              setMemberData(null)
            }}
            className={`flex-1 py-3 px-4 text-center font-semibold transition ${
              activeTab === 'login'
                ? 'text-primary-blue border-b-2 border-primary-blue'
                : 'text-gray-600 hover:text-primary-blue'
            }`}
          >
            Login
          </button>
        </div>

        {activeTab === 'create' ? (
          <>
            <h2 className="text-2xl font-bold text-primary-blue mb-6">
              Create Your Member Profile
            </h2>
            <p className="text-gray-700 mb-6">
              If you&apos;ve already registered with IPPMS (Integrated Political Party Management System), 
              enter your National ID below to fetch your details and create your profile on our platform.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-primary-blue mb-6">
              Member Login
            </h2>
            <p className="text-gray-700 mb-6">
              If you&apos;ve already created your profile, login using your ID Number and password.
            </p>
          </>
        )}

        {activeTab === 'create' ? (
          <>
            {!success ? (
              <form onSubmit={handleFetchMember} className="space-y-4">
                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-2">
                    National ID
                  </label>
                  <input
                    type="text"
                    id="nationalId"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="Enter your National ID"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
                >
                  {loading ? 'Fetching...' : 'Fetch Member Details'}
                </button>
              </form>
            ) : memberData ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                  Member details fetched successfully!
                </div>
                <div className="bg-gray-50 p-6 rounded-md">
                  <h3 className="font-semibold mb-4">Member Information:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {memberData.firstName} {memberData.lastName}</p>
                    <p><strong>ID Number:</strong> {memberData.idNumber}</p>
                    {memberData.membershipNo && <p><strong>Membership No:</strong> {memberData.membershipNo}</p>}
                    {memberData.dateOfBirth && <p><strong>Date of Birth:</strong> {new Date(memberData.dateOfBirth).toLocaleDateString()}</p>}
                    {memberData.gender && <p><strong>Gender:</strong> {memberData.gender}</p>}
                    {memberData.religion && <p><strong>Religion:</strong> {memberData.religion}</p>}
                    {memberData.ethnicity && <p><strong>Ethnicity:</strong> {memberData.ethnicity}</p>}
                    {memberData.county && <p><strong>County:</strong> {memberData.county}</p>}
                    {memberData.constituency && <p><strong>Constituency:</strong> {memberData.constituency}</p>}
                    {memberData.ward && <p><strong>Ward:</strong> {memberData.ward}</p>}
                    <p><strong>Youth:</strong> {memberData.youth ? 'Yes' : 'No'}</p>
                    <p><strong>PWD:</strong> {memberData.pwd ? 'Yes' : 'No'}</p>
                    {memberData.email && <p><strong>Email:</strong> {memberData.email}</p>}
                    {memberData.phone && <p><strong>Phone:</strong> {memberData.phone}</p>}
                  </div>
                </div>
                <form onSubmit={handleCreateProfile}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-red text-white px-6 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition disabled:opacity-50"
                  >
                    {loading ? 'Creating Profile...' : 'Create Profile'}
                  </button>
                </form>
              </div>
            ) : null}
          </>
        ) : (
          <>
            {!loggedInMember ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="loginIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="loginIdNumber"
                    value={loginIdNumber}
                    onChange={(e) => setLoginIdNumber(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="Enter your ID Number"
                  />
                </div>

                <div>
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="loginPassword"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-sm text-primary-blue hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-[#002244] transition disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                  Login successful! Welcome back, {loggedInMember.firstName} {loggedInMember.lastName}
                </div>
                <div className="bg-gray-50 p-6 rounded-md">
                  <h3 className="font-semibold mb-4">Your Profile:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {loggedInMember.firstName} {loggedInMember.lastName}</p>
                    <p><strong>ID Number:</strong> {loggedInMember.idNumber}</p>
                    {loggedInMember.membershipNo && <p><strong>Membership No:</strong> {loggedInMember.membershipNo}</p>}
                    {loggedInMember.dateOfBirth && <p><strong>Date of Birth:</strong> {new Date(loggedInMember.dateOfBirth).toLocaleDateString()}</p>}
                    {loggedInMember.gender && <p><strong>Gender:</strong> {loggedInMember.gender}</p>}
                    {loggedInMember.county && <p><strong>County:</strong> {loggedInMember.county}</p>}
                    {loggedInMember.constituency && <p><strong>Constituency:</strong> {loggedInMember.constituency}</p>}
                    {loggedInMember.ward && <p><strong>Ward:</strong> {loggedInMember.ward}</p>}
                    {loggedInMember.email && <p><strong>Email:</strong> {loggedInMember.email}</p>}
                    {loggedInMember.phone && <p><strong>Phone:</strong> {loggedInMember.phone}</p>}
                    {loggedInMember.ippmsDataSyncedAt && (
                      <p><strong>Last Updated:</strong> {new Date(loggedInMember.ippmsDataSyncedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                {!showChangePassword ? (
                  <div className="space-y-3">
                    <Link
                      href="/aspirants/apply"
                      className="block w-full bg-primary-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-[#002244] transition text-center"
                    >
                      Apply as Aspirant
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowChangePassword(true)}
                      className="w-full bg-primary-red text-white px-6 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Change Password</h4>
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
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary-red text-white px-6 py-3 rounded-md font-semibold hover:bg-[#9A162D] transition disabled:opacity-50"
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false)
                          setCurrentPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                          setError('')
                        }}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-primary-light rounded-lg p-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-4">
          Not Registered with IPPMS?
        </h2>
        <p className="text-gray-700 mb-6">
          To become a member of People&apos;s Renaissance Movement, you need to first register 
          through the Integrated Political Party Management System (IPPMS). Here&apos;s how:
        </p>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
          <li>Visit the official IPPMS portal at <a href="https://ippms.ke" target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">ippms.ke</a></li>
          <li>Create an account or log in if you already have one</li>
          <li>Complete the membership registration form</li>
          <li>Submit your registration and wait for approval</li>
          <li>Once approved, you&apos;ll receive your IPPMS ID</li>
          <li>Return here and enter your National ID to create your profile</li>
        </ol>
        <div className="bg-white p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> IPPMS registration is mandatory for all political party members 
            in Kenya as per the Political Parties Act. This ensures transparency and proper 
            management of party membership.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-primary-blue mb-6">
          Membership Categories
        </h2>
        <p className="text-gray-700 mb-6">
          Choose the membership category that best suits your commitment to People&apos;s Renaissance Movement.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-primary-blue text-white">
                <th className="border border-gray-300 px-4 py-3 text-left">Membership Type</th>
                <th className="border border-gray-300 px-4 py-3 text-right">Fees (KShs)</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Timelines</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Ordinary Membership</td>
                <td className="border border-gray-300 px-4 py-3 text-right">20.00</td>
                <td className="border border-gray-300 px-4 py-3">One-Off Payment</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Life Membership</td>
                <td className="border border-gray-300 px-4 py-3 text-right">20,000.00</td>
                <td className="border border-gray-300 px-4 py-3">Renewable Every 5 years</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Bronze Life Membership</td>
                <td className="border border-gray-300 px-4 py-3 text-right">50,000.00</td>
                <td className="border border-gray-300 px-4 py-3">Renewable Every 5 years</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Silver Life Membership</td>
                <td className="border border-gray-300 px-4 py-3 text-right">100,000.00</td>
                <td className="border border-gray-300 px-4 py-3">Renewable Every 5 years</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Gold Life Membership</td>
                <td className="border border-gray-300 px-4 py-3 text-right">1,000,000.00</td>
                <td className="border border-gray-300 px-4 py-3">Renewable Every 5 years</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Diamond Life Membership</td>
                <td className="border border-gray-300 px-4 py-3 text-right">5,000,000.00</td>
                <td className="border border-gray-300 px-4 py-3">Renewable Every 5 years</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium">Platinum Life Membership</td>
                <td className="border border-gray-300 px-4 py-3 text-right">20,000,000.00</td>
                <td className="border border-gray-300 px-4 py-3">Renewable Every 5 years</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-gray-700">
            <strong className="text-yellow-800">Important Note:</strong> To be an aspirant or party official, 
            you must be at least a Life Member and fully paid up.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/volunteer"
          className="text-primary-blue hover:underline"
        >
          Not ready to become a member? Consider volunteering instead →
        </Link>
      </div>
    </div>
  )
}

