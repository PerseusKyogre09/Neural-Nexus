"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ModelMetadata {
  title: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
}

interface UploadFormProps {
  onSuccess?: () => void;
}

const categories = [
  'Natural Language Processing',
  'Computer Vision',
  'Audio Processing',
  'Reinforcement Learning',
  'Generative AI',
  'Other'
];

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState<ModelMetadata>({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Add file validation here
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Implement actual upload logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated upload
      console.log('Uploading:', { file: selectedFile, metadata });
      // Reset form after successful upload
      setSelectedFile(null);
      setMetadata({
        title: '',
        description: '',
        price: '',
        category: '',
        tags: []
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center ${
          dragActive ? 'border-pink-500 bg-pink-500/10' : 'border-gray-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept=".h5,.onnx,.pt,.pth,.pb"
          aria-label="Upload AI Model"
        />
        
        {selectedFile ? (
          <div className="space-y-2">
            <p className="text-lg">📁 {selectedFile.name}</p>
            <Button
              onClick={() => setSelectedFile(null)}
              variant="outline"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg">Drop your AI model here or</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/10 hover:bg-white/20"
            >
              Browse Files
            </Button>
            <p className="text-sm text-gray-400">
              Supported formats: .h5, .onnx, .pt, .pth, .pb
            </p>
          </div>
        )}
      </div>

      {/* Metadata Fields */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Model Title"
          value={metadata.title}
          onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
          required
        />
        
        <textarea
          placeholder="Model Description"
          value={metadata.description}
          onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none min-h-[100px]"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Price (USD)"
            value={metadata.price}
            onChange={(e) => setMetadata({ ...metadata, price: e.target.value })}
            className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            required
          />
          
          <select
            value={metadata.category}
            onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
            className="p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            required
            aria-label="Model Category"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={metadata.tags.join(', ')}
          onChange={(e) => setMetadata({
            ...metadata,
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
          })}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        variant="default"
        disabled={!selectedFile || uploading}
        className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
      >
        {uploading ? (
          <div className="flex items-center">
            <span className="animate-spin mr-2">⚡</span>
            Uploading...
          </div>
        ) : (
          'Upload Model'
        )}
      </Button>
    </form>
  );
} 