"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OptimizedImage from "@/components/OptimizedImage";
import { 
  Users, Star, Calendar, MessageSquare, ArrowRight, 
  Zap, Award, Sparkles, TrendingUp, Globe, Heart, ChevronLeft, ChevronRight, Upload, Code, Wallet, Repeat, DollarSign
} from 'lucide-react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('trending');

  const featuredCreators = [
    {
      name: "Sarah AI",
      image: "/creators/sarah.jpg",
      role: "ML Engineer",
      models: 12,
      followers: "5.2K",
      bio: "Building the next gen of computer vision models",
      tags: ["#ComputerVision", "#DeepLearning"]
    },
    {
      name: "DataWhiz",
      image: "/creators/datawhiz.jpg",
      role: "Data Scientist",
      models: 8,
      followers: "3.8K",
      bio: "Specializing in NLP and text generation",
      tags: ["#NLP", "#GPT"]
    },
    {
      name: "RoboMaster",
      image: "/creators/robomaster.jpg",
      role: "Robotics Engineer",
      models: 15,
      followers: "7.1K",
      bio: "Creating AI models for robotics and automation",
      tags: ["#Robotics", "#RL"]
    }
  ];

  const trendingModels = [
    {
      name: "SuperRes Pro",
      image: "/models/superres.jpg",
      creator: "PixelPro",
      category: "Image Enhancement",
      likes: 1234,
      downloads: "50K+"
    },
    {
      name: "TextMaster GPT",
      image: "/models/textmaster.jpg",
      creator: "AIWriter",
      category: "Text Generation",
      likes: 982,
      downloads: "30K+"
    },
    {
      name: "VoiceClone AI",
      image: "/models/voiceclone.jpg",
      creator: "AudioLab",
      category: "Speech Synthesis",
      likes: 756,
      downloads: "25K+"
    }
  ];

  const upcomingEvents = [
    {
      title: "AI Model Hackathon",
      date: "Dec 15-17, 2024",
      image: "/events/hackathon.jpg",
      location: "Virtual Event",
      attendees: 500
    },
    {
      title: "Neural Networks Workshop",
      date: "Dec 20, 2024",
      image: "/events/workshop.jpg",
      location: "Online",
      attendees: 300
    },
    {
      title: "AI Model Showcase",
      date: "Jan 5, 2025",
      image: "/events/showcase.jpg",
      location: "Virtual Conference",
      attendees: 1000
    }
  ];

  const discussions = [
    {
      title: "Best practices for fine-tuning large language models",
      author: "AIExpert",
      replies: 45,
      likes: 123,
      tags: ["LLM", "Training"]
    },
    {
      title: "How to optimize transformer models for production",
      author: "PerfGuru",
      replies: 32,
      likes: 98,
      tags: ["Optimization", "Production"]
    },
    {
      title: "Future of AI model marketplaces",
      author: "FutureAI",
      replies: 67,
      likes: 156,
      tags: ["Market", "Trends"]
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Thriving
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                AI Creator Community
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Connect with fellow creators, share your models, and stay updated with the latest in AI innovation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Join Community
              </Link>
              <Link
                href="/discord"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Join Discord
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Users className="h-6 w-6 text-purple-400" />, label: "Active Members", value: "50K+" },
              { icon: <Star className="h-6 w-6 text-yellow-400" />, label: "AI Models Shared", value: "10K+" },
              { icon: <MessageSquare className="h-6 w-6 text-blue-400" />, label: "Daily Discussions", value: "1K+" },
              { icon: <Globe className="h-6 w-6 text-green-400" />, label: "Countries", value: "120+" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center gap-4">
                  {stat.icon}
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Library Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">
              Showcase Library
            </h2>
            <p className="text-xl text-gray-300">
              Explore our curated collection of cutting-edge AI models, from image generation to natural language processing. 
              Each model is verified and ready to revolutionize your projects.
            </p>
          </motion.div>

          {/* Feature Cards Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-gray-700/80 transition-colors hidden md:block"
              onClick={() => {
                const container = document.getElementById('feature-scroll');
                if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-gray-700/80 transition-colors hidden md:block"
              onClick={() => {
                const container = document.getElementById('feature-scroll');
                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Scrollable Cards Container */}
            <div 
              id="feature-scroll"
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
            >
              {[
                {
                  icon: <Upload className="h-8 w-8 text-blue-400" />,
                  title: "Upload Your Model Securely",
                  description: "Advanced encryption and secure storage for your valuable AI models",
                  color: "from-blue-500/20 to-cyan-500/20",
                  iconBg: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Code className="h-8 w-8 text-green-400" />,
                  title: "Test & Demo Before Publishing",
                  description: "Let users try your model with custom demo environments",
                  color: "from-green-500/20 to-teal-500/20",
                  iconBg: "from-green-500 to-teal-500"
                },
                {
                  icon: <Wallet className="h-8 w-8 text-purple-400" />,
                  title: "Sell With Crypto & UPI",
                  description: "Multiple payment options including cryptocurrencies and traditional methods",
                  color: "from-purple-500/20 to-indigo-500/20",
                  iconBg: "from-purple-500 to-indigo-500"
                },
                {
                  icon: <Repeat className="h-8 w-8 text-pink-400" />,
                  title: "Permanent Ownership Transfer",
                  description: "Blockchain-verified transfer of complete ownership rights",
                  color: "from-pink-500/20 to-rose-500/20",
                  iconBg: "from-pink-500 to-rose-500"
                },
                {
                  icon: <DollarSign className="h-8 w-8 text-amber-400" />,
                  title: "Earn Royalties on Reuse",
                  description: "Continue earning when your model is used in commercial applications",
                  color: "from-amber-500/20 to-yellow-500/20",
                  iconBg: "from-amber-500 to-yellow-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="min-w-[300px] md:min-w-[400px] snap-center"
                >
                  <div className={`h-full bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-gray-600/50 transition-all`}>
                    <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center`}>
                      {feature.icon}
                  </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                    <Link 
                      href="#" 
                      className="inline-flex items-center mt-4 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
                </div>
              </div>
              
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <Link
              href="/models/explore"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Browse Models
            </Link>
            <Link
              href="/models/submit"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Submit Your Model
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Creators</h2>
            <Link href="/creators" className="text-purple-400 hover:text-purple-300 flex items-center">
              View all creators <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCreators.map((creator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50"
              >
                <div className="h-48 relative">
                  <OptimizedImage
                    src={creator.image}
                    alt={creator.name}
                    className="w-full h-full"
                    aspectRatio="auto"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{creator.name}</h3>
                  <p className="text-purple-400 mb-3">{creator.role}</p>
                  <p className="text-gray-300 mb-4">{creator.bio}</p>
                  <div className="flex gap-2 mb-4">
                    {creator.tags.map((tag, i) => (
                      <span key={i} className="text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{creator.models} Models</span>
                    <span>{creator.followers} Followers</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Models */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Trending Models</h2>
            <Link href="/models" className="text-purple-400 hover:text-purple-300 flex items-center">
              Explore all models <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
                </div>
                
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingModels.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50"
              >
                <div className="h-48 relative">
                  <OptimizedImage
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full"
                    aspectRatio="auto"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-400 mb-2">{model.category}</div>
                  <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                  <p className="text-gray-400 mb-4">by {model.creator}</p>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" /> {model.likes}
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" /> {model.downloads}
                    </span>
              </div>
            </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-purple-400 hover:text-purple-300 flex items-center">
              View all events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            </div>
            
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50"
              >
                <div className="h-48 relative">
                  <OptimizedImage
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full"
                    aspectRatio="auto"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-400 mb-2">{event.date}</div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-4">{event.location}</p>
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    {event.attendees}+ attending
            </div>
          </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Discussions */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Hot Discussions</h2>
            <Link href="/discussions" className="text-purple-400 hover:text-purple-300 flex items-center">
              View all discussions <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                    <p className="text-gray-400 mb-3">Posted by {discussion.author}</p>
                    <div className="flex gap-2">
                      {discussion.tags.map((tag, i) => (
                        <span key={i} className="text-sm bg-gray-700/50 px-3 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" /> {discussion.replies}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" /> {discussion.likes}
                    </span>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
            </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect with AI enthusiasts, share your knowledge, and be part of the future of AI.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Join Now - It's Free!
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 