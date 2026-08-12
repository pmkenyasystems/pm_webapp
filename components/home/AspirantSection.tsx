import Link from 'next/link'

export default function AspirantSection() {
  return (
    <section id="aspirant" className="px-5 py-12 md:px-12 md:py-[88px] bg-primary-red text-white scroll-mt-20">
      <div className="max-w-[760px] mx-auto text-center">
        <span className="font-heading font-bold tracking-[2px] text-[13px] uppercase text-white">
          2027 General Election
        </span>
        <h2 className="font-heading font-black text-2xl md:text-4xl uppercase my-3.5 mb-[18px]">
          Stand For Office On A PM Party Ticket
        </h2>
        <p className="text-[15px] md:text-base leading-relaxed text-white mb-[30px]">
          From polling station committee to the Presidency — if you believe in the Big Five Agenda
          and are ready to serve, apply to be vetted as a PM Party aspirant.
        </p>
        <Link
          href="/aspirants/apply"
          className="inline-block font-extrabold text-[15px] px-[30px] py-[15px] rounded-full bg-white text-primary-red shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-transform"
        >
          Apply as an Aspirant
        </Link>
      </div>
    </section>
  )
}
