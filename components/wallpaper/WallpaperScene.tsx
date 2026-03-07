'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function GradientMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.04
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.06
    }
  })

  return (
    <mesh ref={meshRef} scale={2.4}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#1a0a3a"
        distort={0.35}
        speed={1.2}
        roughness={0.8}
      />
    </mesh>
  )
}

export default function WallpaperScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 60 }}
      gl={{ antialias: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 3, 2]} intensity={1.2} color="#4040ff" />
      <pointLight position={[-3, -2, -1]} intensity={0.8} color="#8000ff" />
      <GradientMesh />
    </Canvas>
  )
}
