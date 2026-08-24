import PageLoader from '@/components/PageLoader'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <PageLoader size="lg" />
    </div>
  )
}
