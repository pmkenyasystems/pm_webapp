'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useMemo } from 'react'

type ModuleName = 'news' | 'elections' | 'positions' | 'members' | 'volunteers' | 'donations' | 'admins' | 'aspirants'

// ── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  members: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  aspirants: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  volunteers: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  donations: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  articles: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  elections: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  officials: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  account: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  mobilization: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
}

const menuConfig: Array<{
  label: string
  module?: ModuleName
  icon: React.ReactNode
  href?: string
  submenus?: Array<{ label: string; href: string }>
}> = [
  {
    label: 'Membership',
    module: 'members',
    icon: Icons.members,
    submenus: [
      { label: 'All Members', href: '/admin/members' },
      { label: 'Map View', href: '/admin/members/map-view' },
      { label: 'By County', href: '/admin/members/by-county' },
      { label: 'By Constituency', href: '/admin/members/by-constituency' },
      { label: 'By Wards', href: '/admin/members/by-wards' },
    ],
  },
  {
    label: 'Elections Board',
    icon: Icons.elections,
    submenus: [
      { label: 'Dashboard', href: '/admin/elections/dashboard' },
      { label: 'Elections', href: '/admin/elections' },
      { label: 'Aspirants', href: '/admin/aspirants' },
      { label: 'Candidate Profiles', href: '/admin/elections/candidates' },
    ],
  },
  {
    label: 'Resource Mobilization',
    icon: Icons.mobilization,
    submenus: [
      { label: 'Donations', href: '/admin/donations/cash' },
      { label: 'Material Donations', href: '/admin/donations/material' },
      { label: 'Volunteers', href: '/admin/volunteers' },
    ],
  },
  { label: 'Articles', module: 'news', icon: Icons.articles, href: '/admin/articles' },
  {
    label: 'Officials',
    module: 'positions',
    icon: Icons.officials,
    submenus: [
      { label: 'National', href: '/admin/officials/national' },
      { label: 'County', href: '/admin/officials/county' },
      { label: 'Constituency', href: '/admin/officials/constituency' },
      { label: 'Wards', href: '/admin/officials/wards' },
    ],
  },
  { label: 'User Management', module: 'admins', icon: Icons.account, href: '/admin/users' },
]

function canAccess(item: (typeof menuConfig)[number], isSuperAdmin: boolean, userModules: string[]) {
  if (isSuperAdmin) return true
  if (!item.module) return true
  return userModules.includes(item.module)
}

interface SidebarProps {
  onClose?: () => void
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ Members: true })

  const isSuperAdmin = session?.user?.role === 'super_admin'
  const userModules = useMemo(() => {
    const raw = (session?.user as { modules?: string })?.modules
    if (!raw) return []
    try { return JSON.parse(raw) as string[] } catch { return [] }
  }, [session?.user])

  const visibleItems = useMemo(
    () => menuConfig.filter((item) => canAccess(item, isSuperAdmin, userModules)),
    [isSuperAdmin, userModules]
  )

  const toggle = (label: string) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <div className="relative h-7 w-auto aspect-[943/693] shrink-0">
          <Image src="/logo_full.png" alt="PM Party logo" fill className="object-contain" />
        </div>
        <div className="min-w-0">
          <p className="font-heading font-extrabold text-[12px] leading-tight text-primary-blue truncate">PM PARTY</p>
          <p className="font-heading font-extrabold text-[12px] leading-tight text-primary-blue truncate">ADMIN &middot; ERP</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {/* Dashboard */}
        <Link
          href="/admin/dashboard"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            pathname === '/admin/dashboard'
              ? 'bg-primary-red text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span className="shrink-0">{Icons.dashboard}</span>
          Dashboard
        </Link>

        {isSuperAdmin && (
          <Link
            href="/admin/erp"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              pathname.startsWith('/admin/erp')
                ? 'bg-primary-red text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="shrink-0">{Icons.officials}</span>
            ERP Overview
          </Link>
        )}

        <div className="pt-2 pb-1">
          <p className="px-3 font-heading text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</p>
        </div>

        {visibleItems.map((item) => {
          if (item.submenus) {
            const isOpen = openSections[item.label] ?? false
            const hasActive = item.submenus.some((s) => pathname.startsWith(s.href))
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggle(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    hasActive ? 'text-primary-red bg-primary-red/5' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    {Icons.chevronDown}
                  </span>
                </button>
                {isOpen && (
                  <div className="ml-9 mt-0.5 space-y-0.5 border-l border-gray-100 pl-3">
                    {item.submenus.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={onClose}
                        className={`block px-2 py-1.5 text-xs rounded-md transition ${
                          pathname === sub.href
                            ? 'text-primary-red font-semibold'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          const isActive = pathname === item.href || (item.href && pathname.startsWith(item.href + '/'))
          return (
            <Link
              key={item.label}
              href={item.href!}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-red text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Link
        href="/"
        className="flex items-center gap-2 mx-3 mb-3 mt-2 px-3 py-2.5 text-xs font-semibold text-gray-400 hover:text-gray-600 border-t border-gray-100 pt-4"
      >
        &larr; Exit to Public Site
      </Link>
    </aside>
  )
}
