import Hero from '@/components/home/Hero'
import WavySeparator from '@/components/home/WavySeparator'
import FeaturedContent from '@/components/home/FeaturedContent'
import HomeAboutSection from '@/components/home/HomeAboutSection'
import OurContacts from '@/components/home/OurContacts'
import CallToAction from '@/components/home/CallToAction'
import HQLaunchNotice from '@/components/home/HQLaunchNotice'

export default function Home() {
  return (
    <div>
      <HQLaunchNotice />
      <div className="flex flex-col h-[75vh]">
        <Hero />
        <WavySeparator />
      </div>
      <FeaturedContent />
      <HomeAboutSection />
      <OurContacts />
      <CallToAction />
    </div>
  )
}

