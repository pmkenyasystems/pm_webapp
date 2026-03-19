const PHONE = '+254 119 165 87'
const EMAIL = 'info@pmkenya.ke'
const HQ_ADDRESS = 'Riara Lane, Nairobi'
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Riara+Lane+Nairobi+Kenya'

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/_pmkenya?igsh=MXc2cHQxc3RqbW1kcQ==',
    ariaLabel: 'Instagram',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/14WjwU4SeEV/',
    ariaLabel: 'Facebook',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@_pmkenya?_r=1&_t=ZS-93GELwh7pNo',
    ariaLabel: 'TikTok',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://x.com/_pmkenya',
    ariaLabel: 'X (Twitter)',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@pmkenya',
    ariaLabel: 'YouTube',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

export default function OurContacts() {
  return (
    <section id="contacts" className="py-8 md:py-10 bg-gray-50/80 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Our Contacts
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-y-5">
          <a
            href={`tel:${PHONE.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2.5 text-gray-700 hover:text-primary-blue transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:ring-offset-2 rounded-lg px-3 py-1.5"
            aria-label={`Call us: ${PHONE}`}
          >
            <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-blue shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <span className="text-sm font-medium">{PHONE}</span>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-2.5 text-gray-700 hover:text-primary-blue transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:ring-offset-2 rounded-lg px-3 py-1.5"
            aria-label={`Email us: ${EMAIL}`}
          >
            <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-blue shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="text-sm font-medium break-all">{EMAIL}</span>
          </a>

          <div className="inline-flex items-center gap-2.5 text-gray-700">
            <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-blue shadow-sm flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-left">{HQ_ADDRESS}</span>
          </div>

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-blue text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:ring-offset-2 rounded"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            Google Maps
          </a>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-200/80">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Follow us</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, ariaLabel, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-500 hover:border-primary-blue/40 hover:text-primary-blue hover:bg-primary-blue/5 transition-all shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-blue/50 focus:ring-offset-2"
                aria-label={ariaLabel}
                title={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
