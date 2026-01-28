'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  children: React.ReactNode;
}

export function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.05em',
  borderRadius = '100px',
  shimmerDuration = '3s',
  background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative overflow-hidden group',
        'px-8 py-4 rounded-full',
        'font-semibold text-lg text-white',
        'shadow-2xl transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      style={{
        background,
        borderRadius,
      }}
      {...props}
    >
      {/* Shimmer effect */}
      <span
        className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]"
        style={{
          animation: `shimmer ${shimmerDuration} infinite`,
        }}
      >
        <span
          className="relative h-full w-8 bg-white/20"
          style={{
            boxShadow: `0 0 ${shimmerSize} ${shimmerSize} ${shimmerColor}`,
          }}
        />
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: skew(-12deg) translateX(-100%);
          }
          100% {
            transform: skew(-12deg) translateX(100%);
          }
        }
      `}</style>
    </motion.button>
  );
}
