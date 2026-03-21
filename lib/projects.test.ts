import { describe, expect, it } from 'vitest'
import { getProjectBySlug, getPublishedProjects } from './projects'

describe('projects helpers', () => {
  it('returns only published projects for public SEO pages', () => {
    const projects = getPublishedProjects()

    expect(projects.length).toBeGreaterThan(0)
    expect(projects.every((project) => project.published)).toBe(true)
  })

  it('finds a project by slug for dynamic project routes', () => {
    const project = getProjectBySlug('portfolio-2026')

    expect(project?.id).toBe('portfolio-2026')
  })
})
