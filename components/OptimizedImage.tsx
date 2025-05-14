"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  priority?: boolean;
  objectFit?: 'cover' | 'contain';
}

const OptimizedImage = ({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  priority = false,
  objectFit = 'cover'
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`}>
      {!error ? (
        <>
          {/* Loading skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          )}
          
          {/* Actual image */}
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={`object-${objectFit} transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={handleError}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </>
      ) : (
        // Error fallback
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <span className="text-sm text-gray-400">Failed to load image</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 