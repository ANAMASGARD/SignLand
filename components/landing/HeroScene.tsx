'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { HeroModel } from './HeroModel';
import { Suspense } from 'react';

export function HeroScene() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas frameloop="always" dpr={[1, 2]}>
        {/* Camera raised and pulled back to see full robot with floating */}
        <PerspectiveCamera makeDefault position={[0, 0.5, 5]} fov={45} />

        {/* OrbitControls for user interaction - works with mouse & touch */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.5}
        />

        {/* Enhanced Lighting - Bright and Professional */}
        {/* Bright ambient light for overall illumination */}
        <ambientLight intensity={1.2} color="#ffffff" />
        
        {/* Main key light - bright front light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.0}
          color="#ffffff"
          castShadow
        />
        
        {/* Fill light - softer side lighting */}
        <directionalLight
          position={[-3, 4, 2]}
          intensity={1.2}
          color="#f0f0ff"
        />
        
        {/* Back rim light for depth */}
        <directionalLight
          position={[0, 2, -5]}
          intensity={0.8}
          color="#e0e0ff"
        />
        
        {/* Accent lights for color and vibrancy */}
        <pointLight position={[-4, 3, -2]} intensity={0.6} color="#a78bfa" />
        <pointLight position={[4, -2, 3]} intensity={0.5} color="#60a5fa" />
        <pointLight position={[0, 6, 0]} intensity={0.4} color="#ffffff" />
        
        {/* Spotlight for focus */}
        <spotLight
          position={[0, 10, 3]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <HeroModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
