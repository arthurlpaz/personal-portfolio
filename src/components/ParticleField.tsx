import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import AIMotifs from './AIMotifs'

// Node palette (normalized RGB) — particles are tinted between steel and teal.
const STEEL_RGB = [0.275, 0.51, 0.706]
const TEAL_RGB = [0.176, 0.831, 0.749]

const PARTICLE_COUNT = 220
const CONNECTION_DISTANCE = 2.8
const MOUSE_INFLUENCE = 3.5

function Particles() {
  const mesh = useRef<THREE.Points>(null!)
  const lines = useRef<THREE.LineSegments>(null!)
  const mouse = useRef(new THREE.Vector2(0, 0))
  const { viewport } = useThree()

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      vel[i * 3] = (Math.random() - 0.5) * 0.008
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.008
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004
    }
    return [pos, vel]
  }, [])

  const sizes = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s[i] = Math.random() * 2.5 + 0.8
    }
    return s
  }, [])

  // Per-particle color, lerped steel -> teal, reused to tint the connections too.
  const colors = useMemo(() => {
    const c = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = Math.random()
      c[i * 3] = STEEL_RGB[0] + (TEAL_RGB[0] - STEEL_RGB[0]) * t
      c[i * 3 + 1] = STEEL_RGB[1] + (TEAL_RGB[1] - STEEL_RGB[1]) * t
      c[i * 3 + 2] = STEEL_RGB[2] + (TEAL_RGB[2] - STEEL_RGB[2]) * t
    }
    return c
  }, [])

  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6), [])
  const lineColors = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6), [])

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, [])

  useMemo(() => {
    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [handlePointerMove])

  useFrame((state) => {
    const posArr = mesh.current.geometry.attributes.position.array as Float32Array
    const time = state.clock.elapsedTime

    const mouseWorld = new THREE.Vector3(
      mouse.current.x * viewport.width / 2,
      mouse.current.y * viewport.height / 2,
      0
    )

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2
      posArr[ix] += velocities[ix] + Math.sin(time * 0.3 + i) * 0.002
      posArr[iy] += velocities[iy] + Math.cos(time * 0.2 + i * 0.7) * 0.002
      posArr[iz] += velocities[iz]

      const dx = mouseWorld.x - posArr[ix]
      const dy = mouseWorld.y - posArr[iy]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_INFLUENCE) {
        const force = (1 - dist / MOUSE_INFLUENCE) * 0.015
        posArr[ix] += dx * force
        posArr[iy] += dy * force
      }

      if (posArr[ix] > 10 || posArr[ix] < -10) velocities[ix] *= -1
      if (posArr[iy] > 7 || posArr[iy] < -7) velocities[iy] *= -1
      if (posArr[iz] > 5 || posArr[iz] < -5) velocities[iz] *= -1
    }

    mesh.current.geometry.attributes.position.needsUpdate = true

    let lineIdx = 0
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = posArr[i * 3] - posArr[j * 3]
        const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1]
        const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2]
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (d < CONNECTION_DISTANCE) {
          const alpha = 1 - d / CONNECTION_DISTANCE
          linePositions[lineIdx * 6] = posArr[i * 3]
          linePositions[lineIdx * 6 + 1] = posArr[i * 3 + 1]
          linePositions[lineIdx * 6 + 2] = posArr[i * 3 + 2]
          linePositions[lineIdx * 6 + 3] = posArr[j * 3]
          linePositions[lineIdx * 6 + 4] = posArr[j * 3 + 1]
          linePositions[lineIdx * 6 + 5] = posArr[j * 3 + 2]
          // Gradient along the segment: node i's color -> node j's color, faded by distance.
          lineColors[lineIdx * 6] = colors[i * 3]
          lineColors[lineIdx * 6 + 1] = colors[i * 3 + 1]
          lineColors[lineIdx * 6 + 2] = colors[i * 3 + 2]
          lineColors[lineIdx * 6 + 3] = colors[j * 3] * alpha
          lineColors[lineIdx * 6 + 4] = colors[j * 3 + 1] * alpha
          lineColors[lineIdx * 6 + 5] = colors[j * 3 + 2] * alpha
          lineIdx++
        }
      }
    }

    // Buffers are pre-allocated and attached once — update in place (no per-frame
    // allocation) and just move the draw range to however many links are active.
    const lineGeo = lines.current.geometry
    lineGeo.attributes.position.needsUpdate = true
    lineGeo.attributes.color.needsUpdate = true
    lineGeo.setDrawRange(0, lineIdx * 2)
  })

  return (
    <>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null!)

  const orbs = useMemo(() =>
    Array.from({ length: 5 }, () => ({
      position: [
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        -2 - Math.random() * 3
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 1.2,
      speed: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }))
  , [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const orb = orbs[i]
      child.position.y = orb.position[1] + Math.sin(t * orb.speed + orb.phase) * 0.8
      child.position.x = orb.position[0] + Math.cos(t * orb.speed * 0.7 + orb.phase) * 0.4
    })
  })

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 32, 32]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#4682B4' : '#2dd4bf'}
            transparent
            opacity={0.03}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <Particles />
        <FloatingOrbs />
      </Canvas>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(70,130,180,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 70%, rgba(45,212,191,0.04) 0%, transparent 70%)
          `
        }}
      />
      <AIMotifs />
      <div className="grain absolute inset-0 pointer-events-none" aria-hidden />
    </div>
  )
}
