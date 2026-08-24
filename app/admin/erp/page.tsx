'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PageLoader from '@/components/PageLoader'

type ModuleKey = 'dashboard' | 'membership' | 'finance' | 'elections'

const modules: { key: ModuleKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'membership', label: 'Membership' },
  { key: 'finance', label: 'Finance & Donations' },
  { key: 'elections', label: 'Elections Mgmt' },
]

interface ErpStats {
  dashboard: {
    totalMembers: number
    activeCounties: number
    totalCounties: number
    donationsYtd: number
    pendingApprovals: number
    chart: { label: string; count: number }[]
    approvals: { name: string; type: string }[]
  }
  orgCounts: { national: number; county: number; constituency: number; ward: number }
  finance: {
    totalRevenueYtd: number
    membershipFeesYtd: number
    donationsYtd: number
    transactions: { date: string; desc: string; type: string; amount: number; currency: string; status: string }[]
  }
}

interface AdminMember {
  idNumber: string
  surname: string
  otherNames: string
  county?: string | null
  status: string
  membershipCategory?: { title: string } | null
}

interface AdminElection {
  id: string
  title: string
  electionDate: string
  isActive: boolean
  _count: { aspirants: number }
}

function formatMoney(amount: number, currency = 'KES') {
  return `${currency} ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function reconciledBadge(status: string) {
  if (status === 'completed') return { label: 'Reconciled', className: 'bg-green-100 text-green-700' }
  if (status === 'pending') return { label: 'Pending', className: 'bg-orange-100 text-orange-700' }
  return { label: 'Failed', className: 'bg-red-100 text-red-700' }
}

export default function AdminErpPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard')
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  const [stats, setStats] = useState<ErpStats | null>(null)
  const [statsError, setStatsError] = useState('')
  const [statsLoading, setStatsLoading] = useState(true)

  const [members, setMembers] = useState<AdminMember[]>([])
  const [membersLoading, setMembersLoading] = useState(false)

  const [elections, setElections] = useState<AdminElection[]>([])
  const [electionsLoading, setElectionsLoading] = useState(false)

  const isSuperAdmin = (session?.user as { role?: string })?.role === 'super_admin'

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated' || !isSuperAdmin) return
    fetch('/api/admin/erp/stats')
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Failed to load ERP stats')
        setStats(data)
      })
      .catch(err => setStatsError(err.message))
      .finally(() => setStatsLoading(false))
  }, [status, isSuperAdmin])

  useEffect(() => {
    if (activeModule === 'membership' && members.length === 0 && !membersLoading) {
      setMembersLoading(true)
      fetch('/api/admin/members')
        .then(res => res.json())
        .then(data => setMembers(data.members || []))
        .catch(() => setMembers([]))
        .finally(() => setMembersLoading(false))
    }
    if (activeModule === 'elections' && elections.length === 0 && !electionsLoading) {
      setElectionsLoading(true)
      fetch('/api/admin/elections')
        .then(res => res.json())
        .then(data => setElections(data.elections || []))
        .catch(() => setElections([]))
        .finally(() => setElectionsLoading(false))
    }
  }, [activeModule])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <PageLoader size="lg" />
      </div>
    )
  }

  if (status === 'authenticated' && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="font-heading font-extrabold text-xl mb-2">Restricted</h1>
          <p className="text-sm text-gray-500 mb-6">
            The consolidated ERP overview is available to super admins only.
          </p>
          <Link href="/admin/dashboard" className="font-semibold text-sm text-primary-blue hover:text-primary-red transition">
            &larr; Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!session) return null

  const userName = session.user?.name || session.user?.email || 'Admin'
  const initials = userName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
  const activeLabel = modules.find(m => m.key === activeModule)!.label

  return (
    <div className="flex min-h-screen w-full bg-white text-gray-900">
      <aside className="hidden lg:flex w-[230px] shrink-0 flex-col bg-white border-r border-gray-100 px-3.5 py-5">
        <div className="flex items-center gap-2.5 pb-5 mb-4 border-b border-gray-100 px-1.5">
          <div className="relative h-7 w-7 shrink-0">
            <Image src="/logo_full.png" alt="PM Party logo" fill className="object-contain" />
          </div>
          <div className="font-heading font-extrabold text-xs leading-tight text-primary-blue">
            PM PARTY<br />ADMIN / ERP
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5">
          {modules.map(item => {
            const active = item.key === activeModule
            return (
              <button
                key={item.key}
                onClick={() => setActiveModule(item.key)}
                className={`px-2.5 py-2.5 rounded-md text-left text-[13.5px] font-semibold transition ${
                  active ? 'bg-primary-red text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <Link
          href="/admin/dashboard"
          className="mt-3.5 pt-3.5 border-t border-gray-100 px-2.5 py-2.5 text-left text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition"
        >
          &larr; Back to Admin
        </Link>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-2.5 px-4 sm:px-8 py-3.5 sm:py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-6 w-6 shrink-0 lg:hidden">
              <Image src="/logo_full.png" alt="PM Party logo" fill className="object-contain" />
            </div>
            <div className="font-heading font-extrabold text-[15px] sm:text-xl uppercase truncate">{activeLabel}</div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <span className="hidden lg:inline-flex text-[12.5px] font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
              Secretariat · Super Admin
            </span>
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(o => !o)}
                className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full bg-gray-100 flex items-center justify-center font-bold text-[13px] text-primary-blue"
              >
                {initials}
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-xs font-semibold text-gray-900 truncate">{userName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/admin/account/profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    Change Password
                  </Link>
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

        <nav className="flex lg:hidden overflow-x-auto gap-1.5 px-3.5 py-2.5 border-b border-gray-100">
          {modules.map(item => {
            const active = item.key === activeModule
            return (
              <button
                key={item.key}
                onClick={() => setActiveModule(item.key)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-2xl text-[13px] font-semibold transition ${
                  active ? 'bg-primary-red text-white' : 'bg-gray-50 text-gray-600'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="flex-1 px-4 sm:px-8 py-4 sm:py-7 overflow-auto">
          {statsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-5 text-sm">
              {statsError}
            </div>
          )}

          {statsLoading ? (
            <div className="flex justify-center py-16">
              <PageLoader size="md" />
            </div>
          ) : stats ? (
            <>
              {activeModule === 'dashboard' && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
                    {[
                      { label: 'Total Members', value: stats.dashboard.totalMembers.toLocaleString(), delta: `${stats.dashboard.activeCounties} / ${stats.dashboard.totalCounties} counties active`, up: true },
                      { label: 'Active Counties', value: `${stats.dashboard.activeCounties} / ${stats.dashboard.totalCounties}`, delta: stats.dashboard.activeCounties === stats.dashboard.totalCounties ? 'Fully organised' : 'Organising', up: true },
                      { label: 'Donations (YTD)', value: formatMoney(stats.dashboard.donationsYtd), delta: 'Year to date', up: true },
                      { label: 'Pending Approvals', value: String(stats.dashboard.pendingApprovals), delta: 'Needs review', up: false },
                    ].map(k => (
                      <div key={k.label} className="bg-white border border-gray-100 rounded-xl p-4">
                        <div className="text-xs font-semibold text-gray-500">{k.label}</div>
                        <div className="font-heading font-extrabold text-[22px] text-primary-blue mt-1.5">{k.value}</div>
                        <div className={`text-[11.5px] font-semibold mt-1 ${k.up ? 'text-green-600' : 'text-orange-600'}`}>{k.delta}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-4 overflow-x-auto">
                      <div className="font-bold text-[15px] mb-3.5">Membership Growth — Last 6 Months</div>
                      <div className="flex items-end gap-2.5 h-[150px] min-w-[360px]">
                        {stats.dashboard.chart.map(b => {
                          const max = Math.max(1, ...stats.dashboard.chart.map(x => x.count))
                          const h = Math.round((b.count / max) * 130) + (b.count > 0 ? 10 : 2)
                          return (
                            <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full flex items-end justify-center flex-1">
                                <div
                                  className="w-full rounded-t bg-primary-blue"
                                  style={{ height: `${h}px` }}
                                  title={`${b.count} new members`}
                                ></div>
                              </div>
                              <div className="text-[11px] text-gray-500">{b.label}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-4">
                      <div className="font-bold text-[15px] mb-3">Pending Approvals</div>
                      {stats.dashboard.approvals.length === 0 ? (
                        <p className="text-sm text-gray-400">Nothing pending review.</p>
                      ) : (
                        stats.dashboard.approvals.map((a, i) => (
                          <div key={i} className="py-2.5 border-t border-gray-50 first:border-t-0 flex justify-between gap-2">
                            <div className="text-[13.5px] font-semibold">{a.name}</div>
                            <span className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 whitespace-nowrap">
                              {a.type}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeModule === 'membership' && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {[
                      { level: 'National', count: stats.orgCounts.national },
                      { level: 'County', count: stats.orgCounts.county },
                      { level: 'Constituency', count: stats.orgCounts.constituency },
                      { level: 'Ward', count: stats.orgCounts.ward },
                    ].map(o => (
                      <div key={o.level} className="bg-white border border-gray-100 rounded-xl p-3.5 text-center">
                        <div className="font-heading font-extrabold text-xl text-primary-blue">{o.count.toLocaleString()}</div>
                        <div className="text-[11.5px] font-semibold text-gray-500 mt-1">{o.level}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-4 overflow-x-auto">
                    <div className="flex justify-between items-center flex-wrap gap-2.5 mb-3.5">
                      <div className="font-bold text-[15px]">Member Register</div>
                      <Link href="/admin/members" className="font-bold text-[13.5px] px-3.5 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition">
                        Manage Members
                      </Link>
                    </div>
                    {membersLoading ? (
                      <div className="flex justify-center py-8">
                        <PageLoader size="sm" />
                      </div>
                    ) : members.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4">No members found.</p>
                    ) : (
                      <div className="min-w-[520px]">
                        <div className="grid grid-cols-5 text-xs font-bold text-gray-500 uppercase pb-2.5 border-b border-gray-100">
                          <div>Name</div><div>Member No.</div><div>County</div><div>Tier</div><div>Status</div>
                        </div>
                        {members.slice(0, 25).map(m => (
                          <div key={m.idNumber} className="grid grid-cols-5 text-[13.5px] py-3 border-b border-gray-50 items-center">
                            <div className="font-semibold">{m.surname} {m.otherNames}</div>
                            <div className="text-gray-500">PM-{m.idNumber}</div>
                            <div>{m.county || '—'}</div>
                            <div>{m.membershipCategory?.title || 'Standard'}</div>
                            <div>
                              <span
                                className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                                  m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {m.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {members.length > 25 && (
                      <p className="text-xs text-gray-400 mt-3">
                        Showing 25 of {members.length}. <Link href="/admin/members" className="text-primary-blue font-semibold">View all →</Link>
                      </p>
                    )}
                  </div>
                </>
              )}

              {activeModule === 'finance' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
                    {[
                      { label: 'Total Revenue (YTD)', value: formatMoney(stats.finance.totalRevenueYtd) },
                      { label: 'Membership Fees (YTD)', value: formatMoney(stats.finance.membershipFeesYtd) },
                      { label: 'Donations (YTD)', value: formatMoney(stats.finance.donationsYtd) },
                    ].map(f => (
                      <div key={f.label} className="bg-white border border-gray-100 rounded-xl p-4">
                        <div className="text-[12.5px] font-semibold text-gray-500">{f.label}</div>
                        <div className="font-heading font-extrabold text-[22px] text-primary-blue mt-1.5">{f.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-gray-100 rounded-xl p-4 overflow-x-auto">
                    <div className="flex justify-between items-center flex-wrap gap-2.5 mb-3.5">
                      <div className="font-bold text-[15px]">Recent Transactions</div>
                      <Link href="/admin/donations/cash" className="font-bold text-[13.5px] px-3.5 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition">
                        View Donations
                      </Link>
                    </div>
                    {stats.finance.transactions.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4">No transactions yet.</p>
                    ) : (
                      <div className="min-w-[560px]">
                        <div className="grid grid-cols-5 text-xs font-bold text-gray-500 uppercase pb-2.5 border-b border-gray-100">
                          <div>Date</div><div>Description</div><div>Type</div><div>Amount</div><div>Status</div>
                        </div>
                        {stats.finance.transactions.map((t, i) => {
                          const badge = reconciledBadge(t.status)
                          return (
                            <div key={i} className="grid grid-cols-5 text-[13.5px] py-3 border-b border-gray-50 items-center">
                              <div className="text-gray-500">{formatDate(t.date)}</div>
                              <div className="font-semibold">{t.desc}</div>
                              <div>{t.type}</div>
                              <div className="font-semibold">{formatMoney(t.amount, t.currency)}</div>
                              <div>
                                <span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full ${badge.className}`}>
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeModule === 'elections' && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 overflow-x-auto">
                  <div className="flex justify-between items-center flex-wrap gap-2.5 mb-3.5">
                    <div className="font-bold text-[15px]">Internal Elections</div>
                    <Link href="/admin/elections/new" className="font-bold text-[13.5px] px-3.5 py-2 rounded-md bg-primary-blue text-white hover:bg-[#002e7a] transition">
                      + Create Election
                    </Link>
                  </div>
                  {electionsLoading ? (
                    <div className="flex justify-center py-8">
                      <PageLoader size="sm" />
                    </div>
                  ) : elections.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4">No elections yet.</p>
                  ) : (
                    <div className="min-w-[460px]">
                      <div className="grid grid-cols-4 text-xs font-bold text-gray-500 uppercase pb-2.5 border-b border-gray-100">
                        <div>Election</div><div>Date</div><div>Applications</div><div>Status</div>
                      </div>
                      {elections.map(e => {
                        const isPast = new Date(e.electionDate).getTime() < Date.now()
                        const label = e.isActive ? (isPast ? 'Closed' : 'Active') : 'Inactive'
                        const badgeClass = label === 'Active' ? 'bg-orange-100 text-orange-700' : label === 'Closed' ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-500'
                        return (
                          <div key={e.id} className="grid grid-cols-4 text-[13.5px] py-3 border-b border-gray-50 items-center">
                            <div className="font-semibold">{e.title}</div>
                            <div className="text-gray-500">{formatDate(e.electionDate)}</div>
                            <div>{e._count.aspirants}</div>
                            <div>
                              <span className={`text-[11.5px] font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>{label}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  )
}
