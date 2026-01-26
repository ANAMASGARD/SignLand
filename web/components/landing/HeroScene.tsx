'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { HeroModel } from './HeroModel';
import { Suspense } from 'react';

export function HeroScene() {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas frameloop="always" dpr={[1, 2]}>
        {/* Camera positioned to see the full robot */}
        <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={50} />

        {/* OrbitControls for user interaction - works with mouse & touch */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          rotateSpeed={0.5}
        // Touch support is enabled by default
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[5, 8, 5]}
          angle={0.3}
          penumbra={1}
          intensity={0.8}
          castShadow
          color="#ffffff"
        />
        <pointLight position={[-5, 5, -3]} intensity={0.3} color="#a78bfa" />
        <pointLight position={[5, -3, 3]} intensity={0.2} color="#60a5fa" />

        <Suspense fallback={null}>
          <HeroModel />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
