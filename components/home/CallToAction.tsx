import Link from 'next/link'

export default function CallToAction() {
  return (
    <section id="join" className="py-11 md:py-[60px] bg-primary-blue text-white text-center scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-black text-2xl md:text-[32px] uppercase mb-2.5">
          Be Part Of The Movement
        </h2>
        <p className="text-white text-[15px] mb-[26px]">The Change We Need &middot; Mabadiliko Ni Sasa</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/membership"
            className="font-extrabold text-[15px] px-6 py-[13px] rounded-full bg-primary-red text-white hover:bg-[#c9141a] transition"
          >
            Become a Member
          </Link>
          <Link
            href="/volunteer"
            className="font-extrabold text-[15px] px-6 py-[13px] rounded-full border-2 border-white text-white hover:bg-white hover:text-primary-blue transition"
          >
            Volunteer
          </Link>
          <Link
            href="/donate"
            className="font-extrabold text-[15px] px-6 py-[13px] rounded-full bg-white text-primary-blue hover:bg-gray-200 transition"
          >
            Donate
          </Link>
        </div>
      </div>
    </section>
  )
}
