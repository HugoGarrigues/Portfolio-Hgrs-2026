import projectsData from '@/data/projects.json'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectCategory = 'pro' | 'personal' | 'school'
export type ProjectStatus = 'Deployed' | 'In Progress' | 'Concept'

export type Project = {
  id: string
  slug: string
  name: string
  tagline: string
  excerpt: string
  description: string
  seoTitle: string
  seoDescription: string
  published: boolean
  featured: boolean
  categories: ProjectCategory[]
  theme: string
  stack: string[]
  year: number
  status: ProjectStatus
  links: {
    github: string | null
    live: string | null
  }
  thumbnail: string | null
  coverImage: string | null
  keywords: string[]
  results: string[]
  contentSections: Array<{
    title: string
    body: string[]
  }>
  images?: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  return projectsData.projects as Project[]
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return getProjects().filter((p) => p.categories.includes(category))
}

export function getProjectById(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id)
}

export function getPublishedProjects(): Project[] {
  return getProjects().filter((project) => project.published)
}

export function getFeaturedProjects(): Project[] {
  return getPublishedProjects().filter((project) => project.featured)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getPublishedProjects().find((project) => project.slug === slug)
}
