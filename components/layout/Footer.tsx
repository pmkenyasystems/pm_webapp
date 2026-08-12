import Link from 'next/link'

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/_pmkenya',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/14WjwU4SeEV/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/_pmkenya',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@_pmkenya',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer id="contacts" className="px-6 pt-10 pb-7 md:px-12 md:pt-[60px] md:pb-8 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-7 bg-white">
      <div>
        <div className="font-heading font-extrabold text-lg mb-2 text-primary-blue">
          PEOPLE&apos;S RENAISSANCE MOVEMENT
        </div>
        <div className="text-primary-red text-sm font-bold mb-3.5">The Change We Need</div>
        <div className="text-sm text-gray-600 leading-loose">
          +254 119 916 587
          <br />
          info@pmkenya.ke
          <br />
          Riara Lane, Nairobi
        </div>
      </div>

      <div>
        <div className="font-bold text-sm mb-3.5 uppercase tracking-wide">Quick Links</div>
        <div className="flex flex-col gap-2.5 text-sm text-gray-600">
          <Link href="/#about" className="hover:text-primary-blue transition">About Us</Link>
          <Link href="/membership" className="hover:text-primary-blue transition">Membership</Link>
          <Link href="/volunteer" className="hover:text-primary-blue transition">Volunteer</Link>
          <Link href="/donate" className="hover:text-primary-blue transition">Donate</Link>
        </div>
      </div>

      <div>
        <div className="font-bold text-sm mb-3.5 uppercase tracking-wide">Resources</div>
        <div className="flex flex-col gap-2.5 text-sm text-gray-600">
          <Link href="/articles" className="hover:text-primary-blue transition">Articles</Link>
          <Link href="/contact" className="hover:text-primary-blue transition">Contact Us</Link>
          <Link href="/admin/login" className="hover:text-primary-blue transition">Admin Login</Link>
        </div>
      </div>

      <div>
        <div className="font-bold text-sm mb-3.5 uppercase tracking-wide">Follow Us</div>
        <div className="flex flex-col gap-2.5 text-sm text-gray-600">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary-blue transition"
              aria-label={label}
            >
              {icon}
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="col-span-full border-t border-gray-200 pt-5 text-[13px] text-gray-500">
        &copy; {new Date().getFullYear()} People&apos;s Renaissance Movement. All rights reserved.
      </div>
    </footer>
  )
}
