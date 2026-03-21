import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
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
            <span style={{ fontSize: 28, letterSpacing: 8, textTransform: 'uppercase', color: '#a5f3fc' }}>Portfolio 2026</span>
            <h1 style={{ fontSize: 72, lineHeight: 1.05, margin: '32px 0 24px', maxWidth: 860 }}>
              {siteConfig.personName}
            </h1>
            <p style={{ fontSize: 30, lineHeight: 1.4, maxWidth: 900, color: '#dbeafe' }}>{siteConfig.title}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: '#cbd5e1' }}>
            <span>{siteConfig.location}</span>
            <span>{siteConfig.siteName}</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
