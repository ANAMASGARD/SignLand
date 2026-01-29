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

    const time = state.clock.elapsedTime;

    // Smooth floating up and down motion (reduced amplitude to stay in bounds)
    const floatY = Math.sin(time * 0.8) * 0.08;
    groupRef.current.position.y = floatY;

    // Subtle side-to-side sway
    const swayX = Math.sin(time * 0.5) * 0.02;
    groupRef.current.position.x = swayX;

    // Gentle tilt/rotation for more life
    groupRef.current.rotation.z = Math.sin(time * 0.6) * 0.015;
    groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.01;

    // Breathing scale effect
    const breathe = 1 + Math.sin(time * 0.7) * 0.01;
    groupRef.current.scale.setScalar(breathe * 1.4);
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <primitive object={scene} scale={1.4} />
    </group>
  );
}

useGLTF.preload('/Robot-Dex.glb');
