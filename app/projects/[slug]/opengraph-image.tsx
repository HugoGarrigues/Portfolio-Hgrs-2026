import { ImageResponse } from 'next/og'
import { getProjectBySlug } from '@/lib/projects'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

type ProjectOpengraphImageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectOpengraphImage({ params }: ProjectOpengraphImageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  const title = project?.name ?? 'Projet'
  const subtitle = project?.tagline ?? 'Étude de cas'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          background: 'linear-gradient(135deg, #07111a 0%, #0e2430 55%, #13384a 100%)',
          color: '#f8fafc',
          padding: '64px',
          position: 'relative',
          fontFamily: 'SF Pro Display, Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top left, rgba(34,211,238,0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(125,211,252,0.18), transparent 26%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 28, letterSpacing: 8, textTransform: 'uppercase', color: '#a5f3fc' }}>Étude de cas</span>
            <h1 style={{ fontSize: 70, lineHeight: 1.05, margin: '32px 0 20px', maxWidth: 900 }}>{title}</h1>
            <p style={{ fontSize: 28, lineHeight: 1.4, maxWidth: 930, color: '#dbeafe' }}>{subtitle}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: '#cbd5e1' }}>
            <span>{project?.theme ?? 'Projet'}</span>
            <span>HGRS Portfolio</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
