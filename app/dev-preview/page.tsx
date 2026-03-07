import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = { title: 'Dev Preview' }

// Framer Motion drag requires a browser environment
const WindowDemo = dynamic(() => import('./WindowDemo'), { ssr: false })

export default function DevPreviewPage() {
  return <WindowDemo />
}
