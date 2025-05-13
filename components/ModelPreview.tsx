"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ModelPreviewProps {
  modelId: string;
  title: string;
  description: string;
  previewImages: string[];
  previewTexts?: string[];
  onClose: () => void;
}

export default function ModelPreview({ 
  modelId, 
  title, 
  description, 
  previewImages, 
  previewTexts = [],
  onClose 
}: ModelPreviewProps) {
  const [activeTab, setActiveTab] = useState<'images' | 'demo'>('images');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [demoText, setDemoText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate AI model generation
  const handleGenerate = () => {
    setIsGenerating(true);
    setDemoText('');
    
    // Simulate text generation with a typing effect
    const fullText = previewTexts[Math.floor(Math.random() * previewTexts.length)] || 
      "This is a demo of the AI model capabilities. The actual outputs may vary depending on your inputs and use case.";
    
    let index = 0;
    const typingInterval = setInterval(() => {
      setDemoText(prev => prev + fullText.charAt(index));
      index++;
      
      if (index >= fullText.length) {
        clearInterval(typingInterval);
        setIsGenerating(false);
      }
    }, 20);
  };

  const handleImageError = () => {
    setLoadError(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-gray-400 mt-1">{description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            {['images', 'demo'].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab as 'images' | 'demo')}
                className={`${
                  activeTab === tab
                    ? 'bg-pink-500 hover:bg-pink-600'
                    : 'bg-white/5 hover:bg-white/10'
                } px-4 py-2 rounded-lg`}
              >
                {tab === 'images' ? '📸 Preview Images' : '🤖 Interactive Demo'}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'images' ? (
              <motion.div
                key="images"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {previewImages.length > 0 ? (
                  <div className="relative aspect-video bg-black/30 rounded-lg overflow-hidden">
                    {!loadError ? (
                      <img
                        src={previewImages[currentImageIndex]}
                        alt={`Preview ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>Preview image unavailable</span>
                      </div>
                    )}
                    
                    {/* Image navigation */}
                    {previewImages.length > 1 && (
                      <div className="absolute inset-x-0 bottom-0 flex justify-between p-2">
                        <Button onClick={handlePrevImage} className="bg-black/50 hover:bg-black/70 p-1 rounded-full">
                          ◀
                        </Button>
                        <span className="bg-black/50 px-2 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {previewImages.length}
                        </span>
                        <Button onClick={handleNextImage} className="bg-black/50 hover:bg-black/70 p-1 rounded-full">
                          ▶
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No preview images available</span>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="demo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-400 mb-4">Test the model's capabilities with this interactive demo</p>
                  
                  <div className="min-h-[200px] bg-gray-900/50 rounded p-4 mb-4">
                    {demoText ? (
                      <p className="whitespace-pre-wrap">{demoText}</p>
                    ) : (
                      <p className="text-gray-500">Output will appear here</p>
                    )}
                    {isGenerating && (
                      <span className="inline-block animate-pulse ml-1">▌</span>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleGenerate}
                    className="bg-pink-500 hover:bg-pink-600 w-full"
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Run Demo'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/5 hover:bg-white/10"
          >
            Close Preview
          </Button>
          <Button className="bg-pink-500 hover:bg-pink-600">
            Purchase Model
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
} 