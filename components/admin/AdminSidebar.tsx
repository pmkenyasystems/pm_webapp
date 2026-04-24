'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useMemo } from 'react'

type ModuleName = 'news' | 'elections' | 'positions' | 'members' | 'volunteers' | 'donations' | 'admins' | 'aspirants'

const menuConfig: Array<
  | { label: string; module?: ModuleName; submenus: Array<{ label: string; href: string }> }
  | { label: string; module?: ModuleName; href: string }
> = [
  {
    label: 'My Account',
    submenus: [
      { label: 'My Profile', href: '/admin/account/profile' },
      { label: 'Payments', href: '/admin/account/payments' },
    ],
  },
  {
    label: 'Members',
    module: 'members',
    submenus: [
      { label: 'Dashboard', href: '/admin/members' },
      { label: 'Map View', href: '/admin/members/map-view' },
      { label: 'By County', href: '/admin/members/by-county' },
      { label: 'By Constituency', href: '/admin/members/by-constituency' },
      { label: 'By Wards', href: '/admin/members/by-wards' },
    ],
  },
  {
    label: 'Aspirants',
    module: 'aspirants',
    href: '/admin/aspirants',
  },
  {
    label: 'Volunteers',
    module: 'volunteers',
    href: '/admin/volunteers',
  },
  {
    label: 'Donations',
    module: 'donations',
    submenus: [
      { label: 'Cash Donation', href: '/admin/donations/cash' },
      { label: 'Material Donations', href: '/admin/donations/material' },
    ],
  },
  {
    label: 'Articles',
    module: 'news',
    href: '/admin/articles',
  },
  {
    label: 'Elections',
    module: 'elections',
    href: '/admin/elections',
  },
  {
    label: 'Officials',
    module: 'positions',
    submenus: [
      { label: 'National', href: '/admin/officials/national' },
      { label: 'County', href: '/admin/officials/county' },
      { label: 'Constituency', href: '/admin/officials/constituency' },
      { label: 'Wards', href: '/admin/officials/wards' },
    ],
  },
  {
    label: 'Settings',
    module: 'admins',
    submenus: [
      { label: 'Users', href: '/admin/users' },
    ],
  },
]

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 text-sm rounded-md transition ${
        isActive
          ? 'bg-primary-blue text-white font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  )
}

function canAccessItem(
  item: (typeof menuConfig)[number],
  isSuperAdmin: boolean,
  userModules: string[]
): boolean {
  if (isSuperAdmin) return true
  if (!item.module) return true
  return userModules.includes(item.module)
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Members: true,
    Settings: true,
  })

  const isSuperAdmin = session?.user?.role === 'super_admin'
  const userModules = useMemo(() => {
    const raw = (session?.user as { modules?: string })?.modules
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw) as string[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [session?.user])

  const visibleMenuItems = useMemo(
    () => menuConfig.filter((item) => canAccessItem(item, isSuperAdmin, userModules)),
    [isSuperAdmin, userModules]
  )

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 shadow-sm min-h-screen py-6">
      <nav className="px-3 space-y-1">
        <Link
          href="/admin/dashboard"
          className={`block px-3 py-2.5 text-sm font-semibold rounded-md transition mb-4 ${
            pathname === '/admin/dashboard'
              ? 'bg-primary-blue text-white'
              : 'text-gray-800 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </Link>

        {visibleMenuItems.map((item) => {
          if ('submenus' in item && item.submenus) {
            const isOpen = openSections[item.label] ?? false
            const hasActive = item.submenus.some((s) => pathname === s.href)
            return (
              <div key={item.label} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleSection(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition ${
                    hasActive ? 'text-primary-blue bg-primary-light' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="pl-3 space-y-0.5 border-l-2 border-gray-200 ml-2">
                    {item.submenus.map((sub) => (
                      <NavLink
                        key={sub.href}
                        href={sub.href}
                        label={sub.label}
                        isActive={pathname === sub.href}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          }
          const href = 'href' in item ? item.href : '#'
          return (
            <NavLink
              key={item.label}
              href={href}
              label={item.label}
              isActive={pathname === href}
            />
          )
        })}
      </nav>
    </aside>
  )
}
