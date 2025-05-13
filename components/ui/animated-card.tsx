"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'dark';
  hoverEffect?: 'none' | 'scale' | 'lift' | 'glow';
  onClick?: () => void;
  isLoading?: boolean;
}

export function AnimatedCard({
  children,
  className,
  variant = 'default',
  hoverEffect = 'scale',
  onClick,
  isLoading = false,
}: AnimatedCardProps) {
  // Base styles
  const baseStyle = "relative overflow-hidden rounded-xl transition-all duration-300";
  
  // Variant styles
  const variantStyles = {
    default: "bg-white/5 backdrop-blur-sm border border-white/10",
    gradient: "bg-gradient-to-br from-purple-900/30 via-black/30 to-blue-900/30 backdrop-blur-sm border border-white/10",
    glass: "bg-white/10 backdrop-blur-md border border-white/20",
    dark: "bg-black/50 backdrop-blur-sm border border-gray-800",
  };
  
  // Hover effect animations
  const getHoverAnimations = () => {
    switch (hoverEffect) {
      case 'none':
        return {};
      case 'scale':
        return { scale: 1.02 };
      case 'lift':
        return { y: -8 };
      case 'glow':
        return { boxShadow: "0 0 15px 2px rgba(168, 85, 247, 0.4)" };
      default:
        return { scale: 1.02 };
    }
  };
  
  return (
    <motion.div
      className={cn(
        baseStyle,
        variantStyles[variant],
        isLoading ? "animate-pulse" : "",
        onClick ? "cursor-pointer" : "",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={!isLoading ? getHoverAnimations() : {}}
      onClick={!isLoading ? onClick : undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient border effect */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Gradient glow effect for certain variants */}
      {(variant === 'gradient' || hoverEffect === 'glow') && (
        <motion.div
          className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-xl opacity-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content */}
      <div className={`relative z-10 ${isLoading ? 'opacity-50' : ''}`}>
        {children}
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20">
          <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-white animate-spin" />
        </div>
      )}
    </motion.div>
  );
} 