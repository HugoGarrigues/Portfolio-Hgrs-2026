'use client'

import dynamic from 'next/dynamic'

const DesktopView = dynamic(
  () => import('@/components/desktop/Desktop').then((module) => ({ default: module.Desktop })),
  { ssr: false },
)

export function DesktopPageClient() {
  return <DesktopView />
}
