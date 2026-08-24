import Image from 'next/image'

const SIZES = {
  sm: { ring: 40, logo: 22, border: 'border-[3px]' },
  md: { ring: 64, logo: 34, border: 'border-4' },
  lg: { ring: 88, logo: 48, border: 'border-[5px]' },
} as const

interface PageLoaderProps {
  size?: keyof typeof SIZES
  label?: string
  className?: string
}

export default function PageLoader({ size = 'md', label, className = '' }: PageLoaderProps) {
  const { ring, logo, border } = SIZES[size]

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative" style={{ width: ring, height: ring }}>
        <div className={`absolute inset-0 rounded-full ${border} border-primary-light`} />
        <div
          className={`absolute inset-0 rounded-full ${border} border-transparent border-t-primary-red animate-spin motion-reduce:animate-none`}
        />
        <div
          className="absolute inset-0 m-auto animate-pulse motion-reduce:animate-none"
          style={{ width: logo, height: logo }}
        >
          <Image src="/logo.png" alt="Loading" fill sizes={`${logo}px`} className="object-contain" priority />
        </div>
      </div>
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}
