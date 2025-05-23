"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnimatedButton } from '@/components/ui/animated-button';
import { 
  Upload, Archive, FileText, Database, Globe, Github, Zap, 
  CheckCircle, Filter, SortDesc, MoreVertical, Edit, Trash, 
  Download, Calendar, Star, Package, ChevronRight, Search, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function YourModelsPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [userModels, setUserModels] = useState<any[]>([]);
  const [uploadType, setUploadType] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated and redirect if not
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        // Get the current URL to redirect back after sign-in
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const currentPath = '/your-models';
        
        // Redirect to sign in if not authenticated, with callback to current page
        router.push(`/signin?callback=${encodeURIComponent(currentPath)}`);
        return;
      }
      
      // If authenticated, fetch user's models
      fetchUserModels();
    };
    
    checkAuth();
  }, [supabase, router]);
  
  const fetchUserModels = async () => {
    setIsLoading(true);
    
    try {
      const { data } = await supabase.auth.getSession();
      
      if (!data?.session) {
        setUserModels([]);
        return;
      }
      
      const { data: models, error } = await supabase
        .from('models')
        .select('*')
        .eq('user_id', data.session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setUserModels(models || []);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load your models');
    } finally {
      setIsLoading(false);
    }
  };
  
  const openUploadFlow = (type: string) => {
    // Set the current upload type
    setUploadType(type);
    
    // Redirect to the appropriate upload page based on type
    router.push(`/upload?type=${type}`);
  };
  
  const handleEditModel = (modelId: string) => {
    router.push(`/upload?edit=${modelId}`);
  };
  
  const handleDeleteModel = async (modelId: string) => {
    if (confirm('Are you sure you want to delete this model? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('models')
          .delete()
          .eq('id', modelId);
          
        if (error) throw error;
        
        // Remove from state
        setUserModels(userModels.filter(model => model.id !== modelId));
        toast.success('Model deleted successfully');
      } catch (error) {
        console.error('Error deleting model:', error);
        toast.error('Failed to delete model');
      }
    }
  };
  
  const viewModel = (modelId: string) => {
    router.push(`/models/${modelId}`);
  };
  
  const deployModel = (modelId: string) => {
    router.push(`/models/${modelId}/deploy`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Upload option cards
  const uploadOptions = [
    {
      title: "Standard ML Model",
      icon: <Archive className="h-10 w-10" />,
      description: "Upload packaged ML models as ZIP files including weights, config files, and documentation.",
      features: [
        "TensorFlow, PyTorch, ONNX formats",
        "Include requirements.txt for dependencies",
        "Max size: 5GB",
        "Automatic versioning"
      ],
      primaryAction: "Upload ZIP",
      onAction: () => openUploadFlow('zip'),
      bgGradient: "from-blue-600/20 to-cyan-600/20"
    },
    {
      title: "Documentation-Based Model",
      icon: <FileText className="h-10 w-10" />,
      description: "Upload models defined through markdown files with code snippets and detailed instructions.",
      features: [
        "Markdown with code blocks",
        "Jupyter notebook conversion",
        "Interactive documentation",
        "Code syntax highlighting"
      ],
      primaryAction: "Upload MD Files",
      onAction: () => openUploadFlow('markdown'),
      bgGradient: "from-purple-600/20 to-pink-600/20"
    },
    {
      title: "Large Model (LFS)",
      icon: <Database className="h-10 w-10" />,
      description: "Upload very large models using our specialized LFS system designed for multi-gigabyte files.",
      features: [
        "Support for models up to 100GB",
        "Chunked uploading",
        "Resume interrupted uploads",
        "Optimized for large language models"
      ],
      primaryAction: "Upload Large Model",
      onAction: () => openUploadFlow('lfs'),
      bgGradient: "from-amber-600/20 to-red-600/20"
    },
    {
      title: "Open Source GitHub Model",
      icon: <Github className="h-10 w-10" />,
      description: "Connect directly to your GitHub repository to import and sync open-source models.",
      features: [
        "GitHub repository required",
        "Automatic updates on commits",
        "Public visibility only",
        "MIT, Apache 2.0, or GPL license required"
      ],
      primaryAction: "Connect GitHub",
      onAction: () => openUploadFlow('github'),
      bgGradient: "from-green-600/20 to-emerald-600/20"
    },
    {
      title: "Hugging Face Model",
      icon: <Zap className="h-10 w-10" />,
      description: "Import models directly from Hugging Face's model hub with just a few clicks.",
      features: [
        "Direct Hugging Face integration",
        "Automatic metadata import",
        "Version tracking",
        "Seamless updates"
      ],
      primaryAction: "Import from Hugging Face",
      onAction: () => openUploadFlow('huggingface'),
      bgGradient: "from-indigo-600/20 to-blue-600/20"
    },
    {
      title: "API-Based Model",
      icon: <Globe className="h-10 w-10" />,
      description: "Connect your model through a custom API endpoint that you control and manage.",
      features: [
        "Custom REST API integration",
        "Webhook support",
        "Authentication management",
        "Rate limiting controls"
      ],
      primaryAction: "Configure API",
      onAction: () => openUploadFlow('api'),
      bgGradient: "from-violet-600/20 to-purple-600/20"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Your AI Models
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            Manage your AI models, upload new ones, and track their performance all in one place.
          </p>
        </motion.div>

        {/* Your Uploaded Models Section */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Your Uploaded Models</h2>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                <SortDesc className="h-4 w-4" /> Sort
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-purple-300">Loading your models...</p>
              </div>
            </div>
          ) : userModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userModels.map(model => (
                <div key={model.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50">
                  <div className="h-48 bg-gradient-to-br from-gray-700/50 to-gray-800/50 relative">
                    {model.thumbnail ? (
                      <Image 
                        src={model.thumbnail} 
                        alt={model.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-full p-1">
                      <div className="relative group">
                        <button 
                          className="p-1 text-gray-300 hover:text-white"
                          title="Model options"
                          aria-label="Model options"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10 hidden group-hover:block">
                          <button 
                            onClick={() => handleEditModel(model.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-700 rounded-t-lg"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteModel(model.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-700 text-red-400 hover:text-red-300 rounded-b-lg"
                          >
                            <Trash className="h-4 w-4 mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{model.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(model.created_at)}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {model.downloads || 0} uses
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {model.rating || 'N/A'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        onClick={() => viewModel(model.id)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-sm rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => deployModel(model.id)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-sm rounded-lg transition-colors"
                      >
                        Deploy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No models yet</h3>
              <p className="text-gray-400 mb-6">You haven't uploaded any AI models yet. Choose an option below to get started.</p>
            </div>
          )}
        </section>

        {/* Upload New Model Section */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Upload New Model</h2>
          <p className="text-gray-300 mb-8">
            Choose the type of model you want to upload. We support various formats and sources to make integration seamless.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadOptions.map((option, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${option.bgGradient} rounded-xl p-6 border border-gray-700/50 h-full flex flex-col`}
              >
                <div className="flex items-center mb-4">
                  <div className="h-14 w-14 rounded-full bg-gray-800/50 flex items-center justify-center mr-3">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{option.title}</h3>
                </div>
                
                <p className="text-gray-300 mb-6">{option.description}</p>
                
                <div className="space-y-3 mb-6 flex-grow">
                  <h4 className="text-sm font-medium text-white/80 uppercase tracking-wider">Features</h4>
                  <ul className="space-y-2">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  className="w-full mt-auto px-4 py-2 bg-gray-900/70 hover:bg-gray-800 border border-gray-700 rounded-lg font-medium transition-colors"
                  onClick={option.onAction}
                >
                  {option.primaryAction}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
} 