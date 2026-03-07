import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = { title: 'Dev Preview' }

// Desktop uses R3F + Framer Motion — browser-only
const Desktop = dynamic(
  () => import('@/components/desktop/Desktop').then((m) => ({ default: m.Desktop })),
  { ssr: false },
)

export default function DevPreviewPage() {
  return <Desktop />
}
