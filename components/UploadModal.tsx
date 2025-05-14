"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import { X, Upload, FileText } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleUpload = () => {
    if (!fileName) return;
    
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Upload Your AI Model
          </h2>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close upload modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-black/30 border border-white/10 rounded-lg"
                  placeholder="Enter model name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  className="w-full p-3 bg-black/30 border border-white/10 rounded-lg"
                  rows={3}
                  placeholder="Describe your model"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-black/30 border border-white/10 rounded-lg"
                  placeholder="e.g. image, generative, gan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Price (USD)</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-black/30 border border-white/10 rounded-lg"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* File Upload */}
            <div className="mt-6 p-8 border border-dashed border-white/20 rounded-lg text-center">
              <div className="mb-4">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">Upload Model Files</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Drag and drop your model files or click to browse
                </p>
              </div>
              
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <label htmlFor="file-upload">
                <AnimatedButton
                  variant="outline"
                  size="md"
                  className="mx-auto"
                >
                  <FileText className="mr-2 h-4 w-4" /> Select Files
                </AnimatedButton>
              </label>
              
              {fileName && (
                <div className="mt-4 text-sm">
                  <span className="text-green-400">{fileName}</span> selected
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <AnimatedButton
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </AnimatedButton>
              
              <AnimatedButton
                variant="primary"
                isLoading={uploading}
                onClick={handleUpload}
                disabled={!fileName || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Model'}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 