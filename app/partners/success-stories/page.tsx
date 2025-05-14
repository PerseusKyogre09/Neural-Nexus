"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Quote, ArrowRight, Award, BarChart, Zap, Cpu, Globe, Brain, Sparkles, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AnimatedButton } from '@/components/ui/animated-button';

// Define types for our success stories
interface CompanyLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
  avatar: string;
}

interface SuccessMetric {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  logo: CompanyLogo;
  coverImage: string;
  testimonial: Testimonial;
  metrics: SuccessMetric[];
  tags: string[];
  partnerType: string;
  featured: boolean;
}

// Sample success stories data - in a real app, this would come from a database
const successStories: SuccessStory[] = [
  {
    id: 'neural-dynamics',
    title: 'Neural Dynamics revolutionizes healthcare predictive analytics',
    description: 'How Neural Dynamics leveraged our platform to build a suite of healthcare AI models that predict patient outcomes with 94% accuracy.',
    challenge: 'Neural Dynamics needed to train and deploy specialized healthcare AI models quickly while ensuring HIPAA compliance and maintaining high accuracy for critical medical predictions.',
    solution: 'Using our platform\'s secure training infrastructure and specialized healthcare datasets, Neural Dynamics built and optimized their predictive models while leveraging our deployment solutions for real-time inference.',
    impact: 'Their AI solutions are now deployed in 47 hospitals nationwide, helping physicians identify high-risk patients 72 hours earlier than traditional methods, potentially saving thousands of lives annually.',
    logo: {
      src: '/partners/neural-dynamics-logo.png',
      alt: 'Neural Dynamics',
      width: 180,
      height: 60
    },
    coverImage: '/partners/healthcare-ai.jpg',
    testimonial: {
      quote: "The AI-Model-Hub platform accelerated our time to market by 65% while helping us achieve accuracy levels we never thought possible. Their specialized healthcare datasets and secure infrastructure were game-changers for our HIPAA-compliant deployment.",
      author: "Dr. Sophia Chen",
      position: "Chief AI Officer",
      company: "Neural Dynamics",
      avatar: "/partners/sophia-chen.jpg"
    },
    metrics: [
      { value: "94%", label: "Prediction accuracy", icon: <BarChart className="h-5 w-5 text-blue-400" /> },
      { value: "65%", label: "Faster development", icon: <Zap className="h-5 w-5 text-yellow-400" /> },
      { value: "47", label: "Hospitals using the solution", icon: <Globe className="h-5 w-5 text-green-400" /> }
    ],
    tags: ['Healthcare', 'Predictive Analytics', 'HIPAA Compliant'],
    partnerType: "Technology Partner",
    featured: true
  },
  {
    id: 'quantum-vision',
    title: 'Quantum Vision transforms manufacturing quality control',
    description: 'How Quantum Vision used computer vision models from our marketplace to reduce manufacturing defects by 87% while cutting inspection costs.',
    challenge: 'Quantum Vision needed to implement advanced computer vision for detecting microscopic manufacturing defects across 12 production lines without disrupting operations or requiring expensive hardware upgrades.',
    solution: 'They integrated pre-trained models from our marketplace and fine-tuned them on their specific use cases, then used our edge deployment tools to run inference on existing camera systems.',
    impact: 'Defect detection accuracy improved from 76% with human inspectors to 99.3% with AI, reducing customer returns by 87% and saving over $4.2M annually in quality control costs.',
    logo: {
      src: '/partners/quantum-vision-logo.png',
      alt: 'Quantum Vision',
      width: 180,
      height: 60
    },
    coverImage: '/partners/manufacturing-ai.jpg',
    testimonial: {
      quote: "We evaluated several AI platforms but only AI-Model-Hub had the specialized computer vision models we needed. The ability to fine-tune existing models rather than building from scratch saved us months of development time and millions in costs.",
      author: "Mark Yoshida",
      position: "VP of Innovation",
      company: "Quantum Vision",
      avatar: "/partners/mark-yoshida.jpg"
    },
    metrics: [
      { value: "99.3%", label: "Detection accuracy", icon: <Award className="h-5 w-5 text-yellow-400" /> },
      { value: "87%", label: "Reduction in defects", icon: <BarChart className="h-5 w-5 text-green-400" /> },
      { value: "$4.2M", label: "Annual savings", icon: <Cpu className="h-5 w-5 text-blue-400" /> }
    ],
    tags: ['Manufacturing', 'Computer Vision', 'Quality Control'],
    partnerType: "Solution Partner",
    featured: true
  },
  {
    id: 'verbify-ai',
    title: 'Verbify AI creates revolutionary language learning platform',
    description: 'How Verbify AI built a personalized language learning platform that adapts to individual student needs using our NLP models and training infrastructure.',
    challenge: 'Verbify needed to create personalized learning experiences for language students across 24 languages, with adaptive difficulty and real-time feedback on pronunciation and grammar.',
    solution: 'Using our multilingual NLP models and speech recognition capabilities, they built a system that provides instant feedback and creates customized learning paths for each student.',
    impact: 'Students using Verbify\'s platform achieve language proficiency 2.3x faster than traditional methods, leading to rapid adoption by educational institutions and 300% year-over-year growth.',
    logo: {
      src: '/partners/verbify-logo.png',
      alt: 'Verbify AI',
      width: 180,
      height: 60
    },
    coverImage: '/partners/language-ai.jpg',
    testimonial: {
      quote: "The flexibility of AI-Model-Hub's platform allowed us to experiment with different model architectures until we found the perfect approach for each language. Their specialized speech recognition models were particularly impressive.",
      author: "Elena Rodriguez",
      position: "Founder & CEO",
      company: "Verbify AI",
      avatar: "/partners/elena-rodriguez.jpg"
    },
    metrics: [
      { value: "2.3x", label: "Faster language acquisition", icon: <Brain className="h-5 w-5 text-purple-400" /> },
      { value: "24", label: "Languages supported", icon: <Globe className="h-5 w-5 text-blue-400" /> },
      { value: "300%", label: "YoY growth", icon: <BarChart className="h-5 w-5 text-green-400" /> }
    ],
    tags: ['Education', 'NLP', 'Speech Recognition'],
    partnerType: "Strategic Alliance",
    featured: false
  }
];

export default function PartnerSuccessStoriesPage() {
  const featuredStories = successStories.filter(story => story.featured);
  const otherStories = successStories.filter(story => !story.featured);
  
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-24">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 to-black pointer-events-none"></div>
        
        {/* Animated particles or grid effect would be added here */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-500 to-cyan-400">
                Partner Success Stories
              </h1>
              
              <p className="text-xl text-gray-300 mb-8">
                Discover how organizations across industries are achieving breakthrough results with our AI platform and partnership program.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link href="/partners">
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    className="flex items-center"
                  >
                    Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
                  </AnimatedButton>
                </Link>
                
                <Link href="#featured-stories">
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="flex items-center"
                  >
                    Explore Stories <ChevronRight className="ml-2 h-5 w-5" />
                  </AnimatedButton>
                </Link>
              </div>
            </motion.div>
            
            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-8 items-center"
            >
              <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                <Award className="h-4 w-4 text-amber-400 mr-2" />
                <span className="text-sm text-gray-300">Industry-recognized results</span>
              </div>
              <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                <Sparkles className="h-4 w-4 text-blue-400 mr-2" />
                <span className="text-sm text-gray-300">Proven ROI across sectors</span>
              </div>
              <div className="flex items-center bg-black/40 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                <Zap className="h-4 w-4 text-purple-400 mr-2" />
                <span className="text-sm text-gray-300">Accelerated innovation</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Stories Section */}
      <section id="featured-stories" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              Featured Partner Success Stories
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              These partners have achieved exceptional results by leveraging our platform and strategic collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {featuredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 shadow-xl"
              >
                {/* Cover image with gradient overlay */}
                <div className="relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10"></div>
                  {/* We would use NextJS Image component with actual images in production */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
                  
                  {/* Company logo */}
                  <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50 z-20">
                    {/* This would be an actual company logo */}
                    <div className="w-36 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md flex items-center justify-center">
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{story.logo.alt}</span>
                    </div>
                  </div>
                  
                  {/* Partner type badge */}
                  <div className="absolute top-4 right-4 bg-violet-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium z-20">
                    {story.partnerType}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-white">{story.title}</h3>
                  <p className="text-gray-300 mb-6">{story.description}</p>
                  
                  {/* Key metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {story.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700/50">
                        <div className="flex justify-center mb-1">
                          {metric.icon}
                        </div>
                        <div className="font-bold text-xl text-white">{metric.value}</div>
                        <div className="text-xs text-gray-400">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {story.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Testimonial preview */}
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 mb-6 relative">
                    <Quote className="absolute top-3 left-3 text-purple-500/20 h-12 w-12" />
                    <p className="text-gray-300 text-sm ml-6 italic line-clamp-2">
                      "{story.testimonial.quote.substring(0, 120)}..."
                    </p>
                  </div>
                  
                  <Link href={`/partners/success-stories/${story.id}`} className="inline-block text-blue-400 hover:text-blue-300 font-medium flex items-center">
                    Read full case study <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Additional Stories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              More Success Stories
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Explore how partners across various industries are achieving their goals through AI innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-800/50 hover:border-gray-700/50 transition-all group"
              >
                {/* Compact card */}
                <div className="relative h-40 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-green-900/20"></div>
                  
                  <div className="absolute bottom-4 left-4 z-20">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{story.title}</h3>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{story.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">{story.partnerType}</div>
                    <Link href={`/partners/success-stories/${story.id}`} className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center">
                      Read more <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-blue-900/20 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-10 border border-gray-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Ready to Write Your Success Story?
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join our partner ecosystem and leverage cutting-edge AI technology to transform your business and industry.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/partners">
                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      className="flex items-center"
                    >
                      Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
                    </AnimatedButton>
                  </Link>
                  
                  <Link href="/marketplace">
                    <AnimatedButton
                      variant="secondary"
                      size="lg"
                      className="flex items-center"
                    >
                      Explore Models <ChevronRight className="ml-2 h-5 w-5" />
                    </AnimatedButton>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 