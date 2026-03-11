import Link from 'next/link'
import StandingCommittees from '@/components/home/StandingCommittees'

const pillars = [
  {
    title: 'Family and social welfare',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Foreign policy and immigration',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 002 2h2.945M15 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM20.945 13H19a2 2 0 00-2-2v-1a2 2 0 00-2-2h-2.945M15 17.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: 'Constitutional order',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Economy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Education',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    title: 'Health',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Youth',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export default function HomeAboutSection() {
  return (
    <section
      className="py-10 bg-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/images/bg/blue_dots.png)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">About Us</h2>
          <div className="w-16 h-0.5 bg-primary-red mx-auto mb-3" />
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-snug">
            The People&apos;s Renaissance Movement (PM Party) is committed to transforming Kenya through
            people-centred policies, transparent governance, and inclusive development. We stand for
            integrity, service, and progress that benefits every citizen.
          </p>
        </div>

        <p className="text-gray-500 text-center mb-4 max-w-2xl mx-auto text-sm">
          We are working to transform Kenya through:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex items-center gap-3 py-2.5 px-3 rounded-md text-gray-600 hover:text-gray-800 transition-colors"
            >
              <div className="flex-shrink-0 text-primary-blue/70">
                {pillar.icon}
              </div>
              <span className="text-sm font-normal">{pillar.title}</span>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-[16/10] bg-gradient-to-br from-primary-blue to-primary-blue/80 flex items-center justify-center">
              <span className="text-white/90 text-4xl font-bold">S</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">Party Leadership Structure</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                Our party is organised from national level down to the grassroots—National, County, Constituency, Ward, and Polling Station—with clear roles at each tier.
              </p>
              <Link
                href="/about/leadership-structure"
                className="inline-flex items-center gap-1 text-primary-blue font-semibold text-sm hover:underline"
              >
                Read more &gt;
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-[16/10] bg-gradient-to-br from-primary-red to-primary-red/80 flex items-center justify-center">
              <span className="text-white/90 text-4xl font-bold">L</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">Party Leadership</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                Meet the men and women leading the People&apos;s Renaissance Movement at national and regional levels, driving our vision for Kenya.
              </p>
              <Link
                href="/about/leadership"
                className="inline-flex items-center gap-1 text-primary-blue font-semibold text-sm hover:underline"
              >
                Read more &gt;
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="aspect-[16/10] bg-gradient-to-br from-primary-blue/90 to-primary-red/80 flex items-center justify-center">
              <span className="text-white/90 text-4xl font-bold">M</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5">Our Party Manifesto</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                Our commitments and plans to transform Kenya—from economy and education to health, youth, and constitutional order.
              </p>
              <Link
                href="/about/manifesto"
                className="inline-flex items-center gap-1 text-primary-blue font-semibold text-sm hover:underline"
              >
                Read more &gt;
              </Link>
            </div>
          </div>
        </div>

        <StandingCommittees embedded />
      </div>
    </section>
  )
}
