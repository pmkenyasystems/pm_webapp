import PageLoader from '@/components/PageLoader'

export default function AdminLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <PageLoader size="lg" />
    </div>
  )
}
