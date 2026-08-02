export const siteConfig = {
  name: 'HGRS Portfolio',
  siteName: 'HGRS',
  personName: 'Hugo Garrigues',
  title: 'Développeur full-stack et agentic engineer à Aix-en-Provence',
  description:
    "Portfolio de Hugo Garrigues, développeur full-stack spécialisé en Next.js, TypeScript et expériences web immersives. Découvrez ses projets, son approche produit et son expérience desktop inspirée de macOS.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://hgrs.studio-saas.com'),
  locale: 'fr',
  email: 'garrigues.hug@gmail.com',
  github: 'https://github.com/HugoGarrigues',
  location: 'Aix-en-Provence, France',
  role: 'Développeur full-stack et agentic engineer',
  keywords: [
    'portfolio développeur full-stack',
    'portfolio Next.js',
    'agentic engineer',
    'développeur TypeScript',
    'développeur web France',
    'portfolio développeur frontend',
    'portfolio développeur React',
  ],
  navigation: [
    { href: '/', label: 'Accueil' },
    { href: '/projects', label: 'Projets' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
    { href: '/desktop', label: 'Expérience desktop' },
  ],
  hero: {
    eyebrow: 'Portfolio 2026',
    headline: 'Développeur full-stack, agentic engineer et designer d’expériences web mémorables.',
    intro:
      "Je conçois des interfaces ambitieuses, des produits web rapides et des workflows pilotés par l'IA, avec une exigence particulière sur le détail, la narration et la qualité d'exécution.",
    primaryCta: { href: '/projects', label: 'Voir les projets' },
    secondaryCta: { href: '/contact', label: 'Me contacter' },
    tertiaryCta: { href: '/desktop', label: "Ouvrir l'expérience desktop" },
    highlights: [
      'Next.js, React et TypeScript',
      'Interfaces immersives et motion design produit',
      'Automatisation, agents et outils internes',
    ],
  },
  about: {
    summary:
      "Je travaille à la frontière du produit, du design d'interface et de l'ingénierie logicielle. Mon objectif: construire des expériences web qui se distinguent visuellement tout en restant solides, rapides et maintenables.",
    principles: [
      "Penser l'expérience avant l'empilement de features",
      'Utiliser l’IA comme accélérateur de qualité, pas comme substitut au jugement',
      'Conserver des fondations techniques propres pour itérer vite',
    ],
  },
} as const
