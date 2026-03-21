import { describe, expect, it } from 'vitest'
import { absoluteUrl } from './seo'

describe('seo helpers', () => {
  it('builds absolute canonical URLs from a relative pathname', () => {
    expect(absoluteUrl('/projects')).toMatch(/^https?:\/\/.+\/projects$/)
  })
})
