import type { Metadata } from 'next'
import { DesktopPageClient } from '@/components/desktop/DesktopPageClient'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Expérience desktop',
  description:
    "Accès direct secondaire à l’expérience desktop immersive du portfolio. Sur ordinateur, l’accueil principal ouvre désormais directement cette expérience.",
  pathname: '/desktop',
  index: false,
})

export default function DesktopPage() {
  return <DesktopPageClient />
}
