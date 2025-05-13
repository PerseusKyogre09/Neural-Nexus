"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Download, 
  Share2,
  User,
  Search,
  Filter,
  Crown,
  Trophy,
  Fire,
  Star,
  Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CommunityPage() {
  // Super lit state variables with Gen-Z names
  const [searchVibe, setSearchVibe] = useState('');
  const [activeFilter, setActiveFilter] = useState('trending');
  const [activeCat, setActiveCat] = useState('all');
  
  // Model categories with emojis because Gen-Z loves emojis
  const modelCategories = [
    { id: 'all', name: 'All Models', emoji: '🌟' },
    { id: 'text', name: 'Text Generation', emoji: '📝' },
    { id: 'image', name: 'Image Generation', emoji: '🖼️' },
    { id: 'audio', name: 'Audio Generation', emoji: '🎵' },
    { id: 'video', name: 'Video Generation', emoji: '🎬' },
    { id: 'embed', name: 'Embeddings', emoji: '🧠' },
    { id: 'classify', name: 'Classification', emoji: '🏷️' }
  ];
  
  // Mock data for the models
  const litModels = [
    {
      id: 1,
      name: "MemeGPT",
      category: "text",
      creator: "meme_lord",
      creatorAvatar: "/avatars/user1.png",
      description: "A model fine-tuned for generating viral meme captions and content. It understands current internet humor and trends.",
      thumbnail: "/models/model1.png",
      likes: 3452,
      comments: 87,
      downloads: 982,
      verified: true,
      trending: true,
      featured: false,
      date: "2023-12-15"
    },
    {
      id: 2,
      name: "DreamScape AI",
      category: "image",
      creator: "digital_artist",
      creatorAvatar: "/avatars/user2.png",
      description: "Generate surrealistic dreamscape images with vibrant colors and fantastic elements based on text prompts.",
      thumbnail: "/models/model2.png",
      likes: 8721,
      comments: 231,
      downloads: 3820,
      verified: true,
      trending: true,
      featured: true,
      date: "2023-11-28"
    },
    {
      id: 3,
      name: "BeatSynth",
      category: "audio",
      creator: "audio_wizard",
      creatorAvatar: "/avatars/user3.png",
      description: "Create original music beats and loops with a focus on hip-hop and electronic genres.",
      thumbnail: "/models/model3.png",
      likes: 1521,
      comments: 43,
      downloads: 687,
      verified: false,
      trending: false,
      featured: false,
      date: "2024-01-10"
    },
    {
      id: 4,
      name: "ConvoClassifier",
      category: "classify",
      creator: "data_guru",
      creatorAvatar: "/avatars/user4.png",
      description: "Classify conversation tones and detect emotions in text with high accuracy.",
      thumbnail: "/models/model4.png",
      likes: 976,
      comments: 32,
      downloads: 412,
      verified: true,
      trending: false,
      featured: false,
      date: "2023-12-05"
    },
    {
      id: 5,
      name: "VideoVibes",
      category: "video",
      creator: "motion_master",
      creatorAvatar: "/avatars/user5.png",
      description: "Transform still images into short animated clips with custom styles and motion patterns.",
      thumbnail: "/models/model5.png",
      likes: 4327,
      comments: 128,
      downloads: 1531,
      verified: true,
      trending: true,
      featured: true,
      date: "2024-02-01"
    },
    {
      id: 6,
      name: "CodeCraft",
      category: "text",
      creator: "dev_ninja",
      creatorAvatar: "/avatars/user6.png",
      description: "Generate clean, efficient code in multiple programming languages from natural language descriptions.",
      thumbnail: "/models/model6.png",
      likes: 2845,
      comments: 94,
      downloads: 1762,
      verified: true,
      trending: false,
      featured: true,
      date: "2023-10-20"
    },
    {
      id: 7,
      name: "SentimentSense",
      category: "classify",
      creator: "nlp_expert",
      creatorAvatar: "/avatars/user7.png",
      description: "Advanced sentiment analysis model that detects subtle emotions and intentions in text.",
      thumbnail: "/models/model7.png",
      likes: 789,
      comments: 25,
      downloads: 392,
      verified: false,
      trending: false,
      featured: false,
      date: "2024-01-15"
    },
    {
      id: 8,
      name: "VectorVibes",
      category: "embed",
      creator: "data_scientist",
      creatorAvatar: "/avatars/user8.png",
      description: "Generate high-quality text embeddings optimized for semantic search and clustering.",
      thumbnail: "/models/model8.png",
      likes: 452,
      comments: 18,
      downloads: 213,
      verified: true,
      trending: false,
      featured: false,
      date: "2024-02-10"
    }
  ];
  
  // Filter and sort models based on active filters and search
  const getFilteredModels = () => {
    let filteredSquad = litModels;
    
    // Category filter
    if (activeCat !== 'all') {
      filteredSquad = filteredSquad.filter(model => model.category === activeCat);
    }
    
    // Search filter
    if (searchVibe) {
      const searchLower = searchVibe.toLowerCase();
      filteredSquad = filteredSquad.filter(model => 
        model.name.toLowerCase().includes(searchLower) || 
        model.description.toLowerCase().includes(searchLower) ||
        model.creator.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort based on active filter
    switch (activeFilter) {
      case 'trending':
        return filteredSquad.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
      case 'popular':
        return filteredSquad.sort((a, b) => b.likes - a.likes);
      case 'newest':
        return filteredSquad.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'downloads':
        return filteredSquad.sort((a, b) => b.downloads - a.downloads);
      default:
        return filteredSquad;
    }
  };
  
  const filteredModels = getFilteredModels();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Community Showcase
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Discover, download, and get inspired by models created by the Neural Nexus community
          </motion.p>
        </div>
      </section>

      {/* Featured model showcase */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700/30">
            <div className="absolute inset-0 bg-[url('/featured-bg.jpg')] opacity-10 bg-cover bg-center"></div>
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 relative z-10">
              <div className="md:w-1/2">
                <div className="aspect-video overflow-hidden rounded-xl bg-black/50 mb-4 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg text-gray-400">Image Placeholder</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium">digital_artist</div>
                    <div className="text-sm text-gray-400">Featured Creator</div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="inline-flex items-center bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  <Crown className="h-4 w-4 mr-1" />
                  Featured Model
                </div>
                <h2 className="text-3xl font-bold mb-3">DreamScape AI</h2>
                <p className="text-gray-300 mb-6">
                  Generate surrealistic dreamscape images with vibrant colors and fantastic elements based on text prompts. 
                  Fine-tuned on thousands of high-quality artwork examples.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center bg-gray-800/80 rounded-full px-3 py-1 text-sm">
                    <Heart className="h-4 w-4 text-pink-400 mr-1" />
                    <span>8.7K</span>
                  </div>
                  <div className="flex items-center bg-gray-800/80 rounded-full px-3 py-1 text-sm">
                    <Download className="h-4 w-4 text-blue-400 mr-1" />
                    <span>3.8K</span>
                  </div>
                  <div className="flex items-center bg-gray-800/80 rounded-full px-3 py-1 text-sm">
                    <MessageCircle className="h-4 w-4 text-green-400 mr-1" />
                    <span>231</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/models/dreamscape" 
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search and filters */}
      <section className="pb-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative max-w-md w-full">
              <input 
                type="text" 
                placeholder="Search models..." 
                className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={searchVibe}
                onChange={(e) => setSearchVibe(e.target.value)}
                aria-label="Search models"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <FilterButton 
                active={activeFilter === 'trending'} 
                onClick={() => setActiveFilter('trending')}
                icon={<Fire size={16} />}
                label="Trending"
              />
              <FilterButton 
                active={activeFilter === 'popular'} 
                onClick={() => setActiveFilter('popular')}
                icon={<Heart size={16} />}
                label="Popular"
              />
              <FilterButton 
                active={activeFilter === 'newest'} 
                onClick={() => setActiveFilter('newest')}
                icon={<Clock size={16} />}
                label="Newest"
              />
              <FilterButton 
                active={activeFilter === 'downloads'} 
                onClick={() => setActiveFilter('downloads')}
                icon={<Download size={16} />}
                label="Most Downloaded"
              />
              <button 
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Additional filters"
              >
                <Filter size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-8 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 min-w-max py-1">
              {modelCategories.map(category => (
                <button 
                  key={category.id}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    activeCat === category.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveCat(category.id)}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Models grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          {filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModels.map(model => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold mb-2">No models found</h3>
              <p className="text-gray-400">Try changing your search or filters</p>
            </div>
          )}
          
          {/* Load more button */}
          {filteredModels.length > 0 && (
            <div className="mt-12 text-center">
              <button className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                Load More Models
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FilterButton({ active, onClick, icon, label }: { 
  active: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button 
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-purple-600 text-white' 
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ModelCard({ model }: { model: any }) {
  return (
    <motion.div 
      className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-md hover:shadow-purple-500/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="aspect-video bg-gray-900 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-600">Image Placeholder</span>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {model.trending && (
            <div className="bg-orange-500/90 text-white text-xs px-2 py-1 rounded-md flex items-center">
              <Fire size={12} className="mr-1" />
              Trending
            </div>
          )}
          {model.verified && (
            <div className="bg-blue-500/90 text-white text-xs px-2 py-1 rounded-md flex items-center">
              <Star size={12} className="mr-1" />
              Verified
            </div>
          )}
        </div>
        
        {/* Model category */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-gray-800/90 text-gray-300 text-xs px-2 py-1 rounded-md">
            {model.category === 'text' && '📝 Text'}
            {model.category === 'image' && '🖼️ Image'}
            {model.category === 'audio' && '🎵 Audio'}
            {model.category === 'video' && '🎬 Video'}
            {model.category === 'embed' && '🧠 Embed'}
            {model.category === 'classify' && '🏷️ Classify'}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/models/${model.id}`}>
          <h3 className="text-lg font-bold hover:text-purple-400 transition-colors">{model.name}</h3>
        </Link>
        
        <div className="flex items-center mt-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-gray-700 mr-2 flex items-center justify-center overflow-hidden">
            <User className="h-3 w-3 text-gray-400" />
          </div>
          <span className="text-sm text-gray-400">{model.creator}</span>
          
          {model.verified && (
            <div className="ml-2 bg-blue-500/20 rounded-full p-0.5">
              <Trophy size={12} className="text-blue-400" />
            </div>
          )}
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{model.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <div className="flex items-center text-sm text-gray-400">
              <Heart size={14} className="mr-1" />
              <span>{model.likes > 999 ? `${(model.likes / 1000).toFixed(1)}K` : model.likes}</span>
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Download size={14} className="mr-1" />
              <span>{model.downloads > 999 ? `${(model.downloads / 1000).toFixed(1)}K` : model.downloads}</span>
            </div>
          </div>
          
          <button 
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Share model"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 