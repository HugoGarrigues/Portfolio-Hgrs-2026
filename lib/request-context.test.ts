import { describe, expect, it } from 'vitest'
import { pickHomeExperience } from './request-context'

describe('pickHomeExperience', () => {
  it('routes clear desktop browsers to the desktop experience', () => {
    expect(
      pickHomeExperience({
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      }),
    ).toBe('desktop')
  })

  it('routes mobile browsers to the seo mobile experience', () => {
    expect(
      pickHomeExperience({
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
      }),
    ).toBe('seo-mobile')
  })

  it('routes bots and crawlers to the seo mobile experience', () => {
    expect(
      pickHomeExperience({
        userAgent:
          'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      }),
    ).toBe('seo-mobile')
  })

  it('falls back to the seo mobile experience when the request is ambiguous', () => {
    expect(pickHomeExperience({ userAgent: null })).toBe('seo-mobile')
    expect(pickHomeExperience({ userAgent: 'curl/8.7.1' })).toBe('seo-mobile')
  })
})
