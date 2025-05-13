"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo';

interface BrandProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Brand = ({ size = 'md', className = "" }: BrandProps) => {
  const sizes = {
    sm: {
      logo: 24,
      text: 'text-lg'
    },
    md: {
      logo: 32,
      text: 'text-xl'
    },
    lg: {
      logo: 48,
      text: 'text-3xl'
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0,
      x: -20 
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial="hidden"
      animate="visible"
    >
      <AnimatedLogo width={sizes[size].logo} height={sizes[size].logo} />
      <motion.span 
        className={`font-bold ${sizes[size].text} bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text`}
        variants={textVariants}
      >
        Neural Nexus
      </motion.span>
    </motion.div>
  );
};

export default Brand; 