"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface QuoteDisplayProps {
  className?: string;
  variant?: 'default' | 'gradient' | 'subtle';
}

const QuoteDisplay = ({ className = '', variant = 'default' }: QuoteDisplayProps) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Collection of Gen Z inspired quotes that are still understandable by elderly
  const quotes = [
    {
      text: "AI isn't just the future - it's the vibe check we all need right now.",
      author: "Neural Nexus Team"
    },
    {
      text: "Don't just scroll through life. Build something that makes a difference.",
      author: "Tech Creator"
    },
    {
      text: "Your AI model could be the GOAT someone's been waiting for.",
      author: "Developer Community"
    },
    {
      text: "Share your brilliance. The world is literally your group chat.",
      author: "Model Creator"
    },
    {
      text: "Innovation hits different when you're part of something bigger.",
      author: "AI Researcher"
    },
    {
      text: "We're not just building AI. We're building a whole mood for the future.",
      author: "Neural Nexus Founder"
    },
    {
      text: "Knowledge shared is knowledge squared. That's just straight facts.",
      author: "Data Scientist"
    },
    {
      text: "Your grandkids will ask what you built during the AI revolution. Make it fire.",
      author: "Future Historian"
    },
    {
      text: "The best AI models are like the best playlists - carefully curated and shared with friends.",
      author: "Creative Engineer"
    },
    {
      text: "Real talk: today's side project could be tomorrow's game-changer.",
      author: "Entrepreneur"
    }
  ];
  
  useEffect(() => {
    // Change quote every 8 seconds
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, [quotes.length]);
  
  const currentQuote = quotes[currentQuoteIndex];
  
  // Different styling based on variant
  const getContainerClasses = () => {
    switch(variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/30';
      case 'subtle':
        return 'bg-gray-900/30 border border-gray-800/50';
      default:
        return 'bg-gray-800/50 border border-gray-700';
    }
  };
  
  return (
    <div className={`p-6 rounded-lg ${getContainerClasses()} relative overflow-hidden ${className}`}>
      <div className="absolute top-3 left-3 text-purple-500/30">
        <Quote className="h-8 w-8" />
      </div>
      
      <div className="pl-6">
        <motion.div
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="min-h-[60px] flex flex-col justify-center"
        >
          <p className="text-lg font-medium mb-2 text-gray-200 italic">"{currentQuote.text}"</p>
          <p className="text-sm text-gray-400">— {currentQuote.author}</p>
        </motion.div>
      </div>
      
      <div className="mt-4 flex">
        {quotes.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full mx-1 transition-all duration-300 ${
              index === currentQuoteIndex ? 'bg-purple-500 w-6' : 'bg-gray-600 w-3'
            }`}
            onClick={() => setCurrentQuoteIndex(index)}
            aria-label={`View quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuoteDisplay; 