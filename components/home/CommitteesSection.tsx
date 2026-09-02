import Link from 'next/link'
import { allOrganisations as committees } from '@/lib/committees'

export default function CommitteesSection() {
  return (
    <section id="committees" className="py-12 md:py-[88px] bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-11">
        <span className="font-heading font-bold tracking-[2px] text-[13px] uppercase text-primary-red">
          Get Involved
        </span>
        <h2 className="font-heading font-black text-2xl md:text-4xl uppercase mt-3.5 text-primary-blue">
          Party Organs
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-[18px]">
        {committees.map((c) => (
          <div
            key={c.id}
            className="p-[22px] rounded-xl border-[1.5px] border-gray-200 border-l-4 border-l-primary-blue transition-all duration-200 hover:border-l-primary-red hover:-translate-y-1"
          >
            <div className="font-extrabold text-base mb-2">{c.title}</div>
            <div className="text-[13.5px] text-gray-600 leading-snug mb-3">{c.description}</div>
            <Link href={`/${c.id}`} className="font-extrabold text-[13.5px] text-primary-blue hover:text-primary-red transition">
              Read more &rarr;
            </Link>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}
