"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import DatasetExplorer from "@/components/DatasetExplorer";
import GitHubRepoExplorer from "@/components/GitHubRepoExplorer";
import KaggleDatasetExplorer from "@/components/KaggleDatasetExplorer";
import AIModelExplorer from "@/components/AIModelExplorer";
import { 
  Github, 
  Code, 
  Star, 
  GitFork, 
  ExternalLink, 
  Search,
  ChevronRight,
  Heart,
  Users,
  CheckCircle,
  BookOpen,
  Sparkles,
  MessageSquare,
  Zap,
  Database,
  BrainCircuit,
  Clock,
  BarChart,
  Layers
} from "lucide-react";

export default function OpenSourcePage() {
  // State for Projects section
  const [searchVibe, setSearchVibe] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // State for active tab in the page
  const [activeTab, setActiveTab] = useState<'projects' | 'models' | 'datasets'>('projects');
  
  // Read the tab parameter from URL on component mount
  useEffect(() => {
    // Get the URL search params
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    
    // Set the active tab based on the URL parameter
    if (tabParam === 'models' || tabParam === 'datasets') {
      setActiveTab(tabParam);
    }
    
    // Update URL when tab changes
    const updateUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', activeTab);
      window.history.replaceState({}, '', url);
    };
    
    updateUrl();
  }, [activeTab]);
  
  // These are our project categories - each with a vibe
  const projectCategories = [
    { id: "all", name: "All Projects" },
    { id: "data", name: "Data Tools" },
    { id: "model", name: "Model Libraries" },
    { id: "inference", name: "Inference Engines" },
    { id: "frontend", name: "Frontend Tools" },
    { id: "utils", name: "Utilities" }
  ];
  
  // Our fire projects data - no cap, these are legit
  const openSourceProjects = [
    {
      name: "NeuralEngine",
      description: "Fast and flexible inference engine for running AI models in production with minimal overhead.",
      category: "inference",
      stars: 4528,
      forks: 876,
      language: "Rust",
      languageColor: "#dea584",
      repoUrl: "https://github.com/neuralnexus/neural-engine",
      tags: ["inference", "production", "optimization"]
    },
    {
      name: "DataFlowPro",
      description: "Data pipeline management system for preprocessing and managing large ML training datasets.",
      category: "data",
      stars: 2891,
      forks: 342,
      language: "Python",
      languageColor: "#3572A5",
      repoUrl: "https://github.com/neuralnexus/dataflow-pro",
      tags: ["data-pipeline", "preprocessing", "ETL"]
    },
    {
      name: "ModelRegistry",
      description: "Open catalog system for registering, versioning, and sharing machine learning models.",
      category: "model",
      stars: 3654,
      forks: 583,
      language: "TypeScript",
      languageColor: "#2b7489",
      repoUrl: "https://github.com/neuralnexus/model-registry",
      tags: ["model-management", "versioning", "catalog"]
    },
    {
      name: "InferenceUI",
      description: "React component library for building AI model demo interfaces with minimal code.",
      category: "frontend",
      stars: 1845,
      forks: 293,
      language: "TypeScript",
      languageColor: "#2b7489",
      repoUrl: "https://github.com/neuralnexus/inference-ui",
      tags: ["react", "UI", "components"]
    },
    {
      name: "ModelFormatConverter",
      description: "Convert between different AI model formats (ONNX, TensorFlow, PyTorch) seamlessly.",
      category: "utils",
      stars: 1267,
      forks: 218,
      language: "Python",
      languageColor: "#3572A5",
      repoUrl: "https://github.com/neuralnexus/model-format-converter",
      tags: ["conversion", "interoperability", "formats"]
    },
    {
      name: "NeuroViz",
      description: "Visualization toolkit for understanding and debugging neural network behavior.",
      category: "utils",
      stars: 2034,
      forks: 287,
      language: "JavaScript",
      languageColor: "#f1e05a",
      repoUrl: "https://github.com/neuralnexus/neuroviz",
      tags: ["visualization", "debugging", "explainability"]
    },
    {
      name: "ModelHub.js",
      description: "JavaScript SDK for interacting with Neural Nexus API and hosted models.",
      category: "frontend",
      stars: 987,
      forks: 142,
      language: "TypeScript",
      languageColor: "#2b7489",
      repoUrl: "https://github.com/neuralnexus/modelhub-js",
      tags: ["SDK", "API", "JavaScript"]
    },
    {
      name: "TrainingFramework",
      description: "Simplified framework for fine-tuning and training models with less boilerplate.",
      category: "model",
      stars: 3245,
      forks: 512,
      language: "Python",
      languageColor: "#3572A5",
      repoUrl: "https://github.com/neuralnexus/training-framework",
      tags: ["training", "fine-tuning", "framework"]
    },
    {
      name: "EmbeddingsDB",
      description: "High-performance vector database for storing and querying AI embeddings at scale.",
      category: "data",
      stars: 3789,
      forks: 492,
      language: "Go",
      languageColor: "#00ADD8",
      repoUrl: "https://github.com/neuralnexus/embeddings-db",
      tags: ["vector-db", "embeddings", "search"]
    },
    {
      name: "ModelMonitor",
      description: "Real-time monitoring for AI models in production with alerting and performance tracking.",
      category: "utils",
      stars: 1567,
      forks: 234,
      language: "TypeScript",
      languageColor: "#2b7489",
      repoUrl: "https://github.com/neuralnexus/model-monitor",
      tags: ["monitoring", "observability", "metrics"]
    },
    {
      name: "DataAnnotator",
      description: "Collaborative platform for annotating training data with version control and QA workflows.",
      category: "data",
      stars: 2134,
      forks: 321,
      language: "Python",
      languageColor: "#3572A5",
      repoUrl: "https://github.com/neuralnexus/data-annotator",
      tags: ["annotation", "labeling", "collaboration"]
    },
    {
      name: "ParameterTuner",
      description: "Hyperparameter optimization tool with automated experimentation and result tracking.",
      category: "model",
      stars: 1823,
      forks: 276,
      language: "Python",
      languageColor: "#3572A5",
      repoUrl: "https://github.com/neuralnexus/parameter-tuner",
      tags: ["hyperparameters", "optimization", "tuning"]
    },
    {
      name: "TensorFlow2ONNX",
      description: "Specialized converter for TensorFlow models to ONNX format with custom op support.",
      category: "utils",
      stars: 1145,
      forks: 187,
      language: "Python",
      languageColor: "#3572A5",
      repoUrl: "https://github.com/neuralnexus/tensorflow2onnx",
      tags: ["tensorflow", "onnx", "conversion"]
    },
    {
      name: "ModelDeploy",
      description: "One-click deployment solution for AI models to various cloud environments and edge devices.",
      category: "inference",
      stars: 2756,
      forks: 384,
      language: "TypeScript",
      languageColor: "#2b7489",
      repoUrl: "https://github.com/neuralnexus/model-deploy",
      tags: ["deployment", "cloud", "edge"]
    },
    {
      name: "ReactInference",
      description: "React hooks and components for integrating AI model inference directly in React apps.",
      category: "frontend",
      stars: 1345,
      forks: 212,
      language: "TypeScript",
      languageColor: "#2b7489",
      repoUrl: "https://github.com/neuralnexus/react-inference",
      tags: ["react", "hooks", "client-side"]
    },
    {
      name: "DistributedTrainer",
      description: "Framework for distributed training across multiple nodes with automatic sharding.",
      category: "model",
      stars: 2987,
      forks: 456,
      language: "Python",
      languageColor: "#3572A5",
      repoUrl: "https://github.com/neuralnexus/distributed-trainer",
      tags: ["distributed", "multi-gpu", "training"]
    }
  ];
  
  // Filter projects based on search and category
  const filteredProjects = openSourceProjects.filter(project => {
    const matchesSearch = searchVibe === '' || 
      project.name.toLowerCase().includes(searchVibe.toLowerCase()) ||
      project.description.toLowerCase().includes(searchVibe.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchVibe.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block"
          >
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-sm font-medium">
              Built Together
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our Open Source Ecosystem
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Neural Nexus believes in the power of open collaboration. We're building a vibrant ecosystem of tools, models, and datasets that empower developers to create the next generation of AI applications.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              href="https://github.com/Drago-03/Neural-Nexus"
              target="_blank"
              rel="noopener noreferrer" 
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center"
            >
              <Github className="mr-2 h-5 w-5" />
              Visit Our GitHub
            </Link>
            <Link 
              href="#content" 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center"
            >
              <Code className="mr-2 h-5 w-5" />
              Explore Resources
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Open Source Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The principles that guide our open source development
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
            >
              <Heart className="h-10 w-10 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Community First</h3>
              <p className="text-gray-300">
                We build with and for the community, prioritizing features that benefit the most people.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
            >
              <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quality Code</h3>
              <p className="text-gray-300">
                We maintain high standards for code quality, documentation, and testing.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
            >
              <BookOpen className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Knowledge Sharing</h3>
              <p className="text-gray-300">
                We believe in openly sharing knowledge and insights, not just code.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
            >
              <Sparkles className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-300">
                We push boundaries and explore new approaches to solve challenging problems.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Main Content Section with Tabs */}
      <section id="content" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold mb-8">Open Source Resources</h2>
            
            {/* Tab Selection */}
            <div className="flex flex-wrap border-b border-gray-700 mb-10">
              <button
                className={`px-6 py-3 font-medium text-lg transition-colors relative ${
                  activeTab === 'projects' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <span>Projects</span>
                </div>
                {activeTab === 'projects' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                )}
              </button>
              
              <button
                className={`px-6 py-3 font-medium text-lg transition-colors relative ${
                  activeTab === 'models' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('models')}
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5" />
                  <span>Models</span>
                </div>
                {activeTab === 'models' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                )}
              </button>
              
              <button
                className={`px-6 py-3 font-medium text-lg transition-colors relative ${
                  activeTab === 'datasets' 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('datasets')}
              >
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  <span>Datasets</span>
                </div>
                {activeTab === 'datasets' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                )}
              </button>
            </div>
          </motion.div>
          
          {/* Projects Section */}
          {activeTab === 'projects' && (
            <GitHubRepoExplorer />
          )}
          
          {/* Models Section */}
          {activeTab === 'models' && (
            <div>
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-pink-500/30 mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-3xl mr-2">🔥</span> 
                  <span className="bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">Trending AI Models</span>
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Explore the hottest AI models from across the ecosystem. Our crawler automatically fetches the latest models
                  from platforms like Hugging Face, ensuring you always have access to cutting-edge AI capabilities.
                </p>
              </div>

              {/* Integrate the AIModelExplorer component */}
              <AIModelExplorer />
            </div>
          )}
          
          {/* Datasets Section */}
          {activeTab === 'datasets' && (
            <div>
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-blue-500/30 mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-3xl mr-2">📊</span> 
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Open Source Datasets</span>
                </h2>
                
                <p className="text-gray-300 mb-6">
                  These datasets are constantly updated through our automated web crawlers. They pull the latest and greatest 
                  from platforms like Kaggle, HuggingFace, and other public repositories. Click any dataset to be redirected
                  to its source - no gatekeeping here, just straight knowledge sharing.
                </p>
              </div>
              
              {/* Integrate the KaggleDatasetExplorer component */}
              <KaggleDatasetExplorer />
              
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-3xl mr-2">🔄</span>
                  <span className="bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text text-transparent">Auto-Updating Datasets</span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Our dataset collection stays fresh with automatic updates. Here's how it works:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                    <div className="flex items-center mb-3">
                      <div className="bg-blue-500/20 rounded-full p-2 mr-3">
                        <Layers className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold">Web Crawlers</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Our automated bots scan popular dataset repositories daily, checking for new additions and updates.</p>
                  </div>
                  
                  <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                    <div className="flex items-center mb-3">
                      <div className="bg-purple-500/20 rounded-full p-2 mr-3">
                        <Clock className="h-5 w-5 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold">24-Hour Cache</h3>
                    </div>
                    <p className="text-gray-300 text-sm">We store dataset information for 24 hours before refreshing to ensure you get up-to-date info without overwhelming API services.</p>
                  </div>
                  
                  <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/30">
                    <div className="flex items-center mb-3">
                      <div className="bg-green-500/20 rounded-full p-2 mr-3">
                        <BarChart className="h-5 w-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold">Popularity Tracking</h3>
                    </div>
                    <p className="text-gray-300 text-sm">We track download counts and update frequencies to highlight the most popular and actively maintained datasets.</p>
                  </div>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-blue-400">Pro Tip:</strong> Hit the refresh button in the dataset explorer to manually update the dataset cache and get the latest additions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Contribution Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-4">How to Contribute</h2>
              <p className="text-xl text-gray-300 mb-6">
                We welcome contributions from developers of all skill levels. Here's how you can get involved:
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Join the Discussion</h3>
                    <p className="text-gray-300">
                      Participate in GitHub Discussions, our Discord server, or community calls to share ideas.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Code className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Submit Pull Requests</h3>
                    <p className="text-gray-300">
                      Fix bugs, add features, or improve documentation. Every contribution matters!
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-pink-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Star and Share</h3>
                    <p className="text-gray-300">
                      Help our projects gain visibility by starring repositories and sharing with others.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-600/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Become a Maintainer</h3>
                    <p className="text-gray-300">
                      Dedicated contributors can take on larger roles in project maintenance and direction.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:w-1/2 bg-gray-800/30 rounded-xl border border-gray-700/50 p-6"
            >
              <h3 className="text-2xl font-bold mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-green-400 mb-2">
                    <span className="font-mono text-sm mr-2">01</span>
                    <h4 className="font-bold">Fork a Repository</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Fork any repository you're interested in from our GitHub organization.
                  </p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-green-400 mb-2">
                    <span className="font-mono text-sm mr-2">02</span>
                    <h4 className="font-bold">Clone and Setup</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Clone your fork and follow setup instructions in the README file.
                  </p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-green-400 mb-2">
                    <span className="font-mono text-sm mr-2">03</span>
                    <h4 className="font-bold">Find an Issue</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Look for issues labeled "good first issue" or "help wanted" to get started.
                  </p>
                </div>
                
                <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center text-green-400 mb-2">
                    <span className="font-mono text-sm mr-2">04</span>
                    <h4 className="font-bold">Make Your Changes</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Create a branch, make your changes, and submit a pull request with clear descriptions.
                  </p>
                </div>
              </div>
              
              <Link 
                href="https://github.com/Drago-03/Neural-Nexus/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-purple-400 hover:text-purple-300"
              >
                Read our full contribution guidelines
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Releases Section - New Addition */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Upcoming Releases</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Check out what's coming next in our open source ecosystem
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <span className="bg-purple-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Q4 2025
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4">Collaborative Workspaces</h3>
              <p className="text-gray-300 mb-4">
                Team-based development environments with real-time collaboration features for model development and deployment.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Shared notebooks with Git integration</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Role-based permissions at project level</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Built-in code review workflows</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <span className="bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Q3 2026
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4">AI Agent Framework</h3>
              <p className="text-gray-300 mb-4">
                Framework for building autonomous AI agents with reasoning capabilities that can perform complex tasks.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Agent orchestration and monitoring</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Advanced reasoning capabilities</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Complex task automation</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0">
                <span className="bg-pink-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Q1 2027
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4">Core SDK Release</h3>
              <p className="text-gray-300 mb-4">
                Launch of the official Neural Nexus SDK with comprehensive libraries for Python, JavaScript, Rust, and Go.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">High-level abstractions for all capabilities</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Multi-language support (Python, JS, Rust, Go)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-300">Low-level control for platform features</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/roadmap"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium"
            >
              View our full product roadmap
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Blog Section - New Addition */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">From Our Open Source Blog</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, tutorials, and updates from our engineering team
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-purple-900/30 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-purple-500/80 text-white text-xs font-medium px-2 py-1 rounded">
                    Tutorial
                  </span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-gray-400 text-sm">June 15, 2023</span>
                <h3 className="text-xl font-bold mt-2 mb-3">Building High-Performance Inference Engines in Rust</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  Learn how we optimized NeuralEngine for maximum throughput while maintaining low latency and memory usage.
                </p>
                <Link 
                  href="/blog/building-high-performance-inference-engines"
                  className="text-purple-400 hover:text-purple-300 inline-flex items-center text-sm font-medium"
                >
                  Read more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-blue-900/30 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-600/20"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-blue-500/80 text-white text-xs font-medium px-2 py-1 rounded">
                    Case Study
                  </span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-gray-400 text-sm">May 22, 2023</span>
                <h3 className="text-xl font-bold mt-2 mb-3">How We Built a Vector Database That Scales to Billions of Embeddings</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  A deep dive into the architecture of EmbeddingsDB and how we solved the challenges of vector search at scale.
                </p>
                <Link 
                  href="/blog/scaling-vector-database"
                  className="text-purple-400 hover:text-purple-300 inline-flex items-center text-sm font-medium"
                >
                  Read more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden"
            >
              <div className="h-48 bg-green-900/30 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-yellow-600/20"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-green-500/80 text-white text-xs font-medium px-2 py-1 rounded">
                    Community
                  </span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-gray-400 text-sm">April 30, 2023</span>
                <h3 className="text-xl font-bold mt-2 mb-3">Open Source Community Highlights: Q1 2023</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  Celebrating our contributors, showcasing impressive projects built with our tools, and community stats.
                </p>
                <Link 
                  href="/blog/community-highlights-q1-2023"
                  className="text-purple-400 hover:text-purple-300 inline-flex items-center text-sm font-medium"
                >
                  Read more
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/blog/category/open-source"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              View all blog posts
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Join Our Open Source Community</h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect with like-minded developers, share ideas, and build the future of AI together
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="https://github.com/Drago-03/Neural-Nexus"
                target="_blank"
                rel="noopener noreferrer" 
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Link>
              <Link 
                href="/discord" 
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Discord Community
              </Link>
              <Link 
                href="/blog/category/open-source" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Open Source Blog
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 