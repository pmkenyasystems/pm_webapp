'use client'

interface AdminHeaderProps {
  title: string
  children?: React.ReactNode
}

export default function AdminHeader({ title, children }: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading font-extrabold text-lg uppercase tracking-wide text-gray-900">{title}</h1>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  )
}
