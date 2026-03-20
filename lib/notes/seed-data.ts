export const EDITORIAL_TAGS = [
  { slug: 'about', label: 'About' },
  { slug: 'experience', label: 'Experience' },
  { slug: 'projects', label: 'Projects' },
  { slug: 'skills', label: 'Skills' },
  { slug: 'vision', label: 'Vision' },
] as const

export const OWNER_EDITORIAL_NOTES = [
  {
    pseudo: 'Hugo Garrigues',
    source: 'owner',
    status: 'published',
    tags: ['about', 'vision'],
    content:
      "I'm a full-stack developer focused on agentic engineering, product thinking, and building interfaces that feel intentional. I like turning fuzzy ideas into shipped systems with strong UX and clear technical structure.",
  },
  {
    pseudo: 'Hugo Garrigues',
    source: 'owner',
    status: 'published',
    tags: ['experience', 'skills'],
    content:
      "My day-to-day work blends frontend craft, backend pragmatism, and AI workflow design. I care about developer velocity, strong abstractions, and keeping products understandable for the people who use them and the people who maintain them.",
  },
  {
    pseudo: 'Hugo Garrigues',
    source: 'owner',
    status: 'published',
    tags: ['projects'],
    content:
      "This portfolio is designed as a macOS-like environment because I wanted the projects and writing to feel explored instead of merely listed. I enjoy building products where interaction design and technical architecture reinforce each other.",
  },
  {
    pseudo: 'Hugo Garrigues',
    source: 'owner',
    status: 'published',
    tags: ['skills', 'projects'],
    content:
      "My strongest stack today is TypeScript with React, Next.js, Tailwind, and Supabase, plus a growing specialization around agent orchestration, AI-assisted development, and productized automation.",
  },
  {
    pseudo: 'Hugo Garrigues',
    source: 'owner',
    status: 'published',
    tags: ['vision'],
    content:
      "I'm especially interested in roles where product intuition, engineering execution, and AI systems design all matter together. The work I want to do is ambitious, user-facing, and capable of evolving quickly without losing clarity.",
  },
] as const
