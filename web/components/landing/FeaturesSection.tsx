'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/ui/motion';

const features = [
  {
    title: 'On-device Vision',
    desc: 'MediaPipe runs locally in your browser for instant gesture recognition with zero latency.',
    icon: '👁️',
  },
  {
    title: 'Instant Voice',
    desc: 'Web Speech API provides natural text-to-speech output without any server calls.',
    icon: '🔊',
  },
  {
    title: 'Smart Mode',
    desc: 'Optional Gemini AI refinement transforms gesture tokens into natural, conversational language.',
    icon: '✨',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light text-gray-900 mb-4">How it works</h2>
          <p className="text-xl text-gray-600">Privacy-first architecture with cutting-edge AI</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
