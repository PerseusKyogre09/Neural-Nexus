"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ModelCard } from '@/components/ModelCard';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchAndFilter, { FilterOptions } from '@/components/SearchAndFilter';
import {
  Sliders, SlidersHorizontal, Grid3X3, List, TrendingUp, 
  PlusCircle, HelpCircle, ArrowUpDown, Search, Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState<any[]>([]);
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    minPrice: null,
    maxPrice: null,
    sortBy: 'popular'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const categories = [
    "All", 
    "Computer Vision", 
    "Natural Language Processing", 
    "Audio", 
    "Video", 
    "Generative", 
    "Reinforcement Learning"
  ];
  
  // Sample model data
  const sampleModels = [
    {
      id: "model-1",
      name: "NeuraChatGPT",
      description: "Advanced conversational AI with superior context understanding and multi-turn dialogue capabilities. Perfect for customer service, content creation, and virtual assistants.",
      author: "NexusCoder",
      price: 0.25,
      rating: 4.8,
      downloads: 12500,
      tags: ["Conversational", "GPT", "Assistant"],
      imageUrl: "https://images.unsplash.com/photo-1677442135136-760c813a743d",
      category: "Natural Language Processing"
    },
    {
      id: "model-2",
      name: "PixelMaster",
      description: "State-of-the-art image generation model with unmatched detail and prompt accuracy. Create realistic images, art, and designs with intuitive prompts.",
      author: "AIArtistry",
      price: 0.5,
      rating: 4.9,
      downloads: 8700,
      tags: ["Image", "Creative", "Generation"],
      imageUrl: "https://images.unsplash.com/photo-1686191482311-cb3fa868a543",
      category: "Computer Vision"
    },
    {
      id: "model-3",
      name: "CodeAssist Pro",
      description: "Code completion and generation model fine-tuned on the latest programming languages. Boost your development speed with intelligent suggestions.",
      author: "DevGenius",
      price: 0.35,
      rating: 4.7,
      downloads: 15600,
      tags: ["Coding", "Completion", "Developer"],
      imageUrl: "https://images.unsplash.com/photo-1650368559427-db0fe948a228",
      category: "Natural Language Processing"
    },
    {
      id: "model-4",
      name: "VideoGenie",
      description: "Generate and edit video content through simple text prompts with impressive frame consistency. Ideal for marketing, social media, and creative projects.",
      author: "MediaMage",
      price: 0.75,
      rating: 4.6,
      downloads: 5300,
      tags: ["Video", "Creator", "Editing"],
      imageUrl: "https://images.unsplash.com/photo-1616865582588-558a4b32da0c",
      category: "Video"
    },
    {
      id: "model-5",
      name: "LegalAssistant",
      description: "Specialized model for legal document analysis, contract review, and legal research assistance. Save hours of manual review work with AI-powered analysis.",
      author: "LawTech",
      price: 0.45,
      rating: 4.5,
      downloads: 3200,
      tags: ["Legal", "Analysis", "Professional"],
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
      category: "Natural Language Processing"
    },
    {
      id: "model-6",
      name: "SynthWave",
      description: "Audio generation model capable of creating music, sounds, and voice in multiple styles. Create royalty-free music and sound effects for your projects.",
      author: "AudioAlchemy",
      price: 0.3,
      rating: 4.7,
      downloads: 9800,
      tags: ["Audio", "Music", "Voice"],
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
      category: "Audio"
    },
    {
      id: "model-7",
      name: "StyleTransfer AI",
      description: "Transform photos and videos into different artistic styles with this powerful model. Apply famous painting styles to your own images in seconds.",
      author: "ArtifyAI",
      price: 0.4,
      rating: 4.6,
      downloads: 7200,
      tags: ["Image", "Style", "Transfer"],
      imageUrl: "https://images.unsplash.com/photo-1582201942988-13e014b5f3d6",
      category: "Computer Vision"
    },
    {
      id: "model-8",
      name: "SentimentAnalyzer",
      description: "Advanced sentiment analysis model for social media monitoring, customer feedback analysis, and market research. Understand the emotional tone behind text.",
      author: "DataInsight",
      price: 0.2,
      rating: 4.4,
      downloads: 6500,
      tags: ["Sentiment", "Analysis", "Text"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      category: "Natural Language Processing"
    },
    {
      id: "model-9",
      name: "DeepDream Pro",
      description: "Create surreal and psychedelic artworks from ordinary images with fine-tuned control. Explore the depths of AI imagination with this creative tool.",
      author: "NeuralVisions",
      price: 0.6,
      rating: 4.8,
      downloads: 4300,
      tags: ["Creative", "Art", "Neural"],
      imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
      category: "Computer Vision"
    },
    {
      id: "no-cover-1",
      name: "VoiceCloneX",
      description: "Ultra-realistic voice cloning model that requires just a 5-second sample. Create synthetic voices for narration, voiceovers, and accessibility tools.",
      author: "SpeechTech",
      price: 0.8,
      rating: 4.9,
      downloads: 3100,
      tags: ["Voice", "Clone", "Audio"],
      category: "Audio"
    },
    {
      id: "no-cover-2",
      name: "QuantumML",
      description: "Experimental reinforcement learning model optimized for quantum computing applications. Explore the cutting edge of AI and quantum technology.",
      author: "QuantumLabs",
      price: 1.2,
      rating: 4.3,
      downloads: 1200,
      tags: ["Quantum", "Reinforcement", "Experimental"],
      category: "Reinforcement Learning"
    }
  ];
  
  // New: Featured Models
  const featuredModels = [
    {
      id: "featured-1",
      name: "SuperVision Pro",
      description: "Multi-modal transformer model trained on 2B+ images. Perfect for complex image understanding and generation tasks.",
      author: "VisualAI Labs",
      price: 0.8,
      rating: 4.9,
      downloads: 32600,
      tags: ["Vision", "Multi-modal", "Premium"],
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
      category: "Computer Vision",
      isFeatured: true
    },
    {
      id: "featured-2",
      name: "EmoText 3.0",
      description: "Advanced emotion analysis model that can detect subtle nuances in text across 27 emotional dimensions.",
      author: "SentimentTech",
      price: 0.45,
      rating: 4.7,
      downloads: 18700,
      tags: ["Sentiment", "Emotional", "Analytics"],
      imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
      category: "Natural Language Processing",
      isFeatured: true
    },
    {
      id: "featured-3",
      name: "AudioSynthetic X",
      description: "Real-time voice cloning and audio generation model with multilingual support across 40+ languages.",
      author: "WaveForm AI",
      price: 0.65,
      rating: 4.8,
      downloads: 14300,
      tags: ["Audio", "Voice", "Multilingual"],
      imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618",
      category: "Audio",
      isFeatured: true
    }
  ];
  
  // New: Recent Models
  const recentModels = [
    {
      id: "recent-1",
      name: "NeuroTrader",
      description: "Financial prediction model trained on 15 years of market data with specialized portfolio optimization capabilities.",
      author: "FinancialAI",
      price: 1.2,
      rating: 4.5,
      downloads: 3200,
      tags: ["Finance", "Prediction", "Trading"],
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
      category: "Prediction",
      isNew: true
    },
    {
      id: "recent-2",
      name: "BioSequence",
      description: "Protein folding prediction and molecular design model specialized for pharmaceutical research applications.",
      author: "MedResearch",
      price: 0.95,
      rating: 4.6,
      downloads: 2700,
      tags: ["Biology", "Protein", "Research"],
      imageUrl: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8",
      category: "Specialized",
      isNew: true
    },
    {
      id: "recent-3",
      name: "EcoPredictor",
      description: "Climate modeling and environmental impact prediction model with specialized focus on sustainability metrics.",
      author: "GreenTech",
      price: 0.55,
      rating: 4.4,
      downloads: 1900,
      tags: ["Climate", "Environmental", "Predictive"],
      imageUrl: "https://images.unsplash.com/photo-1619266465172-02a857c3556d",
      category: "Specialized",
      isNew: true
    }
  ];
  
  // New: Model collections
  const collections = [
    {
      id: "collection-1",
      name: "Text-to-Everything Bundle",
      description: "A complete suite of models for converting text to various formats including images, video, code, and 3D objects.",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
      modelCount: 5,
      totalDownloads: 42000,
      author: "AIConverter",
      trending: true
    },
    {
      id: "collection-2",
      name: "Creative Suite Pro",
      description: "Professional-grade generative models for art, design, music composition and creative storytelling.",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      modelCount: 8,
      totalDownloads: 36500,
      author: "CreativeLabs",
      trending: true
    },
    {
      id: "collection-3",
      name: "Enterprise Intelligence Package",
      description: "Specialized models for business intelligence, market analysis, customer insights and decision optimization.",
      imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3",
      modelCount: 6,
      totalDownloads: 28900,
      author: "BusinessAI",
      trending: true
    }
  ];
  
  // Refs for intersection observers
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const containerRef = useRef(null);
  const isContainerInView = useInView(containerRef, { once: false, amount: 0.1 });
  
  // Simulate fetching models
  useEffect(() => {
    setTimeout(() => {
      setModels(sampleModels);
      setFilteredModels(sampleModels);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filters);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };
  
  // Apply filters and search
  const applyFilters = (query: string, filterOptions: FilterOptions) => {
    let result = [...models];
    
    // Apply search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(model => 
        model.name.toLowerCase().includes(lowercaseQuery) ||
        model.description.toLowerCase().includes(lowercaseQuery) ||
        model.author.toLowerCase().includes(lowercaseQuery) ||
        model.tags?.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Apply category filter
    if (filterOptions.category && filterOptions.category !== 'All') {
      result = result.filter(model => model.category === filterOptions.category);
    }
    
    // Apply price filters
    if (filterOptions.minPrice !== null) {
      result = result.filter(model => model.price >= filterOptions.minPrice!);
    }
    
    if (filterOptions.maxPrice !== null) {
      result = result.filter(model => model.price <= filterOptions.maxPrice!);
    }
    
    // Apply sorting
    switch (filterOptions.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // In a real app, you'd sort by date
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }
    
    setFilteredModels(result);
  };
  
  // Handle model view
  const handleViewModel = (id: string) => {
    console.log("Viewing model:", id);
    // In a real app, navigate to the model page
  };
  
  // Handle model purchase
  const handlePurchaseModel = (id: string) => {
    console.log("Purchasing model:", id);
    // In a real app, add to cart or go to checkout
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden"
      >
        {/* Background parallax elements */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            transform: `translateY(${scrollY * 0.2}px)`,
            backgroundImage: 'url(https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=3000&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3) saturate(1.5)'
          }}
        />
        
        <div 
          className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black"
          style={{ 
            transform: `translateY(${scrollY * 0.1}px)` 
          }}
        />
        
        {/* Hero content */}
        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"
            >
              Neural Nexus Marketplace
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl text-gray-300 mb-8"
            >
              Discover, purchase, and deploy cutting-edge AI models from the world's top creators
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <AnimatedButton variant="primary" size="lg">
                Explore Models
              </AnimatedButton>
              <AnimatedButton variant="outline" size="lg">
                <span className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Sell Your Model
                </span>
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `translateY(${scrollY * 0.08 * (i + 1)}px)`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 30 - 15],
                scale: [1, Math.random() * 0.2 + 0.9],
                rotate: [0, Math.random() * 20 - 10],
              }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </section>
      
      {/* Trending Collections */}
      <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex justify-between items-end"
          >
            <div>
              <h2 className="text-3xl font-bold text-white">
                <span className="flex items-center">
                  <TrendingUp className="mr-2 h-6 w-6 text-pink-400" />
                  Trending Collections
                </span>
              </h2>
              <p className="text-gray-400 mt-2">Curated bundles of models that work great together</p>
            </div>
            <Link href="/collections" className="text-cyan-400 hover:text-cyan-300 flex items-center text-sm font-medium">
              View all collections <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatedCard variant="glass" hoverEffect="lift" className="h-full overflow-hidden">
                  <div className="h-36 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <img 
                      src={collection.imageUrl} 
                      alt={collection.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-2">
                      <span className="bg-pink-600/80 text-xs px-2 py-1 rounded-full text-white font-medium flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3" /> Trending
                      </span>
                      <span className="bg-blue-600/80 text-xs px-2 py-1 rounded-full text-white font-medium">
                        {collection.modelCount} Models
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1">{collection.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">by {collection.author}</p>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">{collection.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{formatNumber(collection.totalDownloads)} downloads</span>
                      <AnimatedButton
                        variant="outline"
                        size="xs"
                      >
                        View Collection
                      </AnimatedButton>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <main ref={containerRef} className="container mx-auto px-4 py-12 relative z-10">
        {/* Stats Bar */}
        <motion.div 
          className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {[
            { label: "AI Models", value: "2,500+", icon: <Grid3X3 className="h-6 w-6 text-purple-400" /> },
            { label: "Total Downloads", value: "1.2M+", icon: <ArrowUpDown className="h-6 w-6 text-pink-400" /> },
            { label: "Creators", value: "800+", icon: <TrendingUp className="h-6 w-6 text-blue-400" /> }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={isContainerInView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.2 }}
            >
              <div className="p-3 bg-white/10 rounded-lg">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Featured Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              <span className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                Featured Models
              </span>
            </h2>
            <Link href="/featured" className="text-cyan-400 hover:text-cyan-300 flex items-center text-sm font-medium">
              See all featured <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredModels.map((model, index) => (
              <motion.div
                key={model.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <ModelCard
                  id={model.id}
                  name={model.name}
                  description={model.description}
                  author={model.author}
                  price={model.price}
                  currency="ETH"
                  rating={model.rating}
                  downloads={model.downloads}
                  imageUrl={model.imageUrl}
                  tags={model.tags}
                  onView={handleViewModel}
                  onPurchase={handlePurchaseModel}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Recently Added */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              <span className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-green-400" />
                Recently Added
              </span>
            </h2>
            <Link href="/recent" className="text-cyan-400 hover:text-cyan-300 flex items-center text-sm font-medium">
              View all new models <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentModels.map((model, index) => (
              <motion.div
                key={model.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <ModelCard
                  id={model.id}
                  name={model.name}
                  description={model.description}
                  author={model.author}
                  price={model.price}
                  currency="ETH"
                  rating={model.rating}
                  downloads={model.downloads}
                  imageUrl={model.imageUrl}
                  tags={model.tags}
                  onView={handleViewModel}
                  onPurchase={handlePurchaseModel}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              <span className="flex items-center">
                <Search className="mr-2 h-5 w-5 text-blue-400" />
                Explore All Models
              </span>
            </h2>
            
            <SearchAndFilter 
              onSearch={handleSearch} 
              onFilterChange={handleFilterChange} 
              categories={categories}
            />
            
            {/* Advanced Filter Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.category === 'All' ? 'bg-purple-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => handleFilterChange({...filters, category: 'All'})}
              >
                All Models
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.sortBy === 'free' ? 'bg-green-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => handleFilterChange({...filters, minPrice: 0, maxPrice: 0, sortBy: 'free'})}
              >
                Free Only
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.sortBy === 'newest' ? 'bg-blue-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => handleFilterChange({...filters, sortBy: 'newest'})}
              >
                Newest First
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.sortBy === 'popular' ? 'bg-pink-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => handleFilterChange({...filters, sortBy: 'popular'})}
              >
                Most Popular
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.sortBy === 'price_asc' ? 'bg-amber-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => handleFilterChange({...filters, sortBy: 'price_asc'})}
              >
                Price: Low to High
              </button>
              <button
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filters.sortBy === 'price_desc' ? 'bg-amber-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => handleFilterChange({...filters, sortBy: 'price_desc'})}
              >
                Price: High to Low
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* View Toggles and Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">
            Showing <span className="text-white font-semibold">{filteredModels.length}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}
              aria-label="List view"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4"></div>
            <p className="text-purple-400 animate-pulse">Loading AI models...</p>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredModels.length === 0 ? (
              <AnimatedCard className="p-10 text-center">
                <div className="flex flex-col items-center">
                  <HelpCircle className="h-16 w-16 text-gray-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Models Found</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    We couldn't find any models matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <AnimatedButton 
                    variant="primary"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        category: '',
                        minPrice: null,
                        maxPrice: null,
                        sortBy: 'popular'
                      });
                      setFilteredModels(models);
                    }}
                  >
                    Reset Filters
                  </AnimatedButton>
                </div>
              </AnimatedCard>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate={isContainerInView ? "visible" : "hidden"}
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <ModelCard
                      id={model.id}
                      name={model.name}
                      description={model.description}
                      author={model.author}
                      price={model.price}
                      currency="ETH"
                      rating={model.rating}
                      downloads={model.downloads}
                      imageUrl={model.imageUrl}
                      tags={model.tags}
                      onView={handleViewModel}
                      onPurchase={handlePurchaseModel}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Load More Button */}
        {filteredModels.length > 0 && !isLoading && (
          <div className="mt-12 text-center">
            <AnimatedButton
              variant="outline"
              className="px-10"
            >
              Load More Models
            </AnimatedButton>
          </div>
        )}
      </main>
      
      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 py-20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
            >
              Stay Ahead in AI Innovation
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-300 mb-8"
            >
              Subscribe to our newsletter for the latest updates on new models, research breakthroughs, and exclusive access to beta features.
            </motion.p>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-3 rounded-lg sm:rounded-r-none flex-grow bg-white/5 border border-white/10 focus:outline-none focus:border-purple-500"
                required
              />
              <AnimatedButton
                type="submit"
                variant="primary"
                className="px-6 rounded-lg sm:rounded-l-none"
              >
                Subscribe
              </AnimatedButton>
            </motion.form>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 