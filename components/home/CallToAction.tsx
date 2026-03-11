import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="bg-primary-red text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Be part of the Movement.
        </h2>
        <p className="text-lg md:text-xl font-medium tracking-wide mb-6 max-w-2xl mx-auto">
          <span className="text-white">The Change We Need</span>
          <span className="mx-2 text-white/80" aria-hidden>·</span>
          <span className="text-white/95 italic">Mabadiliko Ni Sasa.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
          <Link
            href="/membership"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-white border border-white/70 bg-white/10 hover:bg-white/20 transition"
          >
            Become a Member
          </Link>
          <Link
            href="/volunteer"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-white border border-white/70 bg-white/10 hover:bg-white/20 transition"
          >
            Volunteer
          </Link>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-white border border-white/70 bg-white/10 hover:bg-white/20 transition"
          >
            Donate
          </Link>
        </div>
      </div>
    </section>
  )
}

