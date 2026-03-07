'use client'

import dynamic from 'next/dynamic'

const Desktop = dynamic(
  () => import('@/components/desktop/Desktop').then((m) => ({ default: m.Desktop })),
  { ssr: false },
)

export default function DevPreviewPage() {
  return <Desktop />
}
