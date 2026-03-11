import Link from 'next/link'

export default function MissionVisionSection() {
  return (
    <section className="pt-0 pb-16 md:pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          <span className="text-primary-blue">Our Mission and </span>
          <span className="text-primary-red">Vision</span>
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          People&apos;s Renaissance Movement is <strong>dedicated</strong> to creating a better, more inclusive future for our nation. We are committed to empowering citizens, fostering transparent <strong>governance</strong>, and driving <strong>socio-economic</strong> development.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 bg-primary-red text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#9A162D] transition"
        >
          About Us
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
