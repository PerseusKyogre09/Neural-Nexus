"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModelCard } from './ModelCard';
import { AnimatedCard } from './ui/animated-card';
import { AnimatedButton } from './ui/animated-button';

// Mock data for featured models
const mockModels = [
  {
    id: "model-1",
    name: "NeuraChatGPT",
    description: "Advanced conversational AI with superior context understanding and multi-turn dialogue capabilities.",
    author: "NexusCoder",
    price: 25,
    cryptoPrice: { amount: 0.01, currency: "ETH" },
    isNFTBacked: true,
    rating: 4.8,
    downloads: 12500,
    tags: ["Conversational", "GPT", "Assistant"],
    imageUrl: "https://images.unsplash.com/photo-1677442135136-760c813a743d"
  },
  {
    id: "model-2",
    name: "PixelMaster",
    description: "State-of-the-art image generation model with unmatched detail and prompt accuracy.",
    author: "AIArtistry",
    price: 50,
    cryptoPrice: { amount: 0.02, currency: "ETH" },
    ipfsHash: "Qm...",
    rating: 4.9,
    downloads: 8700,
    tags: ["Image", "Creative", "Generation"],
    imageUrl: "https://images.unsplash.com/photo-1686191482311-cb3fa868a543"
  },
  {
    id: "model-3",
    name: "CodeAssist Pro",
    description: "Code completion and generation model fine-tuned on the latest programming languages.",
    author: "DevGenius",
    price: 35,
    cryptoPrice: { amount: 20, currency: "MATIC" },
    isNFTBacked: true,
    ipfsHash: "Qm...",
    rating: 4.7,
    downloads: 15600,
    tags: ["Coding", "Completion", "Developer"],
    imageUrl: "https://images.unsplash.com/photo-1650368559427-db0fe948a228"
  },
  {
    id: "model-4",
    name: "VideoGenie",
    description: "Generate and edit video content through simple text prompts with impressive frame consistency.",
    author: "MediaMage",
    price: 75,
    rating: 4.6,
    downloads: 5300,
    tags: ["Video", "Creator", "Editing"],
    imageUrl: "https://images.unsplash.com/photo-1616865582588-558a4b32da0c"
  },
  {
    id: "model-5",
    name: "LegalAssistant",
    description: "Specialized model for legal document analysis, contract review, and legal research assistance.",
    author: "LawTech",
    price: 45,
    cryptoPrice: { amount: 45, currency: "USDT" },
    rating: 4.5,
    downloads: 3200,
    tags: ["Legal", "Analysis", "Professional"],
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f"
  },
  {
    id: "model-6",
    name: "SynthWave",
    description: "Audio generation model capable of creating music, sounds, and voice in multiple styles.",
    author: "AudioAlchemy",
    price: 30,
    isNFTBacked: true,
    rating: 4.7,
    downloads: 9800,
    tags: ["Audio", "Music", "Voice"],
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
  }
];

export function FeaturedModels() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewingModel, setViewingModel] = useState<string | null>(null);
  
  // Categories for filtering
  const categories = [
    { id: "all", name: "All Models" },
    { id: "image", name: "Image" },
    { id: "text", name: "Text" },
    { id: "code", name: "Code" },
    { id: "audio", name: "Audio" },
    { id: "video", name: "Video" },
  ];
  
  // Filter models based on category and search query
  const filteredModels = mockModels.filter(model => {
    // Filter by category
    if (activeCategory !== "all") {
      const modelTags = model.tags.map(tag => tag.toLowerCase());
      if (!modelTags.includes(activeCategory.toLowerCase())) {
        return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        model.name.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.author.toLowerCase().includes(query) ||
        model.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  const handleViewModel = (id: string) => {
    setViewingModel(id);
    // In a real app, you'd navigate to the model page
    console.log(`Viewing model ${id}`);
  };

  const handlePurchaseModel = (id: string) => {
    // In a real app, you'd open a purchase modal or navigate to checkout
    console.log(`Purchasing model ${id}`);
  };
  
  return (
    <section className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              Featured Models
            </h2>
            <p className="text-gray-400 mt-2">
              Explore the latest and most popular AI models in our marketplace
            </p>
          </div>
          
          {/* Search input */}
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            />
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Model grid */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ModelCard
                  id={model.id}
                  name={model.name}
                  description={model.description}
                  author={model.author}
                  price={model.price}
                  cryptoPrice={model.cryptoPrice}
                  isNFTBacked={model.isNFTBacked}
                  ipfsHash={model.ipfsHash}
                  rating={model.rating}
                  downloads={model.downloads}
                  tags={model.tags}
                  imageUrl={model.imageUrl}
                  onView={handleViewModel}
                  onPurchase={handlePurchaseModel}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatedCard variant="glass" className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">No models found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <AnimatedButton
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Reset Filters
            </AnimatedButton>
          </AnimatedCard>
        )}
        
        {/* View all button */}
        <div className="mt-10 text-center">
          <AnimatedButton
            variant="secondary"
            size="lg"
            className="px-8"
          >
            View All Models
          </AnimatedButton>
        </div>
      </motion.div>
    </section>
  );
} 