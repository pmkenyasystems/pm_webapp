'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PageLoader from '@/components/PageLoader'
import AspirantPaymentPanel from '@/components/membership/AspirantPaymentPanel'

interface Member {
  id: number
  idNumber: string
  surname: string
  otherNames: string
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
    timeline: number
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

interface MemberDonation {
  id: string
  amount: number
  currency: string
  paymentMethod: string
  transactionId?: string | null
  createdAt: string
}

interface ElectionItem {
  id: string
  title: string
  description?: string | null
  electionDate: string
  isActive: boolean
}

type Section = 'overview' | 'membership' | 'donations' | 'applications' | 'candidatures'

const sectionLabels: Record<Section, string> = {
  overview: 'Overview',
  membership: 'Membership & Renewal',
  donations: 'Donation History',
  applications: 'My Applications',
  candidatures: 'Candidature Profiles',
}

function formatDate(iso?: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatMoney(amount: number, currency = 'KES') {
  return `${currency} ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`
}

export default function MemberDashboardPage() {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('overview')

  const [payments, setPayments] = useState<SubscriptionPayment[]>([])
  const [donations, setDonations] = useState<MemberDonation[]>([])

  const [showRenewOptions, setShowRenewOptions] = useState(false)
  const [downloadingCard, setDownloadingCard] = useState(false)

  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Aspirant application form state
  const [elections, setElections] = useState<ElectionItem[]>([])
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
  const [showAspirantForm, setShowAspirantForm] = useState(false)
  const [myApplications, setMyApplications] = useState<any[]>([])
  const [myApplicationsLoading, setMyApplicationsLoading] = useState(false)

  useEffect(() => {
    const memberData = localStorage.getItem('memberSession')
    if (!memberData) {
      router.push('/membership/login')
      return
    }

    try {
      const memberObj = JSON.parse(memberData)
      setMember(memberObj)
      fetchPayments(memberObj.idNumber)
      fetchDonations(memberObj.idNumber)

      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const section = urlParams.get('section')
        if (section === 'applications' || section === 'elections') setActiveSection('applications')
        else if (section === 'candidatures') setActiveSection('candidatures')
        else if (section === 'donations') setActiveSection('donations')
        else if (section === 'membership') setActiveSection('membership')
      }
    } catch (e) {
      console.error('Error parsing member session:', e)
      localStorage.removeItem('memberSession')
      router.push('/membership/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (activeSection === 'applications' && elections.length === 0 && !aspirantLoadingData) {
      fetchAspirantData()
    }
    if ((activeSection === 'applications' || activeSection === 'candidatures') && member) {
      fetchMyApplications()
    }
  }, [activeSection, member])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchPayments = async (idNumber: string) => {
    try {
      const response = await fetch(`/api/membership/payments?idNumber=${idNumber}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      } else {
        setPayments([])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      setPayments([])
    }
  }

  const fetchDonations = async (idNumber: string) => {
    try {
      const response = await fetch(`/api/membership/donations?idNumber=${idNumber}`)
      if (response.ok) {
        const data = await response.json()
        setDonations(data.donations || [])
      } else {
        setDonations([])
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
      setDonations([])
    }
  }

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
      setAspirantError('Failed to load election data')
    } finally {
      setAspirantLoadingData(false)
    }
  }

  const fetchMyApplications = async () => {
    if (!member) return
    setMyApplicationsLoading(true)
    try {
      const res = await fetch(`/api/aspirants/mine?idNumber=${member.idNumber}`)
      const data = await res.json()
      if (res.ok) setMyApplications(data.applications || [])
    } catch (err) {
      console.error('Error fetching my applications:', err)
    } finally {
      setMyApplicationsLoading(false)
    }
  }

  const handleAspirantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAspirantFormData(prev => {
      const newData = { ...prev, [name]: value }

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
      if (response.ok) setConstituencies(data.constituencies || [])
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
      if (response.ok) setWards(data.wards || [])
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
      setAspirantLoading(false)
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
      if (!response.ok) throw new Error(data.error || 'Failed to change password')

      setPasswordSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setShowChangePassword(false), 1200)
    } catch (err: any) {
      setPasswordError(err.message)
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('memberSession')
    router.push('/membership/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <PageLoader size="lg" label="Loading your dashboard…" />
      </div>
    )
  }

  if (!member) return null

  const initials = `${member.surname?.[0] ?? ''}${member.otherNames?.[0] ?? ''}`.toUpperCase() || 'M'
  const fullName = `${member.surname} ${member.otherNames}`.trim()
  const tierLabel = member.membershipCategory?.title || 'Standard'

  const completedPayments = payments.filter(p => p.status === 'completed')
  const latestCompleted = completedPayments[0]
  const yearsAsMember = Math.max(
    0,
    Math.floor((Date.now() - new Date(member.membershipDate).getTime()) / (365.25 * 24 * 3600 * 1000))
  )
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
  const donationCurrency = donations[0]?.currency || 'KES'

  const kpis = [
    { label: 'Years as Member', value: String(yearsAsMember) },
    { label: 'Subscriptions Paid', value: String(completedPayments.length) },
    { label: 'Total Donated', value: formatMoney(totalDonated, donationCurrency) },
  ]

  const navItems: { key: Section; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'membership', label: 'Membership & Renewal' },
    { key: 'donations', label: 'Donation History' },
    { key: 'applications', label: 'My Applications' },
    { key: 'candidatures', label: 'Candidature Profiles' },
  ]

  const isActiveMember = member.status === 'active'

  const handleDownloadCard = async () => {
    setDownloadingCard(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const W = 85.6
      const H = 54
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [W, H] })

      // Card background
      doc.setFillColor(0, 52, 145) // primary-blue
      doc.rect(0, 0, W, H, 'F')

      // Decorative circle, top-right
      try {
        doc.setGState(doc.GState({ opacity: 0.35 }))
      } catch {}
      doc.setFillColor(240, 24, 30) // primary-red
      doc.circle(W - 6, 6, 16, 'F')
      try {
        doc.setGState(doc.GState({ opacity: 1 }))
      } catch {}

      // Logo
      try {
        const logoDataUrl = await fetch('/logo.png')
          .then((res) => res.blob())
          .then(
            (blob) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
          )
        doc.addImage(logoDataUrl, 'PNG', 5, 5, 9, 9)
      } catch (err) {
        console.error('Could not embed logo on membership card:', err)
      }

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.text('PM PARTY MEMBERSHIP ID', 17, 8.5)

      doc.setFontSize(12.5)
      doc.text(fullName, 5, 21)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(`${tierLabel} Tier${member.county ? ` · ${member.county} County` : ''}`, 5, 26)

      const field = (x: number, y: number, label: string, value: string) => {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(6)
        doc.setTextColor(255, 255, 255)
        doc.text(label.toUpperCase(), x, y)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7.5)
        doc.text(value, x, y + 4)
      }

      field(5, 35, 'Member No.', `PM-${member.idNumber}`)
      field(45, 35, 'Ward', member.ward || '—')
      field(5, 45, 'Valid Through', formatDate(latestCompleted?.periodEnd))
      field(45, 45, 'Status', member.status.charAt(0).toUpperCase() + member.status.slice(1))

      doc.save(`PM-Party-Membership-ID-${member.idNumber}.pdf`)
    } catch (err) {
      console.error('Error generating membership card PDF:', err)
      alert('Failed to generate your membership card. Please try again.')
    } finally {
      setDownloadingCard(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white text-gray-900">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[250px] shrink-0 flex-col bg-white border-r border-gray-100 px-4 py-6">
        <div className="flex items-center gap-2.5 pb-6 mb-5 border-b border-gray-100 px-1">
          <div className="relative h-8 w-8 shrink-0">
            <Image src="/logo_full.png" alt="PM Party logo" fill className="object-contain" />
          </div>
          <div className="font-heading font-extrabold text-[13px] leading-tight text-primary-blue">
            MEMBER<br />PORTAL
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(item => {
            const active = item.key === activeSection
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[14.5px] font-semibold transition ${
                  active ? 'bg-primary-red text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-sm shrink-0 ${active ? 'bg-white/80' : 'bg-gray-400'}`}
                />
                {item.label}
              </button>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 pt-4 border-t border-gray-100 px-3 py-2.5 text-left text-sm font-semibold text-gray-400 hover:text-gray-700 transition"
        >
          &larr; Back to Site / Logout
        </button>
      </aside>

      {/* Main column */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-3 px-4 sm:px-9 py-3.5 sm:py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="relative h-6 w-6 shrink-0">
              <Image src="/logo_full.png" alt="PM Party logo" fill className="object-contain" />
            </div>
            <div className="font-heading font-extrabold text-base uppercase">{sectionLabels[activeSection]}</div>
          </div>
          <div className="hidden lg:block font-heading font-extrabold text-[22px] uppercase">
            {sectionLabels[activeSection]}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <span
              className={`hidden lg:inline-flex text-[13px] font-semibold px-3 py-1.5 rounded-full ${
                isActiveMember ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isActiveMember ? 'Membership Active' : member.status}
            </span>
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(o => !o)}
                className="w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-full bg-gray-100 flex items-center justify-center font-bold text-[13px] text-primary-blue"
              >
                {initials}
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-xs font-semibold text-gray-900 truncate">{fullName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{member.idNumber}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowChangePassword(true)
                      setAccountMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile tab bar */}
        <nav className="flex lg:hidden overflow-x-auto gap-1.5 px-3.5 py-2.5 border-b border-gray-100">
          {navItems.map(item => {
            const active = item.key === activeSection
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-[13px] font-semibold transition ${
                  active ? 'bg-primary-red text-white' : 'bg-gray-50 text-gray-600'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="flex-1 px-4 sm:px-9 py-5 sm:py-8 overflow-auto">
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-blue to-[#0a4dc4] text-white p-6">
                <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-primary-red/35"></div>
                <div className="font-heading font-bold text-xs tracking-widest uppercase text-white/70">
                  Digital Membership ID
                </div>
                <div className="font-heading font-extrabold text-2xl mt-3.5 mb-0.5">{fullName}</div>
                <div className="text-[13.5px] text-white/85">
                  {tierLabel} Tier{member.county ? ` · ${member.county} County` : ''}
                </div>
                <div className="grid grid-cols-2 gap-2.5 mt-6 text-[12.5px] text-white/85">
                  <div>
                    <div className="opacity-70">Member No.</div>
                    <div className="font-bold text-white">PM-{member.idNumber}</div>
                  </div>
                  <div>
                    <div className="opacity-70">Ward</div>
                    <div className="font-bold text-white">{member.ward || '—'}</div>
                  </div>
                  <div>
                    <div className="opacity-70">Valid Through</div>
                    <div className="font-bold text-white">{formatDate(latestCompleted?.periodEnd)}</div>
                  </div>
                  <div>
                    <div className="opacity-70">Status</div>
                    <div className="font-bold text-white capitalize">{member.status}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadCard}
                disabled={downloadingCard}
                className="lg:col-start-1 flex items-center justify-center gap-2 w-full text-sm font-bold px-4 py-2.5 rounded-md bg-white border border-gray-200 text-primary-blue hover:bg-gray-50 transition disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {downloadingCard ? 'Preparing…' : 'Download Membership Card'}
              </button>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {kpis.map(k => (
                    <div key={k.label} className="bg-white border border-gray-100 rounded-xl p-4">
                      <div className="text-[12.5px] font-semibold text-gray-500">{k.label}</div>
                      <div className="font-heading font-extrabold text-2xl text-primary-blue mt-1.5">{k.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'membership' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
              <div className="bg-white border border-gray-100 rounded-xl p-5 overflow-x-auto">
                <div className="font-bold text-base mb-3.5">Payment History</div>
                {payments.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">No payment records yet.</p>
                ) : (
                  <div className="min-w-[480px]">
                    <div className="grid grid-cols-4 text-[12.5px] font-bold text-gray-500 uppercase pb-2.5 border-b border-gray-100">
                      <div>Description</div>
                      <div>Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                    </div>
                    {payments.map(p => (
                      <div key={p.id} className="grid grid-cols-4 text-sm py-3.5 border-b border-gray-50 items-center">
                        <div className="font-semibold">Membership Subscription ({p.paymentMethod.toUpperCase()})</div>
                        <div className="text-gray-500">{formatDate(p.createdAt)}</div>
                        <div className="font-semibold">{formatMoney(p.amount, p.currency)}</div>
                        <div>
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              p.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : p.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="font-bold text-base mb-1">Renew Membership</div>
                <div className="text-[13.5px] text-gray-500 mb-4">
                  {tierLabel} Tier
                  {latestCompleted ? ` · expires ${formatDate(latestCompleted.periodEnd)}` : ''}
                </div>
                {member.membershipCategory ? (
                  <div className="font-heading font-extrabold text-[28px] text-primary-blue mb-4">
                    {formatMoney(member.membershipCategory.fee, 'KES')}
                    <span className="text-[13px] text-gray-500 font-semibold">
                      {member.membershipCategory.timeline === 0
                        ? ' one-off'
                        : ` / ${member.membershipCategory.timeline} yr${member.membershipCategory.timeline > 1 ? 's' : ''}`}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mb-4">No membership category on file.</div>
                )}
                <button
                  onClick={() => setShowRenewOptions(o => !o)}
                  className="block w-full text-center font-bold text-sm py-3 rounded-md bg-primary-red text-white hover:bg-[#c91218] transition"
                >
                  Renew Now
                </button>

                {showRenewOptions && (
                  <div className="mt-4 space-y-2.5">
                    <div className="border border-gray-200 rounded-lg p-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">M-Pesa</div>
                        <div className="text-xs text-gray-500">Pay via mobile money</div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400">Coming soon</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">Card Payment</div>
                        <div className="text-xs text-gray-500">Pay via credit or debit card</div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400">Coming soon</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Online renewal is being finalized. Please contact support for manual processing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'donations' && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 overflow-x-auto">
              <div className="flex justify-between items-center flex-wrap gap-2.5 mb-3.5">
                <div className="font-bold text-base">Your Donation History</div>
                <Link
                  href="/donate"
                  className="font-bold text-sm px-4 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition"
                >
                  Make a Donation
                </Link>
              </div>
              {donations.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">
                  No donations found yet. Donations are matched to your account email or phone number.
                </p>
              ) : (
                <div className="min-w-[460px]">
                  <div className="grid grid-cols-4 text-[12.5px] font-bold text-gray-500 uppercase pb-2.5 border-b border-gray-100">
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Method</div>
                    <div>Reference</div>
                  </div>
                  {donations.map(d => (
                    <div key={d.id} className="grid grid-cols-4 text-sm py-3.5 border-b border-gray-50 items-center">
                      <div className="text-gray-500">{formatDate(d.createdAt)}</div>
                      <div className="font-semibold">{formatMoney(d.amount, d.currency)}</div>
                      <div className="text-gray-500 uppercase">{d.paymentMethod}</div>
                      <div className="text-gray-500 truncate">{d.transactionId || '—'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'applications' && (
            <div className="flex flex-col gap-4">
              {myApplications.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-xl p-5">
                  <div className="font-bold text-base mb-1">My Applications</div>
                  <p className="text-[13px] text-gray-500 mb-3.5">
                    Your application fee must be paid before the Elections Board can approve your application.
                  </p>
                  {myApplicationsLoading ? (
                    <div className="text-center py-8">
                      <PageLoader size="sm" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myApplications.map((app) => (
                        <AspirantPaymentPanel
                          key={app.id}
                          application={app}
                          idNumber={member!.idNumber}
                          onUpdate={fetchMyApplications}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex justify-between items-center flex-wrap gap-2.5 mb-1">
                  <div className="font-bold text-base">Apply As Aspirant</div>
                  <button
                    onClick={() => setShowAspirantForm(s => !s)}
                    className="font-bold text-sm px-4 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition"
                  >
                    {showAspirantForm ? 'Hide Form' : 'Apply Now'}
                  </button>
                </div>
                <p className="text-[13.5px] text-gray-500 mb-1">
                  Stand for a position in an upcoming internal election. Applications are reviewed by the elections board.
                </p>

                {showAspirantForm && (
                  <div className="mt-4">
                    {aspirantSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-5 text-sm">
                        Application submitted successfully! Your application is pending review.
                      </div>
                    )}
                    {aspirantError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-5 text-sm">
                        {aspirantError}
                      </div>
                    )}

                    <form onSubmit={handleAspirantSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Election *</label>
                        <select
                          name="electionId"
                          value={aspirantFormData.electionId}
                          onChange={handleAspirantChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                          <option value="">Select an election</option>
                          {elections.map(election => (
                            <option key={election.id} value={election.id}>
                              {election.title} - {formatDate(election.electionDate)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Position *</label>
                        <select
                          name="positionId"
                          value={aspirantFormData.positionId}
                          onChange={handleAspirantChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                          <option value="">Select a position</option>
                          {positions.map(position => (
                            <option key={position.id} value={position.id}>
                              {position.positionTitle} ({position.positionLevel})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">County</label>
                        <select
                          name="countyCode"
                          value={aspirantFormData.countyCode}
                          onChange={handleAspirantChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                          <option value="">Select a county</option>
                          {counties.map(county => (
                            <option key={county.id} value={county.countyCode}>
                              {county.countyName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {aspirantFormData.countyCode && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Constituency</label>
                          <select
                            name="constituencyCode"
                            value={aspirantFormData.constituencyCode}
                            onChange={handleAspirantChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          >
                            <option value="">Select a constituency</option>
                            {constituencies.map(constituency => (
                              <option key={constituency.id} value={constituency.constituencyCode}>
                                {constituency.constituencyName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {aspirantFormData.constituencyCode && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ward</label>
                          <select
                            name="wardCode"
                            value={aspirantFormData.wardCode}
                            onChange={handleAspirantChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          >
                            <option value="">Select a ward</option>
                            {wards.map(ward => (
                              <option key={ward.id} value={ward.wardCode}>
                                {ward.wardName}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={aspirantLoading}
                          className="bg-primary-red text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-[#c91218] transition disabled:opacity-50"
                        >
                          {aspirantLoading ? 'Submitting...' : 'Submit Application'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'candidatures' && (
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="font-bold text-base mb-1">Candidature Profiles</div>
              <p className="text-[13px] text-gray-500 mb-3.5">
                A candidature profile is created once the National Elections Board (NEB) issues you with a
                nomination certificate / party ticket for your approved aspirant application.
              </p>
              {myApplicationsLoading ? (
                <div className="text-center py-8">
                  <PageLoader size="sm" />
                </div>
              ) : (
                (() => {
                  const candidatures = myApplications.filter((app) => app.status === 1 && app.certificateIssuedAt)
                  if (candidatures.length === 0) {
                    return (
                      <p className="text-sm text-gray-400 py-4">
                        No candidature profiles yet. Once NEB issues you with a nomination certificate / party
                        ticket for an approved application, it will appear here.
                      </p>
                    )
                  }
                  return (
                    <div className="space-y-3">
                      {candidatures.map((c) => (
                        <div key={c.id} className="border border-gray-100 rounded-lg p-4">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <div className="font-semibold text-[14.5px]">
                              {c.position.positionTitle} &middot; {c.election.title}
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                              Approved Candidate
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-500 mt-1.5">
                            {c.position.positionLevel} level{c.area ? ` · ${c.area}` : ''}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Certificate No. {c.certificateNumber} · Election date: {formatDate(c.election.electionDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )
                })()
              )}
            </div>
          )}
        </div>
      </main>

      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-extrabold text-lg">Change Password</h2>
              <button
                onClick={() => {
                  setShowChangePassword(false)
                  setPasswordError('')
                  setPasswordSuccess('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 text-sm">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full bg-primary-blue text-white px-6 py-2.5 rounded-md font-semibold hover:bg-[#002e7a] transition disabled:opacity-50"
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
