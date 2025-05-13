"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Brand from './Brand';

const SplashScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 3 }}
      exit={{ opacity: 0 }}
    >
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div 
          className="absolute top-60 -left-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div 
          className="absolute -bottom-40 right-20 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Extra large animated logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] // Custom spring animation
          }}
          className="mb-6"
        >
          <Brand size="lg" />
        </motion.div>

        {/* Tagline with staggered text reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="overflow-hidden">
            <motion.p 
              className="text-xl text-gray-300"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              The Future of AI Model Sharing
            </motion.p>
          </div>
        </motion.div>

        {/* Loading dots */}
        <motion.div 
          className="mt-8 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-cyan-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen; 