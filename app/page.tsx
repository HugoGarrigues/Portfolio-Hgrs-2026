'use client'

import dynamic from 'next/dynamic'

// Desktop uses R3F + Framer Motion — browser-only
const Desktop = dynamic(
  () => import('@/components/desktop/Desktop').then((m) => ({ default: m.Desktop })),
  { ssr: false },
)

export default function Home() {
  return <Desktop />
}
