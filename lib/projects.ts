import projectsData from '@/data/projects.json'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProjectCategory = 'pro' | 'personal' | 'school'
export type ProjectStatus = 'Deployed' | 'In Progress' | 'Concept'

export type Project = {
  id: string
  name: string
  tagline: string
  description: string
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
