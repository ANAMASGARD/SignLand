'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GlassButtonProps {
  children: React.ReactNode;
  href: string;
  size?: 'sm' | 'lg';
}

export function GlassButton({ children, href, size = 'lg' }: GlassButtonProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const sizeClasses = size === 'lg' ? 'px-8 py-3.5 text-base' : 'px-5 py-2 text-sm';

  return (
    <Link href={href}>
      <motion.div
        className={`${sizeClasses} rounded-full font-medium relative overflow-hidden cursor-pointer`}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          color: '#1e293b',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Iridescent base overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(236, 72, 153, 0.2) 100%)',
            opacity: 0.7,
          }}
        />

        {/* Spotlight effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4), transparent 80%)`,
            opacity: isHovered ? 1 : 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
            transform: 'translateX(-100%)',
          }}
          animate={isHovered ? { x: ['0%', '200%'] } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Button text */}
        <span className="relative z-10 block text-center" style={{ fontFamily: 'var(--font-sf)' }}>
          {children}
        </span>
      </motion.div>
    </Link>
  );
}
