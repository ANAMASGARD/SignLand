'use client';

import { motion } from 'framer-motion';

const features = [
  { icon: '⚡', label: 'Instant Response' },
  { icon: '🔒', label: 'Privacy First' },
  { icon: '🌐', label: 'Works Offline' },
  { icon: '🎯', label: 'Multi‑Language' },
];

export function FeaturePills() {
  return (
    <div className="space-y-5">
      {features.map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.4 + i * 0.1,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="flex items-center gap-4"
        >
          <div 
            className="flex items-center justify-center w-10 h-10 rounded-full text-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
            }}
          >
            {feature.icon}
          </div>
          <p className="font-light text-white text-[18px]">{feature.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
