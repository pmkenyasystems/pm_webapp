'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import SearchButton from './SearchButton'

const NAV_LINKS = [
  { href: '/#news', label: 'News' },
  { href: '/#events', label: 'Events' },
  { href: '/#about', label: 'About' },
  { href: '/#manifesto', label: 'Manifesto' },
  { href: '/#leadership', label: 'Leadership' },
  { href: '/#committees', label: 'Party Organs' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3.5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="relative h-11 md:h-[58px] w-auto aspect-[943/693] flex-shrink-0">
            <Image
              src="/logo_full.png"
              alt="PM Party logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline font-heading font-extrabold text-[19px] tracking-[0.3px] whitespace-nowrap text-primary-blue">
            PEOPLE&apos;S RENAISSANCE MOVEMENT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-bold text-[14.5px] text-gray-900 uppercase tracking-[0.3px] hover:text-primary-red transition"
            >
              {link.label}
            </Link>
          ))}
          <SearchButton />
          <Link
            href="/membership/register"
            className="font-extrabold text-[14.5px] text-white bg-primary-red px-5 py-2.5 rounded-full uppercase tracking-[0.3px] hover:bg-primary-blue transition"
          >
            Membership
          </Link>
        </nav>

        <div className="md:hidden flex items-center gap-1 flex-shrink-0">
          <SearchButton />
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="flex flex-col gap-[5px] p-2 flex-shrink-0"
          >
            <span className="w-[22px] h-[2.5px] rounded-full bg-primary-blue" />
            <span className="w-[22px] h-[2.5px] rounded-full bg-primary-red" />
            <span className="w-[22px] h-[2.5px] rounded-full bg-primary-blue" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-5 flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-3.5 font-bold text-base uppercase border-b border-gray-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/membership/register"
              onClick={() => setIsOpen(false)}
              className="py-3.5 font-bold text-base uppercase text-primary-red"
            >
              Membership
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
