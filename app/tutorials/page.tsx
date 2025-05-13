"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Search, 
  Clock, 
  ChevronRight, 
  Play,
  ArrowRight,
  Book,
  Code,
  FileText,
  Star,
  Video,
  Users,
  Eye,
  MessageSquare,
  ThumbsUp,
  Share
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('all');

  // Tutorial categories
  const categories = [
    { id: 'all', name: 'All Tutorials', icon: <Book className="h-4 w-4" /> },
    { id: 'getting-started', name: 'Getting Started', icon: <Play className="h-4 w-4" /> },
    { id: 'model-upload', name: 'Model Upload', icon: <FileText className="h-4 w-4" /> },
    { id: 'api-integration', name: 'API Integration', icon: <Code className="h-4 w-4" /> },
    { id: 'fine-tuning', name: 'Fine-Tuning', icon: <Star className="h-4 w-4" /> },
    { id: 'community', name: 'Community & Sharing', icon: <Users className="h-4 w-4" /> },
  ];

  // Experience levels
  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  // Mock tutorials data
  const tutorials = [
    {
      id: 1,
      title: "Getting Started with Neural Nexus",
      description: "Learn the basics of Neural Nexus platform and how to navigate its features",
      image: "/tutorials/tutorial1.jpg",
      category: "getting-started",
      level: "beginner",
      duration: "15 min",
      author: "Alex Chen",
      authorAvatar: "/avatars/alex.jpg",
      views: 8420,
      likes: 342,
      comments: 28,
      date: "May 10, 2024",
      videoUrl: "https://youtube.com/watch?v=example1"
    },
    {
      id: 2,
      title: "How to Upload Your First AI Model",
      description: "Step-by-step guide to uploading and publishing your model on Neural Nexus",
      image: "/tutorials/tutorial2.jpg",
      category: "model-upload",
      level: "beginner",
      duration: "20 min",
      author: "Jamie Singh",
      authorAvatar: "/avatars/jamie.jpg",
      views: 5231,
      likes: 287,
      comments: 42,
      date: "May 5, 2024",
      videoUrl: "https://youtube.com/watch?v=example2"
    },
    {
      id: 3,
      title: "Advanced API Integration for Production Apps",
      description: "Learn how to integrate Neural Nexus API into your production applications with auth, error handling, and more",
      image: "/tutorials/tutorial3.jpg",
      category: "api-integration",
      level: "advanced",
      duration: "45 min",
      author: "Taylor Rodriguez",
      authorAvatar: "/avatars/taylor.jpg",
      views: 3150,
      likes: 210,
      comments: 35,
      date: "April 28, 2024",
      videoUrl: "https://youtube.com/watch?v=example3"
    },
    {
      id: 4,
      title: "Fine-Tuning Text Generation Models",
      description: "Learn how to fine-tune existing LLMs for your specific use case with custom data",
      image: "/tutorials/tutorial4.jpg",
      category: "fine-tuning",
      level: "intermediate",
      duration: "35 min",
      author: "Jordan Lee",
      authorAvatar: "/avatars/jordan.jpg",
      views: 4287,
      likes: 376,
      comments: 52,
      date: "April 20, 2024",
      videoUrl: "https://youtube.com/watch?v=example4"
    },
    {
      id: 5,
      title: "Using Neural Nexus Models in JavaScript Apps",
      description: "Integrate AI model inference into your JavaScript applications with React and Node.js",
      image: "/tutorials/tutorial5.jpg",
      category: "api-integration",
      level: "intermediate",
      duration: "30 min",
      author: "Mia Wong",
      authorAvatar: "/avatars/mia.jpg",
      views: 3892,
      likes: 245,
      comments: 31,
      date: "April 15, 2024",
      videoUrl: "https://youtube.com/watch?v=example5"
    },
    {
      id: 6,
      title: "Building a Community Around Your AI Model",
      description: "Strategies for sharing, documenting and growing a community of users for your AI model",
      image: "/tutorials/tutorial6.jpg",
      category: "community",
      level: "beginner",
      duration: "25 min",
      author: "Sam Johnson",
      authorAvatar: "/avatars/sam.jpg",
      views: 2158,
      likes: 187,
      comments: 24,
      date: "April 10, 2024",
      videoUrl: "https://youtube.com/watch?v=example6"
    },
    {
      id: 7,
      title: "Creating Custom Model Demo Pages",
      description: "Design attractive and interactive demo pages to showcase your model's capabilities",
      image: "/tutorials/tutorial7.jpg",
      category: "model-upload",
      level: "intermediate",
      duration: "40 min",
      author: "Alex Chen",
      authorAvatar: "/avatars/alex.jpg",
      views: 3120,
      likes: 221,
      comments: 37,
      date: "April 5, 2024",
      videoUrl: "https://youtube.com/watch?v=example7"
    },
    {
      id: 8,
      title: "Optimizing Models for Low-Latency Inference",
      description: "Advanced techniques to optimize your models for faster inference and lower costs",
      image: "/tutorials/tutorial8.jpg",
      category: "fine-tuning",
      level: "advanced",
      duration: "55 min",
      author: "Taylor Rodriguez",
      authorAvatar: "/avatars/taylor.jpg",
      views: 2895,
      likes: 198,
      comments: 29,
      date: "March 28, 2024",
      videoUrl: "https://youtube.com/watch?v=example8"
    }
  ];

  // Filter tutorials based on search, category, and level
  const filteredTutorials = tutorials.filter(tutorial => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = activeCategory === 'all' || tutorial.category === activeCategory;
    
    // Filter by level
    const matchesLevel = activeLevel === 'all' || tutorial.level === activeLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Get featured tutorials
  const featuredTutorials = tutorials.slice(0, 3);

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
            Tutorials & Guides
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Learn how to make the most of Neural Nexus through our step-by-step tutorials
          </motion.p>
          
          {/* Search */}
          <motion.div
            className="max-w-2xl mx-auto relative mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <input 
              type="text"
              placeholder="Search tutorials..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* Featured Tutorials */}
      <section className="pb-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">Featured Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="relative aspect-video bg-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-600">Thumbnail Placeholder</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 right-3 bg-gray-900/80 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {tutorial.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">
                      {tutorial.level}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{tutorial.category.replace('-', ' ')}</span>
                  </div>
                  
                  <Link href={`/tutorials/${tutorial.id}`}>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {tutorial.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {tutorial.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-700 mr-2 flex items-center justify-center">
                        <span className="text-xs text-gray-300">{tutorial.author.charAt(0)}</span>
                      </div>
                      <div className="text-sm">{tutorial.author}</div>
                    </div>
                    
                    <div className="flex items-center text-purple-400 text-sm font-medium">
                      Watch
                      <Play className="h-3.5 w-3.5 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tutorials Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with filters */}
            <div className="lg:w-1/4">
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 sticky top-24">
                <h3 className="font-bold mb-4">Categories</h3>
                <nav className="space-y-1 mb-6">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? 'bg-purple-600/20 text-purple-400'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        activeCategory === category.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                  ))}
                </nav>
                
                <h3 className="font-bold mb-4">Experience Level</h3>
                <div className="space-y-2">
                  {levels.map(level => (
                    <div key={level.id} className="flex items-center">
                      <button
                        className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors ${
                          activeLevel === level.id
                            ? 'bg-purple-600/20 text-purple-400'
                            : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                        onClick={() => setActiveLevel(level.id)}
                      >
                        {level.name}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                  <h3 className="font-bold mb-4">Need Help?</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Can't find what you're looking for? Reach out to our community or support team.
                  </p>
                  <Link 
                    href="/contact" 
                    className="block text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main tutorial list */}
            <div className="lg:w-3/4">
              {filteredTutorials.length > 0 ? (
                <div className="space-y-6">
                  {filteredTutorials.map(tutorial => (
                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <Video className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-xl font-bold mb-2">No tutorials found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                      setActiveLevel('all');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
              
              {/* Request Tutorial */}
              <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-700/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Don't see what you need?</h3>
                    <p className="text-gray-300">
                      Request a tutorial on a specific topic and our team will create it
                    </p>
                  </div>
                  <Link 
                    href="/tutorials/request" 
                    className="whitespace-nowrap px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center"
                  >
                    Request a Tutorial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Tutorial Card Component
function TutorialCard({ tutorial }: { tutorial: any }) {
  return (
    <motion.div 
      className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 hover:border-purple-500/30 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <div className="aspect-video md:h-full bg-gray-900 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-600">Thumbnail Placeholder</div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/60 transition-opacity group">
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div className="absolute bottom-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {tutorial.duration}
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3 p-5">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded">
              {tutorial.level}
            </span>
            <span className="bg-gray-700/50 text-gray-300 text-xs px-2 py-0.5 rounded">
              {tutorial.category.replace('-', ' ')}
            </span>
          </div>
          
          <Link href={`/tutorials/${tutorial.id}`}>
            <h3 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors">
              {tutorial.title}
            </h3>
          </Link>
          
          <p className="text-gray-400 text-sm mb-4">
            {tutorial.description}
          </p>
          
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-700 mr-2 flex items-center justify-center">
                <span className="text-xs text-gray-300">{tutorial.author.charAt(0)}</span>
              </div>
              <div>
                <div className="text-sm">{tutorial.author}</div>
                <div className="text-xs text-gray-500">{tutorial.date}</div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-2 md:mt-0">
              <div className="flex items-center text-gray-400 text-xs">
                <Eye className="h-3.5 w-3.5 mr-1" />
                {tutorial.views.toLocaleString()}
              </div>
              <div className="flex items-center text-gray-400 text-xs">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                {tutorial.likes}
              </div>
              <div className="flex items-center text-gray-400 text-xs">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {tutorial.comments}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 