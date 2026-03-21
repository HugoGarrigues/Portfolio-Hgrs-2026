import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { DesktopPageClient } from '@/components/desktop/DesktopPageClient'
import { SeoHomePage } from '@/components/marketing/SeoHomePage'
import { pickHomeExperience } from '@/lib/request-context'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  pathname: '/',
  keywords: siteConfig.keywords,
})

export default async function Home() {
  const requestHeaders = await headers()
  const homeExperience = pickHomeExperience({
    userAgent: requestHeaders.get('user-agent'),
  })

  if (homeExperience === 'desktop') {
    return <DesktopPageClient />
  }

  return <SeoHomePage heroVariant="mobile" />
}
