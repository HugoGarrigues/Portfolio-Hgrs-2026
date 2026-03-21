export type HomeExperience = 'desktop' | 'seo-mobile'

const BOT_PATTERN =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|twitterbot|linkedinbot|embedly|applebot|whatsapp|slackbot|discordbot|lighthouse|headless/i
const MOBILE_PATTERN =
  /android|iphone|ipad|ipod|mobile|blackberry|iemobile|opera mini|silk|kindle|tablet|playbook/i
const DESKTOP_PATTERN = /macintosh|windows nt|x11|linux x86_64|cros/i

export function isBotUserAgent(userAgent: string): boolean {
  return BOT_PATTERN.test(userAgent)
}

export function isMobileUserAgent(userAgent: string): boolean {
  return MOBILE_PATTERN.test(userAgent)
}

export function pickHomeExperience(input: { userAgent?: string | null }): HomeExperience {
  const userAgent = input.userAgent?.trim()

  if (!userAgent) {
    return 'seo-mobile'
  }

  if (isBotUserAgent(userAgent)) {
    return 'seo-mobile'
  }

  if (isMobileUserAgent(userAgent)) {
    return 'seo-mobile'
  }

  if (DESKTOP_PATTERN.test(userAgent)) {
    return 'desktop'
  }

  return 'seo-mobile'
}
