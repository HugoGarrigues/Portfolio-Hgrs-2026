import type { Metadata } from 'next'
import { DesktopPageClient } from '@/components/desktop/DesktopPageClient'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Aperçu de développement',
  description: "Route interne de prévisualisation desktop, non destinée à l'indexation.",
  pathname: '/dev-preview',
  index: false,
  follow: false,
})

export default function DevPreviewPage() {
  return <DesktopPageClient />
}
