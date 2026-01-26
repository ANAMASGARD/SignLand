'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function HeroModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/Robot-Dex.glb');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  useFrame((state) => {
    if (!groupRef.current || prefersReducedMotion) return;

    // Gentle floating motion only (no auto-rotation since user controls it)
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;

    // Micro breathing scale
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.01;
    groupRef.current.scale.setScalar(breathe * 1.6);
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <primitive object={scene} scale={1.6} />
    </group>
  );
}

useGLTF.preload('/Robot-Dex.glb');
