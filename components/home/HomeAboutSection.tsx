import Link from 'next/link'

export default function HomeAboutSection() {
  return (
    <section id="about" className="py-12 md:py-[88px] bg-primary-blue text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-[760px] mx-auto text-center">
        <span className="font-heading font-bold tracking-[2px] text-[13px] uppercase text-white">
          About Us
        </span>
        <h2 className="font-heading font-black text-[26px] md:text-[38px] uppercase my-3.5 mb-[18px]">
          Our Ideology
        </h2>
        <p className="text-base md:text-lg leading-relaxed text-white/90">
          The People&apos;s Renaissance Movement (PM Party) is founded on the ideology of Liberal
          Democracy &mdash; a belief in the primacy of the individual&apos;s rights and freedoms,
          safeguarded by constitutionally established institutions, and grounded in the rule of law,
          justice, and accountable governance.
        </p>
        <Link
          href="/about"
          className="inline-block mt-7 font-extrabold text-[15px] px-7 py-3.5 rounded-full bg-white text-primary-blue hover:bg-primary-red hover:text-white transition"
        >
          Read Our Full Story
        </Link>
      </div>
      </div>
    </section>
  )
}
