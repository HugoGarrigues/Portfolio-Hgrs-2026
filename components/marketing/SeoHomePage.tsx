import { ContactCta } from '@/components/marketing/ContactCta'
import { Experience } from '@/components/marketing/Experience'
import { FeaturedProjects } from '@/components/marketing/FeaturedProjects'
import { Hero } from '@/components/marketing/Hero'
import { MobileSeoHero } from '@/components/marketing/MobileSeoHero'
import { Skills } from '@/components/marketing/Skills'
import { JsonLd } from '@/components/seo/JsonLd'
import { getFeaturedProjects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'

type SeoHomePageProps = {
  heroVariant?: 'default' | 'mobile'
}

export function SeoHomePage({ heroVariant = 'default' }: SeoHomePageProps) {
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
        {heroVariant === 'mobile' ? <MobileSeoHero /> : <Hero />}
        <FeaturedProjects projects={projects} />
        <Experience />
        <Skills />
        <ContactCta showDesktopCta={heroVariant !== 'mobile'} />
      </div>
    </main>
  )
}
