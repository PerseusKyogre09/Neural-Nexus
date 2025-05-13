"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  ExternalLink,
  Star,
  Filter,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Tag
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShowcasePage() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Categories for filtering
  const categories = [
    { id: "all", label: "All Projects" },
    { id: "image", label: "Image Generation" },
    { id: "text", label: "Text & Chat" },
    { id: "audio", label: "Audio & Speech" },
    { id: "multimodal", label: "Multimodal" },
    { id: "enterprise", label: "Enterprise" }
  ];
  
  // Featured project data
  const featuredProjects = [
    {
      id: 1,
      title: "DreamScape AI",
      description: "An interactive storytelling app that generates illustrated children's stories based on user prompts.",
      category: "multimodal",
      image: "/showcase/dreamscape.jpg",
      creator: "Storyforge Studios",
      url: "https://dreamscape.ai",
      featured: true,
      tags: ["Stories", "Education", "Creative"]
    },
    {
      id: 2,
      title: "SonicArt",
      description: "Turn your text prompts into original music compositions with AI-generated melodies and harmonies.",
      category: "audio",
      image: "/showcase/sonicart.jpg",
      creator: "MelodyMinds",
      url: "https://sonicart.io",
      featured: true,
      tags: ["Music", "Creative", "Entertainment"]
    },
    {
      id: 3,
      title: "Pixel Prophet",
      description: "AI-powered graphic design tool that creates custom illustrations, logos, and brand assets.",
      category: "image",
      image: "/showcase/pixelprophet.jpg",
      creator: "DesignLabs",
      url: "https://pixelprophet.design",
      featured: false,
      tags: ["Design", "Business", "Branding"]
    },
    {
      id: 4,
      title: "LegalBrief",
      description: "AI assistant that helps lawyers analyze cases, summarize documents, and draft legal briefs.",
      category: "text",
      image: "/showcase/legalbrief.jpg",
      creator: "JusticeTech",
      url: "https://legalbrief.law",
      featured: false,
      tags: ["Legal", "Business", "Productivity"]
    },
    {
      id: 5,
      title: "EchoScribe",
      description: "Real-time audio transcription tool with support for 30+ languages and speaker identification.",
      category: "audio",
      image: "/showcase/echoscribe.jpg",
      creator: "TranscriptPro",
      url: "https://echoscribe.app",
      featured: false,
      tags: ["Productivity", "Accessibility", "Business"]
    },
    {
      id: 6,
      title: "CineMagic",
      description: "AI video editing platform that auto-generates highlight reels from raw footage.",
      category: "multimodal",
      image: "/showcase/cinemagic.jpg",
      creator: "VisualFlow Studios",
      url: "https://cinemagic.video",
      featured: false,
      tags: ["Video", "Entertainment", "Creative"]
    },
    {
      id: 7,
      title: "HealthScan",
      description: "Medical imaging analysis tool that helps radiologists detect abnormalities in scans.",
      category: "image",
      image: "/showcase/healthscan.jpg",
      creator: "MedTech Innovations",
      url: "https://healthscan.medical",
      featured: false,
      tags: ["Healthcare", "Medical", "Enterprise"]
    },
    {
      id: 8,
      title: "RetailGenius",
      description: "AI-powered inventory management and demand forecasting system for retail businesses.",
      category: "enterprise",
      image: "/showcase/retailgenius.jpg",
      creator: "Commerce Solutions",
      url: "https://retailgenius.com",
      featured: false,
      tags: ["Retail", "Business", "Analytics"]
    },
    {
      id: 9,
      title: "CodeWizard",
      description: "AI programming assistant that helps developers write, review, and debug code faster.",
      category: "text",
      image: "/showcase/codewizard.jpg",
      creator: "DevTools Inc.",
      url: "https://codewizard.dev",
      featured: false,
      tags: ["Development", "Productivity", "Tools"]
    },
    {
      id: 10,
      title: "VoiceClone",
      description: "Create realistic voice clones for accessibility, localization, and creative projects.",
      category: "audio",
      image: "/showcase/voiceclone.jpg", 
      creator: "EchoTech",
      url: "https://voiceclone.io",
      featured: false,
      tags: ["Audio", "Accessibility", "Entertainment"]
    },
    {
      id: 11,
      title: "SupplyChainAI",
      description: "Enterprise supply chain optimization platform using predictive analytics and ML.",
      category: "enterprise",
      image: "/showcase/supplychainai.jpg",
      creator: "LogisticsPro",
      url: "https://supplychainai.com",
      featured: false,
      tags: ["Logistics", "Enterprise", "Analytics"]
    },
    {
      id: 12,
      title: "ArtMuse",
      description: "AI art generator that creates unique artwork in various styles based on text prompts.",
      category: "image",
      image: "/showcase/artmuse.jpg",
      creator: "CreativeCanvas",
      url: "https://artmuse.gallery",
      featured: false,
      tags: ["Art", "Creative", "Design"]
    }
  ];
  
  // Filter projects based on active category
  const filteredProjects = activeFilter === "all" 
    ? featuredProjects 
    : featuredProjects.filter(project => project.category === activeFilter);
  
  // Featured projects for the hero section
  const heroProjects = featuredProjects.filter(project => project.featured).slice(0, 2);
  
  // Rest of the projects
  const regularProjects = filteredProjects.filter(project => 
    !heroProjects.some(heroProject => heroProject.id === project.id)
  );
  
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
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
              Showcase Gallery
            </h1>
            <p className="text-xl text-gray-300">
              Check out these super cool projects built with Neural Nexus. From startups to enterprises, 
              see how developers are creating mind-blowing AI experiences.
            </p>
          </motion.div>
          
          {/* Hero Featured Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {heroProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-blue-600/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                  {/* This would be replaced with actual images in a real implementation */}
                  <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 w-full h-full flex items-center justify-center">
                    <Image
                      src={project.image || "/placeholder.jpg"}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-gray-800/80 text-gray-300 text-xs px-2.5 py-1 rounded-full">
                      {categories.find(cat => cat.id === project.category)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <a 
                      href={project.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  
                  <p className="text-gray-400 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Built by <span className="text-blue-400">{project.creator}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {project.tags.slice(0, 2).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-gray-800/80 text-gray-400 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="text-xs bg-gray-800/80 text-gray-400 px-2 py-1 rounded-full">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Project Filters */}
          <div className="mb-8 flex flex-wrap justify-center">
            <div className="inline-flex bg-gray-800/50 p-1.5 rounded-lg mb-8">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === category.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {regularProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/30 transition-all group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                  
                  {/* This would be replaced with actual images in a real implementation */}
                  <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 w-full h-full flex items-center justify-center">
                    <Image
                      src={project.image || "/placeholder.jpg"}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="bg-gray-800/80 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                      {categories.find(cat => cat.id === project.category)?.label}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <a 
                      href={project.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-gray-500">
                      By <span className="text-blue-400">{project.creator}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      {project.tags.slice(0, 1).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="bg-gray-800/80 text-gray-400 px-1.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 1 && (
                        <span className="bg-gray-800/80 text-gray-400 px-1.5 py-0.5 rounded-full">
                          +{project.tags.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Submit Your Project Card */}
            <motion.div
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 overflow-hidden flex flex-col items-center justify-center p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: regularProjects.length * 0.05 }}
            >
              <div className="mb-4 bg-blue-600/20 p-4 rounded-full">
                <ArrowUpRight className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Submit Your Project</h3>
              <p className="text-gray-400 mb-6">
                Built something cool with Neural Nexus? Show off your work in our showcase gallery!
              </p>
              <Link
                href="/contact?subject=Showcase%20Submission"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-flex items-center"
              >
                Submit Now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
          
          {/* CTA Section */}
          <motion.div 
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-700/30 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Build Your Own AI Project?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and creators who are building the next generation of AI applications.
              Get started with Neural Nexus and bring your ideas to life!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Start Building
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Read Docs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 