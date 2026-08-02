import type { Metadata } from 'next'
import { DesktopPageClient } from '@/components/desktop/DesktopPageClient'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildMetadata, absoluteUrl } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  pathname: '/',
  keywords: siteConfig.keywords,
})

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteConfig.siteName,
            url: absoluteUrl('/'),
            inLanguage: 'fr',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteConfig.personName,
            jobTitle: siteConfig.role,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Aix-en-Provence',
              addressCountry: 'FR',
            },
            email: siteConfig.email,
            url: absoluteUrl('/'),
            sameAs: [siteConfig.github],
          },
        ]}
      />
      <div className="sr-only">
        <h1>{siteConfig.personName} - {siteConfig.title}</h1>
        <p>{siteConfig.description}</p>
        <nav aria-label="Navigation principale">
          <ul>
            <li><a href="/projects">Projets</a></li>
            <li><a href="/about">À propos</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
      <DesktopPageClient />
    </>
  )
}
