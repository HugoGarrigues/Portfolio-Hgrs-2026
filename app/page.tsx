import type { Metadata } from 'next'
import { SeoHomePage } from '@/components/marketing/SeoHomePage'
import { buildMetadata } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  pathname: '/',
  keywords: siteConfig.keywords,
})

export default function Home() {
  return <SeoHomePage heroVariant="default" />
}

