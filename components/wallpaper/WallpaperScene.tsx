'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Particle field ────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 1800

function Particles() {
  const meshRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread across a wide field
      positions[i * 3]     = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8

      // Colors: mix of deep purple, indigo, cyan
      const t = Math.random()
      if (t < 0.4) {
        // deep purple
        colors[i * 3] = 0.35 + Math.random() * 0.15
        colors[i * 3 + 1] = 0.05
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3
      } else if (t < 0.75) {
        // indigo
        colors[i * 3] = 0.15
        colors[i * 3 + 1] = 0.15 + Math.random() * 0.2
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
      } else {
        // faint cyan
        colors[i * 3] = 0.05
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.4
        colors[i * 3 + 2] = 0.9
      }
    }
    return { positions, colors }
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.012
    meshRef.current.rotation.x = Math.sin(t * 0.007) * 0.08
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  )
}

// ─── Aurora blobs ──────────────────────────────────────────────────────────────

function AuroraBlob({
  position,
  color,
  speed,
  radius,
}: {
  position: [number, number, number]
  color: string
  speed: number
  radius: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed
    ref.current.position.x = position[0] + Math.sin(t) * 0.6
    ref.current.position.y = position[1] + Math.cos(t * 0.7) * 0.4
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.07} />
    </mesh>
  )
}

// ─── Scene ─────────────────────────────────────────────────────────────────────

export default function WallpaperScene() {
  return (
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(135deg, #080810 0%, #0d0820 50%, #080810 100%)' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Particles />
        <AuroraBlob position={[-3, 1.5, -2]} color="#5500ff" speed={0.3} radius={3.5} />
        <AuroraBlob position={[3, -1,  -2]} color="#0044ff" speed={0.22} radius={3} />
        <AuroraBlob position={[0,  0,  -3]} color="#00aaff" speed={0.18} radius={2.5} />
      </Canvas>
    </div>
  )
}
