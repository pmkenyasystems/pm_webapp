import Hero from '@/components/home/Hero'
import CountdownBar from '@/components/home/CountdownBar'
import FeaturedContent from '@/components/home/FeaturedContent'
import HomeAboutSection from '@/components/home/HomeAboutSection'
import ManifestoSection from '@/components/home/ManifestoSection'
import LeadershipSection from '@/components/home/LeadershipSection'
import CommitteesSection from '@/components/home/CommitteesSection'
import AspirantSection from '@/components/home/AspirantSection'
import CallToAction from '@/components/home/CallToAction'
import HQLaunchNotice from '@/components/home/HQLaunchNotice'
import NDCNotice from '@/components/home/NDCNotice'

export default function Home() {
  return (
    <div>
      <HQLaunchNotice />
      <NDCNotice />
      <CountdownBar />
      <Hero />
      <FeaturedContent />
      <HomeAboutSection />
      <ManifestoSection />
      <LeadershipSection />
      <CommitteesSection />
      <AspirantSection />
      <CallToAction />
    </div>
  )
}
