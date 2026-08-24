'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ETHNIC_COMMUNITIES, RELIGIONS } from '@/lib/demographics'

const INTEREST_GROUPS = [
  { value: 'youth', label: 'Youth (18–35 years)' },
  { value: 'woman', label: 'Woman' },
  { value: 'pwd', label: 'Person with Disability (PWD)' },
  { value: 'marginalized', label: 'Marginalized Communities' },
  { value: 'ethnic_minority', label: 'Ethnic Minority' },
]

export default function MembershipRegisterPage() {
  const [idNumber, setIdNumber] = useState('')
  const [surname, setSurname] = useState('')
  const [otherNames, setOtherNames] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [sex, setSex] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [occupation, setOccupation] = useState('')
  const [ethnicity, setEthnicity] = useState('')
  const [religion, setReligion] = useState('')
  const [interestGroups, setInterestGroups] = useState<string[]>([])
  const [membershipCategory, setMembershipCategory] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  const [county, setCounty] = useState('')
  const [constituency, setConstituency] = useState('')
  const [ward, setWard] = useState('')
  const [counties, setCounties] = useState<any[]>([])
  const [constituencies, setConstituencies] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])

  const [agreedToPolicies, setAgreedToPolicies] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/membership/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/locations/counties')
      .then((r) => r.json())
      .then((d) => setCounties(d.counties || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!county) { setConstituencies([]); setConstituency(''); return }
    const c = counties.find((c) => c.countyName === county)
    if (!c) return
    fetch(`/api/locations/constituencies?countyCode=${c.countyCode}`)
      .then((r) => r.json())
      .then((d) => setConstituencies(d.constituencies || []))
      .catch(() => {})
    setConstituency('')
    setWard('')
  }, [county, counties])

  useEffect(() => {
    if (!constituency) { setWards([]); setWard(''); return }
    const c = constituencies.find((c) => c.constituencyName === constituency)
    if (!c) return
    fetch(`/api/locations/wards?constituencyCode=${c.constituencyCode}`)
      .then((r) => r.json())
      .then((d) => setWards(d.wards || []))
      .catch(() => {})
    setWard('')
  }, [constituency, constituencies])

  const toggleInterestGroup = (value: string) => {
    setInterestGroups((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!agreedToPolicies || !agreedToTerms) {
      setError('You must agree to both statements before signing up')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/membership/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber,
          surname,
          otherNames,
          dateOfBirth,
          sex,
          email,
          phone: mobile ? `+254${mobile.replace(/\D/g, '')}` : '',
          occupation,
          ethnicity,
          religion,
          interestGroups,
          membershipCategory,
          county,
          constituency,
          ward,
          agreedToPolicies,
          agreedToTerms,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to submit registration')
      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent text-gray-900 placeholder-gray-400'
  const labelCls = 'block text-sm font-bold text-gray-900 mb-1.5'
  const sectionHeadingCls = 'font-heading font-extrabold text-sm uppercase tracking-wide text-gray-900 pb-2 border-b-2 border-gray-200 mb-5'

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h1>
          <p className="text-gray-600 text-sm mb-6">
            Your details have been received. Our membership team will be in touch to welcome you and
            keep you informed about PM Party activities near you.
          </p>
          <Link href="/" className="inline-block bg-primary-blue text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#002244] transition text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-heading font-black text-2xl sm:text-3xl uppercase text-primary-blue mb-2">
            Membership Registration Form
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
            Already registered (or registering) via IPPMS? Share your details so our membership team can
            welcome you and keep you informed about PM Party activities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-8">
          {/* ── Personal Information ── */}
          <div>
            <h2 className={sectionHeadingCls}>Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>ID or Passport Number <span className="text-red-500">*</span></label>
                <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required className={inputCls} placeholder="e.g. 12345678 or BG044954" />
              </div>
              <div>
                <label className={labelCls}>Surname <span className="text-red-500">*</span></label>
                <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required className={inputCls} placeholder="Surname" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Other Names <span className="text-red-500">*</span></label>
                <input type="text" value={otherNames} onChange={(e) => setOtherNames(e.target.value)} required className={inputCls} placeholder="Other Names" />
              </div>
              <div>
                <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Sex <span className="text-red-500">*</span></label>
                <select value={sex} onChange={(e) => setSex(e.target.value)} required className={inputCls}>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Email <span className="text-red-500">*</span></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="example@example.com" />
              </div>
              <div>
                <label className={labelCls}>Mobile <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 text-sm shrink-0">
                    🇰🇪 +254
                  </span>
                  <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required className={inputCls} placeholder="7XX XXX XXX" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Occupation</label>
                <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className={inputCls} placeholder="e.g. Farmer, Teacher, Engineer" />
              </div>
              <div>
                <label className={labelCls}>Ethnicity <span className="text-red-500">*</span></label>
                <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} required className={inputCls}>
                  <option value="">Select ethnic community</option>
                  {ETHNIC_COMMUNITIES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Religion <span className="text-red-500">*</span></label>
                <select value={religion} onChange={(e) => setReligion(e.target.value)} required className={inputCls}>
                  <option value="">Select religion</option>
                  {RELIGIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Special Interest Groups ── */}
          <div>
            <label className={labelCls}>
              Special Interest Group(s) <span className="font-normal text-gray-400">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {INTEREST_GROUPS.map((g) => (
                <label key={g.value} className="flex items-center gap-2.5 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={interestGroups.includes(g.value)}
                    onChange={() => toggleInterestGroup(g.value)}
                    className="w-4 h-4 rounded text-primary-blue focus:ring-primary-blue"
                  />
                  <span className="text-sm text-gray-700">{g.label}</span>
                </label>
              ))}
            </div>

            <label className={labelCls}>Membership Category</label>
            <select value={membershipCategory} onChange={(e) => setMembershipCategory(e.target.value)} className={inputCls}>
              <option value="">Select a category (optional)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.title}>
                  {c.title} — KShs {Number(c.fee).toLocaleString('en-KE', { minimumFractionDigits: 2 })} {c.timeline === 0 ? '(One-Off)' : `(${c.timeline}-yr)`}
                </option>
              ))}
            </select>
          </div>

          {/* ── Location Details ── */}
          <div>
            <h2 className={sectionHeadingCls}>Location Details</h2>
            <div>
              <label className={labelCls}>County <span className="text-red-500">*</span></label>
              <select value={county} onChange={(e) => setCounty(e.target.value)} required className={inputCls}>
                <option value="">Select...</option>
                {counties.map((c) => <option key={c.id} value={c.countyName}>{c.countyName}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelCls}>Constituency <span className="text-red-500">*</span></label>
                <select
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  required
                  disabled={!county}
                  className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
                >
                  <option value="">{county ? 'Select...' : 'Select a county first'}</option>
                  {constituencies.map((c) => <option key={c.id} value={c.constituencyName}>{c.constituencyName}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Ward <span className="text-red-500">*</span></label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  required
                  disabled={!constituency}
                  className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
                >
                  <option value="">{constituency ? 'Select...' : 'Select a constituency first'}</option>
                  {wards.map((w) => <option key={w.id} value={w.wardName}>{w.wardName}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Agreements ── */}
          <div>
            <h2 className={sectionHeadingCls}>Agreements</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-primary-blue focus:ring-primary-blue shrink-0"
                />
                <span className="text-sm text-gray-700">
                  I agree to this website&apos;s <strong>Cookies Policy</strong> and <strong>Privacy Policy</strong>.
                </span>
              </label>
              <label className="flex items-start gap-3 px-4 py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-primary-blue focus:ring-primary-blue shrink-0"
                />
                <span className="text-sm text-gray-700">
                  I agree to the PM Party <strong>Terms and Conditions</strong>, confirm that the information I
                  have provided is accurate, and authorise PM Party to share my details with the{' '}
                  <strong>Office of the Registrar of Political Parties (ORPP)</strong> for official certification.
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-red text-white py-4 rounded-full font-bold hover:bg-[#9A162D] transition disabled:opacity-50"
          >
            {submitting ? 'Signing Up…' : 'Sign Up as a Member'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have a profile?{' '}
          <Link href="/membership/login" className="text-primary-blue font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}
