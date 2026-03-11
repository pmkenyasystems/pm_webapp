import Link from 'next/link'
import StandingCommittees from '@/components/home/StandingCommittees'

export default function HomeAboutSection() {
  return (
    <section
      id="about"
      className="py-10 bg-white bg-cover bg-center bg-no-repeat scroll-mt-20"
      style={{ backgroundImage: 'url(/images/bg/blue_dots.png)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1.5">About Us</h2>
          <div className="w-16 h-0.5 bg-primary-red mx-auto mb-3" />
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-snug">
            The People&apos;s Renaissance Movement (PM Party) is committed to transforming Kenya through
            people-centred policies, transparent governance, and inclusive development. We stand for
            integrity, service, and progress that benefits every citizen.
          </p>
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
