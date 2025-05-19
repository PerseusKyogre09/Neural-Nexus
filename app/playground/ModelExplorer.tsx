"use client";

import React, { useState } from 'react';
import { X, Search, ChevronDown, ChevronRight, Star, CloudLightning, Zap, Download, ExternalLink, Info, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModelExplorerProps {
  theme: string;
  onClose: () => void;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  tags: string[];
  parameters?: string;
  stars: number;
  size?: string;
  architecture?: string;
  isInstalled?: boolean;
  isFavorite?: boolean;
}

export default function ModelExplorer({ theme, onClose }: ModelExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [installingModelId, setInstallingModelId] = useState<string | null>(null);
  const [favoriteModels, setFavoriteModels] = useState<string[]>([]);
  
  // Demo models
  const models: AIModel[] = [
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      provider: 'DeepSeek',
      description: 'Powerful code generation and completion model trained on code repositories and documentation.',
      tags: ['coding', 'completion', 'assistant'],
      parameters: '15B',
      stars: 4520,
      size: '32GB',
      architecture: 'Transformer',
      isInstalled: true
    },
    {
      id: 'mistral-7b',
      name: 'Mistral 7B',
      provider: 'Mistral AI',
      description: 'Efficient and powerful language model for general-purpose tasks with strong reasoning capabilities.',
      tags: ['general', 'reasoning', 'efficient'],
      parameters: '7B',
      stars: 3854,
      size: '14GB',
      architecture: 'Transformer',
      isInstalled: true
    },
    {
      id: 'llama3-70b',
      name: 'Llama 3 70B',
      provider: 'Meta',
      description: 'State-of-the-art open-source LLM with exceptional performance across various tasks.',
      tags: ['general', 'reasoning', 'creative'],
      parameters: '70B',
      stars: 15320,
      size: '140GB',
      architecture: 'Transformer',
      isInstalled: false
    },
    {
      id: 'codellama-34b',
      name: 'CodeLlama 34B',
      provider: 'Meta',
      description: 'Specialized code generation model with built-in support for multiple programming languages.',
      tags: ['coding', 'completion', 'expert'],
      parameters: '34B',
      stars: 8250,
      size: '68GB',
      architecture: 'Transformer',
      isInstalled: false
    },
    {
      id: 'phi-3-mini',
      name: 'Phi-3 Mini',
      provider: 'Microsoft',
      description: 'Small but powerful model optimized for efficiency with surprisingly strong capabilities.',
      tags: ['small', 'efficient', 'general'],
      parameters: '3.8B',
      stars: 6150,
      size: '8GB',
      architecture: 'Transformer',
      isInstalled: false
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'High-performance model with advanced reasoning and multimodal capabilities.',
      tags: ['multimodal', 'vision', 'reasoning'],
      parameters: '175B',
      stars: 12340,
      size: '350GB',
      architecture: 'Transformer',
      isInstalled: false
    },
  ];
  
  // Filter models
  const filteredModels = models.filter(model => {
    // Text search
    const matchesSearch = !searchQuery || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = !selectedCategory ||
      (selectedCategory === 'installed' && model.isInstalled) ||
      (selectedCategory === 'favorites' && favoriteModels.includes(model.id)) ||
      (selectedCategory === 'coding' && model.tags.includes('coding'));
    
    return matchesSearch && matchesCategory;
  });
  
  // Toggle expanded model
  const toggleExpand = (id: string) => {
    setExpandedModel(expandedModel === id ? null : id);
  };
  
  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setFavoriteModels(prev => 
      prev.includes(id) 
        ? prev.filter(modelId => modelId !== id) 
        : [...prev, id]
    );
  };
  
  // Install/download model
  const installModel = (id: string) => {
    setInstallingModelId(id);
    
    // Simulate installation
    setTimeout(() => {
      setInstallingModelId(null);
      
      // Update model to be installed
      const updatedModels = models.map(model => 
        model.id === id ? { ...model, isInstalled: true } : model
      );
      
      // In a real app, this would persist the changes
      console.log('Model installed:', id);
    }, 2000);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <div className="flex items-center">
          <CloudLightning className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-base font-semibold">AI Models</h2>
        </div>
        
        <button
          onClick={onClose}
          className={cn(
            "p-1 rounded-full",
            theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
          )}
          aria-label="Close AI Models"
          title="Close AI Models"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="p-3 border-b space-y-3">
        <div className={cn(
          "flex items-center px-3 py-2 rounded-md",
          theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#f0f0f0]'
        )}>
          <Search className="h-4 w-4 mr-2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models..."
            className={cn(
              "bg-transparent flex-1 focus:outline-none text-sm",
              theme === 'dark' ? 'placeholder-gray-500' : 'placeholder-gray-400'
            )}
            aria-label="Search models"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'installed' ? null : 'installed')}
            className={cn(
              "px-2 py-1 rounded text-xs flex items-center",
              selectedCategory === 'installed'
                ? theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
            )}
          >
            <Download className="h-3 w-3 mr-1" />
            Installed
          </button>
          
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'favorites' ? null : 'favorites')}
            className={cn(
              "px-2 py-1 rounded text-xs flex items-center",
              selectedCategory === 'favorites'
                ? theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
            )}
          >
            <Star className="h-3 w-3 mr-1" />
            Favorites
          </button>
          
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'coding' ? null : 'coding')}
            className={cn(
              "px-2 py-1 rounded text-xs flex items-center",
              selectedCategory === 'coding'
                ? theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                : theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
            )}
          >
            <Zap className="h-3 w-3 mr-1" />
            Coding
          </button>
        </div>
      </div>
      
      {/* Models list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredModels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No models match your search criteria</p>
          </div>
        ) : (
          filteredModels.map(model => (
            <div
              key={model.id}
              className={cn(
                "border rounded-lg overflow-hidden",
                theme === 'dark' ? 'border-[#3d3d3d] bg-[#252526]' : 'border-[#e0e0e0] bg-white'
              )}
            >
              <div 
                className={cn(
                  "p-3 cursor-pointer flex justify-between items-start",
                  theme === 'dark' ? 'hover:bg-[#2d2d2e]' : 'hover:bg-[#f9f9f9]'
                )}
                onClick={() => toggleExpand(model.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-sm">{model.name}</h3>
                    <span className={cn(
                      "ml-2 px-1.5 py-0.5 text-xs rounded",
                      theme === 'dark' ? 'bg-[#3c3c3c] text-gray-300' : 'bg-[#f0f0f0] text-gray-600'
                    )}>
                      {model.provider}
                    </span>
                    {model.isInstalled && (
                      <span className={cn(
                        "ml-2 px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-100"
                      )}>
                        Installed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{model.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={cn(
                          "px-1.5 py-0.5 rounded-full text-xs",
                          theme === 'dark' ? 'bg-[#3c3c3c] text-gray-300' : 'bg-[#f0f0f0] text-gray-600'
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(model.id);
                    }}
                    className={cn(
                      "p-1 rounded mr-2",
                      theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
                    )}
                    aria-label={favoriteModels.includes(model.id) ? "Remove from favorites" : "Add to favorites"}
                    title={favoriteModels.includes(model.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star 
                      className={cn(
                        "h-4 w-4",
                        favoriteModels.includes(model.id) ? "text-yellow-400 fill-yellow-400" : ""
                      )} 
                    />
                  </button>
                  
                  {!model.isInstalled ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        installModel(model.id);
                      }}
                      disabled={installingModelId === model.id}
                      className={cn(
                        "flex items-center px-2 py-1 rounded text-xs",
                        installingModelId === model.id ? "opacity-70 cursor-wait" : "",
                        theme === 'dark' 
                          ? 'bg-[#0078d4] hover:bg-[#0069ba] text-white' 
                          : 'bg-[#0078d4] hover:bg-[#0069ba] text-white'
                      )}
                      aria-label="Install model"
                      title="Install model"
                    >
                      {installingModelId === model.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Installing...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1" />
                          Install
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center">
                      {expandedModel === model.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {expandedModel === model.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={cn(
                    "border-t p-3",
                    theme === 'dark' ? 'border-[#3d3d3d] bg-[#1e1e1e]' : 'border-[#e0e0e0] bg-[#f5f5f5]'
                  )}
                >
                  <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                    <div>
                      <div className="text-gray-500 mb-1">Parameters</div>
                      <div className="font-medium">{model.parameters}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Size</div>
                      <div className="font-medium">{model.size}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Architecture</div>
                      <div className="font-medium">{model.architecture}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Community Rating</div>
                      <div className="font-medium flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {model.stars.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <button
                      className={cn(
                        "flex items-center px-2 py-1 rounded text-xs",
                        theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
                      )}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Documentation
                    </button>
                    
                    <button
                      className={cn(
                        "flex items-center px-2 py-1 rounded text-xs",
                        theme === 'dark' ? 'bg-[#3c3c3c] hover:bg-[#4c4c4c]' : 'bg-[#e0e0e0] hover:bg-[#d0d0d0]'
                      )}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Provider Website
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 