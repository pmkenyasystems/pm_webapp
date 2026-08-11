import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PM Countdown to 2027',
  description:
    "A running countdown to Kenya's 2027 General Elections on Tuesday, 10th August 2027.",
}

export default function CountdownLayout({ children }: { children: React.ReactNode }) {
  return children
}
