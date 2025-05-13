"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Model {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  features: {
    [key: string]: any;
  };
  rating: number;
}

interface ModelComparisonProps {
  models: Model[];
  onClose: () => void;
}

export default function ModelComparison({ models, onClose }: ModelComparisonProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  // Get all unique feature keys across all models
  const allFeatureKeys = Array.from(
    new Set(
      models.flatMap(model => Object.keys(model.features))
    )
  ).sort();

  // Determine if a value is different across compared models
  const isDifferent = (key: string): boolean => {
    if (!highlightDifferences) return false;
    
    const values = models.map(model => model.features[key]);
    return new Set(values).size > 1;
  };

  const getFeatureValue = (model: Model, key: string) => {
    const value = model.features[key];
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    return value;
  };

  // Rating stars display
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Model Comparison</h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={() => setHighlightDifferences(!highlightDifferences)}
                className="rounded border-gray-500"
              />
              Highlight differences
            </label>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto flex-grow">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left bg-black/30 sticky left-0 z-10">Feature</th>
                {models.map(model => (
                  <th key={model.id} className="p-4 text-center min-w-[200px]">
                    <div className="text-lg font-bold text-pink-400 mb-1">{model.title}</div>
                    <div className="text-xs text-gray-400">{model.category}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Basic info rows */}
              <tr className="border-b border-white/10">
                <td className="p-4 font-medium bg-black/30 sticky left-0">Price</td>
                {models.map(model => (
                  <td key={model.id} className="p-4 text-center">
                    <div className="text-lg font-bold">${model.price}</div>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-4 font-medium bg-black/30 sticky left-0">Rating</td>
                {models.map(model => (
                  <td key={model.id} className="p-4 text-center">
                    {renderRatingStars(model.rating)}
                  </td>
                ))}
              </tr>
              
              {/* Feature rows */}
              {allFeatureKeys.map(key => (
                <tr key={key} className={`border-b border-white/10 ${isDifferent(key) ? 'bg-pink-900/20' : ''}`}>
                  <td className="p-4 font-medium bg-black/30 sticky left-0">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </td>
                  {models.map(model => (
                    <td key={model.id} className="p-4 text-center">
                      <span className={isDifferent(key) ? 'font-bold text-pink-400' : ''}>
                        {getFeatureValue(model, key)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/5 hover:bg-white/10"
          >
            Close Comparison
          </Button>
          <div className="flex gap-2">
            {models.map(model => (
              <Button key={model.id} className="bg-pink-500 hover:bg-pink-600">
                Buy {model.title}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 