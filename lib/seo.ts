import type { Metadata } from 'next'
import { siteConfig } from './site'

export function absoluteUrl(pathname: string = '/') {
  const normalizedPath = pathname.startsWith('http')
    ? pathname
    : pathname.startsWith('/')
      ? pathname
      : `/${pathname}`

  return new URL(normalizedPath, siteConfig.url).toString()
}

type BuildMetadataInput = {
  title?: string
  description?: string
  pathname?: string
  image?: string
  keywords?: readonly string[]
  index?: boolean
  follow?: boolean
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  pathname = '/',
  image = '/opengraph-image',
  keywords = [],
  index = true,
  follow = true,
}: BuildMetadataInput = {}): Metadata {
  const metadataTitle = title
    ? `${title} | ${siteConfig.personName}`
    : `${siteConfig.title} | ${siteConfig.personName}`
  const canonical = absoluteUrl(pathname)
  const ogImage = absoluteUrl(image)

  return {
    title: metadataTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical,
    },
    robots: {
      index,
      follow,
    },
    openGraph: {
      title: metadataTitle,
      description,
      url: canonical,
      siteName: siteConfig.siteName,
      locale: 'fr_FR',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metadataTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadataTitle,
      description,
      images: [ogImage],
    },
  }
}
