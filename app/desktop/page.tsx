import type { Metadata } from 'next'
import { DesktopPageClient } from '@/components/desktop/DesktopPageClient'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Expérience desktop',
  description:
    "Expérience immersive inspirée de macOS. Cette route reste accessible aux visiteurs, mais la surface SEO principale du portfolio se trouve sur les pages publiques.",
  pathname: '/desktop',
  index: false,
})

export default function DesktopPage() {
  return <DesktopPageClient />
}
