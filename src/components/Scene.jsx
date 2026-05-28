import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { CarModel } from './CarModel'

export function Scene({ tuningConfig, activeModel }) {
  return (
    <Canvas
      camera={{ position: [4.35, 1.65, 4.35], fov: 36, near: 0.1, far: 100 }}
      dpr={[0.75, 1.35]}
      frameloop="demand"
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
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
          glassType={tuningConfig.glass}
          lightType={tuningConfig.lights}
          interiorType={tuningConfig.interior}
          exhaustType={tuningConfig.exhaust}
          suspensionType={tuningConfig.suspension}
        />
      </Suspense>

      {/* Floor Shadows (Baked once for performance) */}
      <ContactShadows position={[0, -0.01, 0]} opacity={0.38} scale={8} blur={2.4} far={3} frames={1} resolution={256} />

      {/* Orbit Controls */}
      <OrbitControls 
        makeDefault 
        target={[0, 0.85, 0]}
        minPolarAngle={0.15} 
        maxPolarAngle={Math.PI / 2.05} 
        enableZoom={true} 
        minDistance={3.1} 
        maxDistance={7.2} 
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.65}
        zoomSpeed={0.7}
      />
    </Canvas>
  )
}
