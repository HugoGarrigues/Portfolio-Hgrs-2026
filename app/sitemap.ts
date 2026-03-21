import type { MetadataRoute } from 'next'
import { getPublishedProjects } from '@/lib/projects'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/projects', '/about', '/contact']
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }))
  const projectEntries: MetadataRoute.Sitemap = getPublishedProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(`${project.year}-01-01`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...projectEntries]
}
