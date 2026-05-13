'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type Step =
  | 'idle'                // initial: show ID input
  | 'fetching'            // checking local ORPP records
  | 'found'               // ORPP record found, no profile yet — add phone/email
  | 'already-registered'  // profile already exists — redirect to login
  | 'not-found'           // ID not in ORPP records — offer manual entry
  | 'manual-entry'        // filling manual form
  | 'creating'            // submitting profile
  | 'done'                // profile created

interface OrppData {
  surname: string
  otherNames: string
  idNumber: string
  dateOfBirth?: string
  gender?: string
  religion?: string
  ethnicity?: string
  county?: string
  constituency?: string
  ward?: string
  youth?: boolean
  pwd?: boolean
  ippmsId?: string
}

export default function MembershipPage() {
  const [nationalId, setNationalId] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [orppData, setOrppData] = useState<OrppData | null>(null)
  const [fetchError, setFetchError] = useState('')
  const [createError, setCreateError] = useState('')
  const [createResult, setCreateResult] = useState<{ tempPassword?: string; message?: string } | null>(null)

  // Contact fields (used in both found + manual paths)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // Manual-entry fields
  const [manualSurname, setManualSurname] = useState('')
  const [manualOtherNames, setManualOtherNames] = useState('')
  const [manualDob, setManualDob] = useState('')
  const [manualGender, setManualGender] = useState('')
  const [manualReligion, setManualReligion] = useState('')
  const [manualEthnicity, setManualEthnicity] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [manualCounty, setManualCounty] = useState('')
  const [manualConstituency, setManualConstituency] = useState('')
  const [manualWard, setManualWard] = useState('')
  const [manualYouth, setManualYouth] = useState(false)
  const [manualPwd, setManualPwd] = useState(false)

  // Shared membership category
  const [membershipCategoryId, setMembershipCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  // Geo dropdowns for manual entry
  const [counties, setCounties] = useState<any[]>([])
  const [constituencies, setConstituencies] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])

  const shareRef = useRef<HTMLDivElement>(null)

  // Fetch categories and counties once
  useEffect(() => {
    fetch('/api/membership/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {})
  }, [])

  // Fetch counties once (for manual entry)
  useEffect(() => {
    fetch('/api/locations/counties')
      .then((r) => r.json())
      .then((d) => setCounties(d.counties || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!manualCounty) { setConstituencies([]); setManualConstituency(''); return }
    const county = counties.find((c) => c.countyName === manualCounty)
    if (!county) return
    fetch(`/api/locations/constituencies?countyCode=${county.countyCode}`)
      .then((r) => r.json())
      .then((d) => setConstituencies(d.constituencies || []))
      .catch(() => {})
    setManualConstituency('')
    setManualWard('')
  }, [manualCounty, counties])

  useEffect(() => {
    if (!manualConstituency) { setWards([]); setManualWard(''); return }
    const c = constituencies.find((c) => c.constituencyName === manualConstituency)
    if (!c) return
    fetch(`/api/locations/wards?constituencyCode=${c.constituencyCode}`)
      .then((r) => r.json())
      .then((d) => setWards(d.wards || []))
      .catch(() => {})
    setManualWard('')
  }, [manualConstituency, constituencies])

  const handleCheckId = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('fetching')
    setFetchError('')
    setOrppData(null)

    try {
      const response = await fetch('/api/membership/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId }),
      })
      const data = await response.json()

      if (response.ok && data.alreadyHasProfile) {
        setStep('already-registered')
      } else if (response.ok && data.member) {
        setOrppData(data.member)
        setStep('found')
      } else {
        setStep('not-found')
        setFetchError(data.error || '')
      }
    } catch {
      setStep('not-found')
    }
  }

  const handleCreateFromOrpp = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('creating')
    setCreateError('')
    try {
      const response = await fetch('/api/membership/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalId, phone, email, membershipCategoryId: membershipCategoryId || null }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create profile')
      setCreateResult({ tempPassword: data.tempPassword, message: data.message })
      setStep('done')
    } catch (err: any) {
      setCreateError(err.message)
      setStep('found')
    }
  }

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('creating')
    setCreateError('')
    try {
      const response = await fetch('/api/membership/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nationalId,
          phone,
          email,
          membershipCategoryId: membershipCategoryId || null,
          manualData: {
            surname: manualSurname,
            otherNames: manualOtherNames,
            dateOfBirth: manualDob || null,
            gender: manualGender || null,
            religion: manualReligion || null,
            ethnicity: manualEthnicity || null,
            address: manualAddress || null,
            county: manualCounty || null,
            constituency: manualConstituency || null,
            ward: manualWard || null,
            youth: manualYouth,
            pwd: manualPwd,
          },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create profile')
      setCreateResult({ tempPassword: data.tempPassword, message: data.message })
      setStep('done')
    } catch (err: any) {
      setCreateError(err.message)
      setStep('manual-entry')
    }
  }

  const handleShare = async () => {
    const text = `🇰🇪 Join People's Renaissance Movement (PM)!\n\nBecome a registered party member via ORPP:\n\n📱 Dial *509# on your phone\n   → Select "Register as Party Member"\n   → Enter Party Code: 105\n\n🌐 Or visit: ippms.orpp.or.ke\n   → Create an account & register\n   → Enter Party Code: 105\n\nOnce registered, create your PM membership profile at our website.\n\n#PeoplesRenaissanceMovement #PMKenya #JoinPM`

    if (navigator.share) {
      try {
        await navigator.share({ title: "Join People's Renaissance Movement", text })
        return
      } catch {}
    }
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      alert('Instructions copied to clipboard! Paste and share on your socials.')
    })
  }

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`🇰🇪 Join People's Renaissance Movement (PM)!\n\nBecome a registered party member via ORPP:\n\n📱 Dial *509# → Enter Party Code 105\n🌐 Visit ippms.orpp.or.ke → Enter Party Code 105\n\nThen create your PM profile online!\n\n#PMKenya`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareToX = () => {
    const text = encodeURIComponent(`Join People's Renaissance Movement! Register via ORPP:\n📱 Dial *509# (Party Code: 105)\n🌐 ippms.orpp.or.ke (Party Code: 105)\n\nThen create your membership profile. #PMKenya #PeoplesRenaissanceMovement`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const shareToFacebook = () => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent text-gray-900 placeholder-gray-400 text-sm'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {/* Page header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Membership</h1>
        <div className="w-24 h-1 bg-primary-red mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Join People&apos;s Renaissance Movement and be part of the change</p>
      </div>

      {/* ── How to Join (shareable) ── */}
      <div ref={shareRef} className="bg-gradient-to-br from-primary-blue to-[#002244] text-white rounded-2xl p-7 mb-8 shadow-lg">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Step 1 of 2</span>
            <h2 className="text-2xl font-bold mt-2">How to Become a PM Member</h2>
            <p className="text-blue-100 text-sm mt-1">First register via ORPP, then create your profile here</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Dial option */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm">Option A — Dial USSD</h3>
            </div>
            <ol className="text-blue-100 text-xs space-y-1 list-decimal list-inside">
              <li>Dial <span className="font-mono font-bold text-white">*509#</span> on your phone</li>
              <li>Select &ldquo;Register as Party Member&rdquo;</li>
              <li>Enter Party Code: <span className="font-bold text-white">105</span></li>
              <li>Follow the on-screen prompts</li>
            </ol>
          </div>

          {/* Website option */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="font-bold text-sm">Option B — ORPP Website</h3>
            </div>
            <ol className="text-blue-100 text-xs space-y-1 list-decimal list-inside">
              <li>Visit <span className="font-semibold text-white">ippms.orpp.or.ke</span></li>
              <li>Create an account or log in</li>
              <li>Complete the registration form</li>
              <li>Enter Party Code: <span className="font-bold text-white">105</span></li>
            </ol>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/20 mb-5 text-xs text-blue-100">
          <strong className="text-white">Important:</strong> ORPP registration is required by law for all political party members in Kenya (Political Parties Act). Your party code is <strong className="text-white">105</strong>.
        </div>

        {/* Share buttons */}
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-xs text-blue-200 mb-1">Share these instructions:</p>
          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </button>
          <button
            onClick={shareToX}
            className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            X (Twitter)
          </button>
          <button
            onClick={shareToFacebook}
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy / Share
          </button>
        </div>
      </div>

      {/* ── Step 2: Create or Login ── */}
      <div id="create-profile" className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-semibold bg-primary-red/10 text-primary-red px-2 py-0.5 rounded-full uppercase tracking-wider">Step 2 of 2</span>
          <h2 className="text-xl font-bold text-gray-900">Create Your Membership Profile</h2>
        </div>

        {/* Already have a profile? */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">Already have a membership profile?</p>
          <Link
            href="/membership/login"
            className="bg-primary-blue text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#002244] transition"
          >
            Login →
          </Link>
        </div>

        {/* ── Create profile flow ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Step: idle — enter national ID */}
          {(step === 'idle' || step === 'fetching') && (
            <div className="p-7">
              <h3 className="font-bold text-gray-900 mb-1">Enter your National ID</h3>
              <p className="text-sm text-gray-500 mb-5">
                We&apos;ll check if your details are already in our system via ORPP.
              </p>
              <form onSubmit={handleCheckId} className="space-y-4">
                <div>
                  <label htmlFor="nationalId" className={labelCls}>National ID Number</label>
                  <input
                    type="text"
                    id="nationalId"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    required
                    className={inputCls}
                    placeholder="e.g. 12345678"
                  />
                </div>
                <button
                  type="submit"
                  disabled={step === 'fetching'}
                  className="w-full bg-primary-blue text-white py-3 rounded-xl font-semibold hover:bg-[#002244] transition disabled:opacity-50"
                >
                  {step === 'fetching' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Checking ORPP records…
                    </span>
                  ) : 'Check My Details'}
                </button>
              </form>
            </div>
          )}

          {/* Step: already-registered — profile exists, go to login */}
          {step === 'already-registered' && (
            <div className="p-7 text-center">
              <div className="w-12 h-12 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Profile already exists</h3>
              <p className="text-sm text-gray-600 mb-5">
                A membership profile already exists for ID <span className="font-mono font-semibold">{nationalId}</span>. Please log in to access your account.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/membership/login"
                  className="bg-primary-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#002244] transition text-sm"
                >
                  Go to Login
                </Link>
                <button
                  onClick={() => setStep('idle')}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
                >
                  Try a Different ID
                </button>
              </div>
            </div>
          )}

          {/* Step: found — confirm ORPP data + add contact info */}
          {(step === 'found' || step === 'creating') && orppData && (
            <div className="p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Record found in ORPP</h3>
                  <p className="text-xs text-gray-500">Confirm your details below then create your profile</p>
                </div>
              </div>

              {/* Member details preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block">Full Name</span>
                  <span className="font-semibold text-gray-900">{orppData.surname} {orppData.otherNames}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">ID Number</span>
                  <span className="font-semibold text-gray-900">{orppData.idNumber}</span>
                </div>
                {orppData.dateOfBirth && (
                  <div>
                    <span className="text-xs text-gray-500 block">Date of Birth</span>
                    <span className="text-gray-900">{new Date(orppData.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {orppData.gender && (
                  <div>
                    <span className="text-xs text-gray-500 block">Gender</span>
                    <span className="text-gray-900">{orppData.gender}</span>
                  </div>
                )}
                {orppData.county && (
                  <div>
                    <span className="text-xs text-gray-500 block">County</span>
                    <span className="text-gray-900">{orppData.county}</span>
                  </div>
                )}
                {orppData.constituency && (
                  <div>
                    <span className="text-xs text-gray-500 block">Constituency</span>
                    <span className="text-gray-900">{orppData.constituency}</span>
                  </div>
                )}
                {orppData.ward && (
                  <div>
                    <span className="text-xs text-gray-500 block">Ward</span>
                    <span className="text-gray-900">{orppData.ward}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleCreateFromOrpp} className="space-y-4">
                <div>
                  <label htmlFor="phone-found" className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" id="phone-found" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputCls} placeholder="07XX XXX XXX" />
                </div>
                <div>
                  <label htmlFor="email-found" className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                  <input type="email" id="email-found" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="your@email.com" />
                  <p className="text-xs text-gray-400 mt-1">Your temporary password will be sent to this email.</p>
                </div>
                <div>
                  <label htmlFor="category-found" className={labelCls}>Membership Category</label>
                  <select id="category-found" value={membershipCategoryId} onChange={(e) => setMembershipCategoryId(e.target.value)} className={inputCls}>
                    <option value="">Select a category (optional)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.title} — KShs {Number(c.fee).toLocaleString('en-KE', { minimumFractionDigits: 2 })} {c.timeline === 0 ? '(One-Off)' : `(${c.timeline}-yr)`}</option>
                    ))}
                  </select>
                </div>

                {createError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{createError}</div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep('idle'); setOrppData(null); setPhone(''); setEmail('') }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={step === 'creating'}
                    className="flex-1 bg-primary-red text-white py-3 rounded-xl font-semibold hover:bg-[#9A162D] transition disabled:opacity-50 text-sm"
                  >
                    {step === 'creating' ? 'Creating Profile…' : 'Create My Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step: not-found — ID not in ORPP yet */}
          {step === 'not-found' && (
            <div className="p-7">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">ID not yet found in ORPP</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Your ID <span className="font-mono font-semibold">{nationalId}</span> has not been synced from ORPP yet.
                    This usually means you haven&apos;t registered via ORPP, or your data is still being processed.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800 space-y-2">
                <p><strong>Not yet registered with ORPP?</strong> Dial <span className="font-mono font-bold">*509#</span> or visit <strong>ippms.orpp.or.ke</strong> and use party code <span className="font-bold">105</span> to register first, then come back here.</p>
                <p><strong>Already registered with ORPP but your data hasn&apos;t synced yet?</strong> You can still <strong>Create Profile Anyway</strong> — your profile will be matched and verified automatically once your ORPP data is received on our end.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep('idle')}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
                >
                  Try a Different ID
                </button>
                <button
                  onClick={() => setStep('manual-entry')}
                  className="flex-1 bg-primary-blue text-white py-3 rounded-xl font-semibold hover:bg-[#002244] transition text-sm"
                >
                  Create Profile Anyway
                </button>
              </div>
            </div>
          )}

          {/* Step: manual-entry */}
          {(step === 'manual-entry' || (step === 'creating' && !orppData)) && (
            <div className="p-7">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900">Create Profile Anyway</h3>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                Your profile will be created with <strong>unsynced status</strong>. When your ORPP registration is confirmed and your data is received, your profile will be automatically updated and verified.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800 mb-5">
                ID Number: <span className="font-mono font-bold">{nationalId}</span> · Profile sync status: <span className="font-semibold text-amber-700">Pending ORPP sync</span>
              </div>

              <form onSubmit={handleCreateManual} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Surname <span className="text-red-500">*</span></label>
                    <input type="text" value={manualSurname} onChange={(e) => setManualSurname(e.target.value)} required className={inputCls} placeholder="Last name" />
                  </div>
                  <div>
                    <label className={labelCls}>Other Names <span className="text-red-500">*</span></label>
                    <input type="text" value={manualOtherNames} onChange={(e) => setManualOtherNames(e.target.value)} required className={inputCls} placeholder="First & middle names" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" value={manualDob} onChange={(e) => setManualDob(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select value={manualGender} onChange={(e) => setManualGender(e.target.value)} className={inputCls}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className={inputCls} placeholder="07XX XXX XXX" />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>County</label>
                  <select value={manualCounty} onChange={(e) => setManualCounty(e.target.value)} className={inputCls}>
                    <option value="">Select County</option>
                    {counties.map((c) => (
                      <option key={c.id} value={c.countyName}>{c.countyName}</option>
                    ))}
                  </select>
                </div>
                {constituencies.length > 0 && (
                  <div>
                    <label className={labelCls}>Constituency</label>
                    <select value={manualConstituency} onChange={(e) => setManualConstituency(e.target.value)} className={inputCls}>
                      <option value="">Select Constituency</option>
                      {constituencies.map((c) => (
                        <option key={c.id} value={c.constituencyName}>{c.constituencyName}</option>
                      ))}
                    </select>
                  </div>
                )}
                {wards.length > 0 && (
                  <div>
                    <label className={labelCls}>Ward</label>
                    <select value={manualWard} onChange={(e) => setManualWard(e.target.value)} className={inputCls}>
                      <option value="">Select Ward</option>
                      {wards.map((w) => (
                        <option key={w.id} value={w.wardName}>{w.wardName}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Religion</label>
                    <input type="text" value={manualReligion} onChange={(e) => setManualReligion(e.target.value)} className={inputCls} placeholder="e.g. Christianity" />
                  </div>
                  <div>
                    <label className={labelCls}>Ethnicity</label>
                    <input type="text" value={manualEthnicity} onChange={(e) => setManualEthnicity(e.target.value)} className={inputCls} placeholder="e.g. Kikuyu" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <input type="text" value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} className={inputCls} placeholder="Physical address" />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={manualYouth} onChange={(e) => setManualYouth(e.target.checked)} className="w-4 h-4 rounded text-primary-blue" />
                    Youth (18–35 yrs)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={manualPwd} onChange={(e) => setManualPwd(e.target.checked)} className="w-4 h-4 rounded text-primary-blue" />
                    Person with Disability (PWD)
                  </label>
                </div>
                <div>
                  <label className={labelCls}>Membership Category</label>
                  <select value={membershipCategoryId} onChange={(e) => setMembershipCategoryId(e.target.value)} className={inputCls}>
                    <option value="">Select a category (optional)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.title} — KShs {Number(c.fee).toLocaleString('en-KE', { minimumFractionDigits: 2 })} {c.timeline === 0 ? '(One-Off)' : `(${c.timeline}-yr)`}</option>
                    ))}
                  </select>
                </div>

                {createError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{createError}</div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('not-found')}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={step === 'creating'}
                    className="flex-1 bg-primary-red text-white py-3 rounded-xl font-semibold hover:bg-[#9A162D] transition disabled:opacity-50 text-sm"
                  >
                    {step === 'creating' ? 'Creating Profile…' : 'Create My Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step: done */}
          {step === 'done' && (
            <div className="p-7 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Created!</h3>
              <p className="text-gray-600 text-sm mb-4">{createResult?.message}</p>
              {createResult?.tempPassword && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-5 text-sm">
                  <p className="text-yellow-800 font-medium mb-1">Your temporary password:</p>
                  <p className="font-mono font-bold text-lg text-yellow-900 tracking-wider">{createResult.tempPassword}</p>
                  <p className="text-yellow-700 text-xs mt-1">Use this to log in, then change it in your profile settings.</p>
                </div>
              )}
              <Link
                href="/membership/login"
                className="inline-block bg-primary-blue text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#002244] transition"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Membership Categories ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Membership Categories</h2>
        <p className="text-sm text-gray-500 mb-5">Choose the category that fits your level of commitment.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-blue text-white">
                <th className="px-4 py-3 text-left rounded-tl-lg">Type</th>
                <th className="px-4 py-3 text-right">Fees (KShs)</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['Ordinary Membership', '20.00', 0],
                ['Life Membership', '20,000.00', 5],
                ['Bronze Life Membership', '50,000.00', 5],
                ['Silver Life Membership', '100,000.00', 5],
                ['Gold Life Membership', '1,000,000.00', 5],
                ['Diamond Life Membership', '5,000,000.00', 5],
                ['Platinum Life Membership', '20,000,000.00', 5],
              ].map(([type, fee, timeline]) => (
                <tr key={type} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{type}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{fee}</td>
                  <td className="px-4 py-3 text-gray-500">{timeline === 0 ? 'One-Off Payment' : `Renewable every ${timeline} years`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r-lg text-sm text-amber-800">
          <strong>Note:</strong> To become an aspirant or party official, you must be at least a Life Member and fully paid up.
        </div>
      </div>

      {/* Footer link */}
      <div className="text-center">
        <Link href="/volunteer" className="text-sm text-gray-500 hover:text-primary-blue transition">
          Not ready to become a member? Consider volunteering instead →
        </Link>
      </div>
    </div>
  )
}
