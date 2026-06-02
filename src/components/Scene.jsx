import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei'
import { CarModel } from './CarModel'

export function Scene({ tuningConfig, activeModel }) {
  const isMobile = useMediaQuery('(max-width: 760px)')
  const cameraPosition = isMobile ? [5, 1.8, 5] : [4.35, 1.65, 4.35]
  const cameraFov = isMobile ? 45 : 36
  const controlsTarget = isMobile ? [0, 0.72, 0] : [0, 0.85, 0]

  return (
    <Canvas
      dpr={[0.65, 1]}
      frameloop="demand"
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} near={0.1} far={100} />
      <color attach="background" args={['#ffffff']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.75} />
      <spotLight position={[8, 8, 8]} angle={0.18} penumbra={1} intensity={1.2} />
      <directionalLight position={[-8, 6, 5]} intensity={1.35} />
      
      {/* Environment for reflections (studio look) */}
      <Environment preset="studio" />

      <Suspense fallback={null}>
        <CarModel
          key={activeModel}
          modelId={activeModel}
          color={tuningConfig.color}
          paintFinish={tuningConfig.paintFinish}
          rimType={tuningConfig.rims}
          spoilerType={tuningConfig.spoiler}
          trimType={tuningConfig.trim}
          carbonType={tuningConfig.carbon}
          aeroType={tuningConfig.aero}
          decalType={tuningConfig.decals}
          badgeType={tuningConfig.badges}
          mirrorType={tuningConfig.mirrors}
          metalType={tuningConfig.metal}
          tireType={tuningConfig.tires}
          caliperType={tuningConfig.caliper}
          interiorType={tuningConfig.interior}
          exhaustType={tuningConfig.exhaust}
          suspensionType={tuningConfig.suspension}
          targetSize={isMobile ? 4.3 : 4.65}
        />
      </Suspense>

      {/* Floor Shadows (Baked once for performance) */}
      <ContactShadows position={[0, -0.01, 0]} opacity={0.38} scale={8} blur={2.4} far={3} frames={1} resolution={256} />

      {/* Orbit Controls */}
      <OrbitControls 
        makeDefault 
        target={controlsTarget}
        minPolarAngle={0.15} 
        maxPolarAngle={Math.PI / 2.05} 
        enableZoom={true} 
        minDistance={isMobile ? 3.7 : 3.1} 
        maxDistance={isMobile ? 8.6 : 7.2} 
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.65}
        zoomSpeed={0.7}
      />
    </Canvas>
  )
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatches = () => setMatches(mediaQuery.matches)

    updateMatches()
    mediaQuery.addEventListener('change', updateMatches)
    return () => mediaQuery.removeEventListener('change', updateMatches)
  }, [query])

  return matches
}
