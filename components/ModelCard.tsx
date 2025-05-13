"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from './ui/animated-card';
import { AnimatedButton } from './ui/animated-button';
import React from 'react';

interface ModelCardProps {
  id: string;
  name: string;
  description: string;
  author: string;
  price: number;
  currency?: string;
  cryptoPrice?: {
    amount: number;
    currency: string;
  };
  isNFTBacked?: boolean;
  ipfsHash?: string;
  rating?: number;
  downloads?: number;
  imageUrl?: string;
  tags?: string[];
  onView?: (id: string) => void;
  onPurchase?: (id: string) => void;
}

export function ModelCard({
  id,
  name,
  description,
  author,
  price,
  currency = "USD",
  cryptoPrice,
  isNFTBacked = false,
  ipfsHash,
  rating = 0,
  downloads = 0,
  imageUrl = "/placeholder-model.jpg",
  tags = [],
  onView,
  onPurchase
}: ModelCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format numbers for better display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Handle purchase button click
  const handlePurchaseClick = () => {
    onPurchase && onPurchase(id);
  };

  return (
    <div 
      className="h-full" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedCard 
        variant="glass"
        hoverEffect="lift"
        className="overflow-hidden h-full"
        onClick={() => onView && onView(id)}
      >
        <div className="relative">
          {/* Model Image with Gradient Overlay */}
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: isHovered ? 0.8 : 0.6 }}
            />
            
            <motion.img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Tags */}
            <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1">
              {isNFTBacked && (
                <motion.span
                  className="bg-purple-600/80 text-xs px-2 py-1 rounded-full text-white font-medium flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="mr-1">🔮</span> NFT-Backed
                </motion.span>
              )}
              {ipfsHash && (
                <motion.span
                  className="bg-blue-600/80 text-xs px-2 py-1 rounded-full text-white font-medium flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="mr-1">📦</span> IPFS
                </motion.span>
              )}
              {tags.slice(0, 3).map((tag, i) => (
                <motion.span
                  key={i}
                  className="bg-purple-600/80 text-xs px-2 py-1 rounded-full text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {tag}
                </motion.span>
              ))}
              {tags.length > 3 && (
                <motion.span
                  className="bg-gray-700/80 text-xs px-2 py-1 rounded-full text-white"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  +{tags.length - 3}
                </motion.span>
              )}
            </div>
          </div>
          
          <div className="p-4">
            {/* Rating & Downloads */}
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">↓</span>
                <span>{formatNumber(downloads)}</span>
              </div>
            </div>
            
            {/* Model Name */}
            <h3 className="text-xl font-bold text-white mb-1 truncate">{name}</h3>
            
            {/* Author */}
            <p className="text-sm text-gray-400 mb-2">by {author}</p>
            
            {/* Description */}
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
            
            {/* Price & Purchase Button */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">
                  {price > 0 ? `$${price}` : 'Free'}
                </div>
                {cryptoPrice && (
                  <div className="text-xs text-purple-400">
                    {cryptoPrice.amount} {cryptoPrice.currency}
                  </div>
                )}
              </div>
              
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={handlePurchaseClick}
              >
                {price > 0 ? 'Purchase' : 'Download'}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
} 