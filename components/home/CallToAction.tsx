import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="bg-primary-red text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join the Movement for Change
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-red-100">
          Together, we can build a Kenya that works for everyone. 
          Your support makes the difference.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/membership"
            className="bg-white text-primary-red hover:bg-gray-100 px-8 py-3 rounded-md font-semibold transition"
          >
            Join as Member
          </Link>
          <Link
            href="/donate"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-red px-8 py-3 rounded-md font-semibold transition"
          >
            Support Our Cause
          </Link>
        </div>
      </div>
    </section>
  )
}

