"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const AnimatedLogo = ({ width = 40, height = 40, className = "" }: AnimatedLogoProps) => {
  // Animation variants for different elements
  const hexagonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: 0.5 + (i * 0.1),
        duration: 0.8,
        ease: "easeInOut"
      }
    })
  };

  const diamondVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1 + (i * 0.1),
        duration: 0.3,
        ease: "backOut"
      }
    })
  };

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      className={className}
      initial="hidden"
      animate="visible"
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="hexagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00ffff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#0099ff" />
        </linearGradient>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0099ff" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Hexagon border */}
      <motion.path
        d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
        fill="none"
        stroke="url(#hexagonGradient)"
        strokeWidth="2"
        variants={hexagonVariants}
      />

      {/* Brain network nodes */}
      {[
        [35, 35], [65, 35], [50, 45],
        [30, 55], [70, 55], [40, 65],
        [60, 65], [50, 70]
      ].map(([cx, cy], i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="3"
          fill="url(#nodeGradient)"
          custom={i}
          variants={nodeVariants}
        />
      ))}

      {/* Network connections */}
      {[
        "M35 35 L50 45", "M65 35 L50 45",
        "M30 55 L40 65", "M70 55 L60 65",
        "M40 65 L50 70", "M60 65 L50 70",
        "M50 45 L30 55", "M50 45 L70 55"
      ].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="url(#connectionGradient)"
          strokeWidth="1"
          fill="none"
          custom={i}
          variants={pathVariants}
        />
      ))}

      {/* Diamond accents */}
      {[
        [10, 50], [90, 50]
      ].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x-3} ${y} L${x} ${y-3} L${x+3} ${y} L${x} ${y+3} Z`}
          fill="#00ffff"
          opacity="0.8"
          custom={i}
          variants={diamondVariants}
        />
      ))}
    </motion.svg>
  );
};

export default AnimatedLogo; 