"use client";

import { motion } from 'framer-motion';

export default function BackgroundParticles() {
  // Reduced number of particles and made them more subtle
  const particles = Array.from({ length: 30 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-sm"
      style={{
        width: `${Math.random() * 8 + 4}px`,
        height: `${Math.random() * 8 + 4}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, Math.random() * 150 - 75, 0],
        x: [0, Math.random() * 150 - 75, 0],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: Math.random() * 25 + 15,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  ));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black" />
      {particles}
    </div>
  );
} 