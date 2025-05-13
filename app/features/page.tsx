"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Zap, 
  Shield, 
  Cpu, 
  Share2, 
  BarChart3, 
  Code, 
  Server,
  Globe,
  Layers,
  Check,
  Box,
  RefreshCcw,
  TabletSmartphone,
  Settings,
  Wallet,
  Users,
  FileCode,
  PlusCircle,
  Rocket,
  Lock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Main feature categories
  const categories = [
    { id: "all", label: "All Features" },
    { id: "hosting", label: "Model Hosting" },
    { id: "marketplace", label: "Marketplace" },
    { id: "development", label: "Development" },
    { id: "security", label: "Security & Privacy" }
  ];
  
  // Core features 
  const mainFeatures = [
    {
      title: "Lightning-Fast Inference",
      description: "Run predictions on your models with crazy speed - we're talking milliseconds fast for most models!",
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      category: "hosting"
    },
    {
      title: "One-Click Deployment",
      description: "Upload your model and deploy it instantly with our no-BS deployment pipeline.",
      icon: <Rocket className="h-8 w-8 text-orange-400" />,
      category: "hosting"
    },
    {
      title: "Auto-Scaling Infra",
      description: "Our platform handles traffic spikes like a boss, scaling up and down automatically.",
      icon: <RefreshCcw className="h-8 w-8 text-green-400" />,
      category: "hosting"
    },
    {
      title: "Model Marketplace",
      description: "Discover, share, and monetize AI models in our vibrant marketplace.",
      icon: <Globe className="h-8 w-8 text-blue-400" />,
      category: "marketplace"
    },
    {
      title: "Real-Time Analytics",
      description: "Track model performance, usage stats, and costs with our dope dashboard.",
      icon: <BarChart3 className="h-8 w-8 text-purple-400" />,
      category: "hosting"
    },
    {
      title: "Enterprise-Grade Security",
      description: "Keep your models and data locked down tight with our security features.",
      icon: <Shield className="h-8 w-8 text-red-400" />,
      category: "security"
    }
  ];
  
  // Detailed features list
  const detailedFeatures = [
    {
      title: "Model Versioning",
      description: "Maintain multiple versions of your models with full history tracking and rollback options.",
      icon: <Box className="h-6 w-6 text-blue-400" />,
      category: "development"
    },
    {
      title: "RESTful API Access",
      description: "Access your deployed models via our clean, well-documented REST API.",
      icon: <Code className="h-6 w-6 text-green-400" />,
      category: "development"
    },
    {
      title: "Custom Domains",
      description: "Serve model endpoints from your own branded domain with SSL support.",
      icon: <Globe className="h-6 w-6 text-indigo-400" />,
      category: "hosting"
    },
    {
      title: "Serverless Functions",
      description: "Add custom pre- and post-processing logic with serverless functions.",
      icon: <Server className="h-6 w-6 text-yellow-400" />,
      category: "development"
    },
    {
      title: "Team Collaboration",
      description: "Collaborate seamlessly with your squad on model development and deployment.",
      icon: <Users className="h-6 w-6 text-pink-400" />,
      category: "development" 
    },
    {
      title: "Hardware Optimization",
      description: "Automatically optimize models for different hardware configs including CPUs and GPUs.",
      icon: <Cpu className="h-6 w-6 text-red-400" />,
      category: "hosting"
    },
    {
      title: "Flexible Pricing",
      description: "Pay-as-you-go or subscription options that don't drain your wallet.",
      icon: <Wallet className="h-6 w-6 text-emerald-400" />,
      category: "marketplace"
    },
    {
      title: "Model Integration",
      description: "Easily integrate models with popular frameworks and platforms via SDKs.",
      icon: <Share2 className="h-6 w-6 text-purple-400" />,
      category: "development"
    },
    {
      title: "Private Registry",
      description: "Host private models for your team or organization with controlled access.",
      icon: <Lock className="h-6 w-6 text-gray-400" />,
      category: "security"
    },
    {
      title: "Mobile Optimization",
      description: "Optimize models for mobile devices with automatic quantization and pruning.",
      icon: <TabletSmartphone className="h-6 w-6 text-orange-400" />,
      category: "development"
    },
    {
      title: "Custom Model Settings",
      description: "Fine-tune deployment configs with advanced settings for power users.",
      icon: <Settings className="h-6 w-6 text-slate-400" />,
      category: "hosting"
    },
    {
      title: "Model Monitoring",
      description: "Monitor model performance and drift detection in production environments.",
      icon: <BarChart3 className="h-6 w-6 text-teal-400" />,
      category: "hosting"
    }
  ];
  
  // Filter features based on active tab
  const filteredFeatures = detailedFeatures.filter(
    feature => activeTab === "all" || feature.category === activeTab
  );

  // Sample code for API call
  const sampleCode = `// JavaScript example
import { NeuralNexus } from '@neuralnexus/js-client';

// Initialize the client
const client = new NeuralNexus({
  apiKey: 'YOUR_API_KEY'
});

// Run inference on a deployed model
async function generatePrediction() {
  const response = await client.predict({
    modelId: 'stable-diffusion-xl',
    input: {
      prompt: 'A futuristic cityscape at sunset',
      negative_prompt: 'blurry, low quality',
      num_inference_steps: 30
    }
  });
  
  console.log(response.output);
  // Returns URL to generated image
}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/30 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-purple-600/30 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
              Next-Level AI Model Platform
            </h1>
            <p className="text-xl text-gray-300">
              Discover all the sick features that make Neural Nexus the go-to platform for deploying, sharing, and monetizing AI models.
            </p>
          </motion.div>
          
          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-blue-500/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="bg-gray-800/80 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Feature demo */}
          <motion.div 
            className="mb-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Deploy in Seconds</h2>
                <p className="text-gray-300 mb-6">
                  Our super intuitive platform lets you go from model to deployment faster than making instant ramen. 
                  Just upload, configure, and boom—your model is live with an API endpoint.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-500/20 rounded-full p-1 mr-3 mt-1">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">No DevOps Headaches</h4>
                      <p className="text-sm text-gray-400">Forget about server configs and scaling issues</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-500/20 rounded-full p-1 mr-3 mt-1">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Instant API Generation</h4>
                      <p className="text-sm text-gray-400">Auto-generated API docs and client libraries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-500/20 rounded-full p-1 mr-3 mt-1">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Scalable by Default</h4>
                      <p className="text-sm text-gray-400">Handles traffic spikes without breaking a sweat</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link 
                    href="/hosting" 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Try Model Hosting
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-gray-400">model-deploy.js</div>
                </div>
                <pre className="p-4 text-sm overflow-auto max-h-80 font-mono text-gray-300">
                  {sampleCode}
                </pre>
              </div>
            </div>
          </motion.div>
          
          {/* Detailed Features */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-6">Explore All Features</h2>
              
              <div className="inline-flex bg-gray-800/50 p-1.5 rounded-lg mb-8">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === category.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab(category.id)}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/20 backdrop-blur-sm rounded-xl border border-gray-700/50 p-5 hover:border-blue-500/30 transition-all"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-800/80 rounded-full p-2 mr-3">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
              
              {/* Add Your Feature Suggestion */}
              <motion.div
                className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30 p-5 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: filteredFeatures.length * 0.05 + 0.1 }}
              >
                <div className="bg-blue-600/20 rounded-full p-3 mb-3">
                  <PlusCircle className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">Don't See What You Need?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Got a fire feature idea we haven't built yet? Let us know!
                </p>
                <Link
                  href="/contact"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Request a Feature
                </Link>
              </motion.div>
            </div>
          </div>
          
          {/* CTA Section */}
          <motion.div 
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-700/30 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Build Something Epic?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and AI researchers who are already creating the future with Neural Nexus.
              Sign up now and get started with our free tier!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Get Started for Free
              </Link>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 