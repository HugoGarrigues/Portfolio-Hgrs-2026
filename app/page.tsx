import type { Metadata } from 'next'
import { ContactCta } from '@/components/marketing/ContactCta'
import { Experience } from '@/components/marketing/Experience'
import { FeaturedProjects } from '@/components/marketing/FeaturedProjects'
import { Hero } from '@/components/marketing/Hero'
import { Skills } from '@/components/marketing/Skills'
import { JsonLd } from '@/components/seo/JsonLd'
import { getFeaturedProjects } from '@/lib/projects'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  pathname: '/',
  keywords: siteConfig.keywords,
})

export default function Home() {
  const projects = getFeaturedProjects()

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eef4f7_45%,#f7f5ef_100%)] px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteConfig.siteName,
            url: siteConfig.url,
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
            url: siteConfig.url,
            sameAs: [siteConfig.github],
          },
        ]}
      />

      <div className="mx-auto grid max-w-7xl gap-8 pb-10 pt-2">
        <Hero />
        <FeaturedProjects projects={projects} />
        <Experience />
        <Skills />
        <ContactCta />
      </div>
    </main>
  )
}
