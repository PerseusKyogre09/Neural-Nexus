"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ArrowRight, 
  X, 
  CheckCircle, 
  ChevronLeft,
  Send,
  Sparkles,
  Zap,
  Globe,
  Code,
  Server
} from 'lucide-react';
import Image from 'next/image';

export default function PartnersPage() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    partnershipType: 'technology',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        company: '',
        partnershipType: 'technology',
        message: ''
      });
    } catch (error) {
      setFormStatus('error');
    }
  };

  // Major partners data with logos
  const majorPartners = [
    { 
      name: "Google", 
      logo: "/partners/google.svg", 
      description: "Strategic AI research partner, collaborating on foundational models and ethical AI development frameworks." 
    },
    { 
      name: "Microsoft", 
      logo: "/partners/microsoft.svg", 
      description: "Infrastructure partner providing cloud computing resources and integration with Azure AI services." 
    },
    { 
      name: "NVIDIA", 
      logo: "/partners/nvidia.svg", 
      description: "Hardware acceleration partner, optimizing models for NVIDIA GPUs and providing specialized training resources." 
    },
    { 
      name: "OpenAI", 
      logo: "/partners/openai.svg", 
      description: "Research collaboration partner focusing on responsible AI deployment and interoperability standards." 
    },
    { 
      name: "IBM", 
      logo: "/partners/ibm.svg", 
      description: "Enterprise integration partner helping businesses adopt and implement AI solutions at scale." 
    },
    { 
      name: "Meta", 
      logo: "/partners/meta.svg", 
      description: "Research partner specializing in multimodal AI models and social interaction understanding systems." 
    }
  ];

  // Other partners list with logos
  const otherPartners = [
    { name: "GitHub", logo: "/partners/github.svg" },
    { name: "Redis", logo: "/partners/redis.svg" },
    { name: "AWS", logo: "/partners/aws.svg" },
    { name: "Coinbase", logo: "/partners/coinbase.svg" },
    { name: "MetaMask", logo: "/partners/metamask.svg" },
    { name: "WalletConnect", logo: "/partners/walletconnect.svg" }
  ];

  // Partnership types
  const partnershipTypes = [
    {
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      name: "Technology Partner",
      description: "Ideal for companies offering complementary technology that enhances our platform.",
      benefits: [
        "API integration priority",
        "Co-marketing opportunities",
        "Joint webinars and events",
        "Featured listing in our marketplace"
      ]
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-400" />,
      name: "Research Partner",
      description: "For academic institutions and research labs working on cutting-edge AI research.",
      benefits: [
        "Access to exclusive datasets",
        "Research collaboration opportunities",
        "Publishing support",
        "Academic discounts for platform usage"
      ]
    },
    {
      icon: <Code className="h-6 w-6 text-green-400" />,
      name: "Solution Partner",
      description: "For consultants and system integrators who implement AI solutions for clients.",
      benefits: [
        "Implementation certification",
        "Lead sharing opportunities",
        "Training and enablement resources",
        "Partner portal access"
      ]
    },
    {
      icon: <Server className="h-6 w-6 text-amber-400" />,
      name: "Strategic Alliance",
      description: "Deep, multi-faceted partnerships aligned on long-term industry transformation.",
      benefits: [
        "Executive sponsorship",
        "Joint product roadmap influence",
        "Co-innovation lab access",
        "Exclusive event participation"
      ]
    }
  ];

  const partnershipProcess = [
    {
      title: "Initial Contact",
      description: "Fill out our partnership inquiry form, and our partnership team will reach out within 48 hours."
    },
    {
      title: "Discovery Session",
      description: "We'll schedule a call to understand your business, technology, and how we might collaborate."
    },
    {
      title: "Partnership Proposal",
      description: "Our team will prepare a customized partnership proposal based on mutual objectives."
    },
    {
      title: "Agreement & Onboarding",
      description: "Once terms are finalized, we'll execute the agreement and begin the onboarding process."
    },
    {
      title: "Launch & Growth",
      description: "We'll work together to announce the partnership and develop a plan for ongoing collaboration."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2 
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-teal-500/20 rounded-full filter blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ 
              duration: 9, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 4 
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="/" 
                className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
              </Link>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-blue-500 to-cyan-400">
                Our Partners
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We collaborate with industry leaders to build the future of AI model distribution and deployment.
              Join our growing ecosystem of technology partners and innovators.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Major Partners Section */}
      <section className="py-20 px-4 bg-black/50">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Major Partners
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majorPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(123, 97, 255, 0.3)" }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-purple-500/50 transition-all"
              >
                <div className="h-20 mb-4 flex items-center">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name} 
                    width={160} 
                    height={80} 
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{partner.name}</h3>
                <p className="text-gray-400">{partner.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Partners */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto">
          <motion.h2 
            className="text-2xl font-bold mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Growing Partner Ecosystem
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
            {otherPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  filter: "grayscale(0)",
                  transition: { duration: 0.2 }
                }}
                className="flex justify-center"
              >
                <div className="w-32 h-20 flex items-center justify-center filter grayscale hover:grayscale-0 transition-all duration-300 hover:drop-shadow-glow">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name} 
                    width={100} 
                    height={60}
                    className="object-contain" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-20 px-4 bg-black/50">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Partnership Types</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We offer several types of partnerships to suit different organizations and goals.
              Find the right fit for your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(123, 97, 255, 0.2)"
                }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center mr-4">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{type.name}</h3>
                </div>
                <p className="text-gray-400 mb-4">{type.description}</p>
                <h4 className="text-sm uppercase text-gray-500 mb-2">Benefits:</h4>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Partnership Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A straightforward process to establish a productive partnership
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-cyan-500 to-blue-700 rounded"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            
            {/* Process Steps */}
            <div className="space-y-20 relative">
              {partnershipProcess.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-16 text-right' : 'pl-16 text-left'}`}>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  
                  <motion.div 
                    className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-blue-500/30"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.5 + index * 0.2,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <span className="text-white font-bold">{index + 1}</span>
                  </motion.div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-violet-900/30 to-blue-900/30">
        <div className="container mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Partner With Us?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Take the first step towards a transformative partnership that will help shape the future of AI.
            </p>
            <motion.button
              onClick={() => setShowContactForm(true)}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Contact Our Partnership Team
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => formStatus !== 'submitting' && setShowContactForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => formStatus !== 'submitting' && setShowContactForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                disabled={formStatus === 'submitting'}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold mb-4">Partnership Inquiry</h3>
              
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-2">Thank You!</h4>
                  <p className="text-gray-400 mb-6">
                    Your partnership inquiry has been received. Our team will get back to you within 48 hours.
                  </p>
                  <motion.button
                    onClick={() => {
                      setShowContactForm(false);
                      setFormStatus('idle');
                    }}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Partnership Type</label>
                      <select
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                      >
                        <option value="technology">Technology Partner</option>
                        <option value="research">Research Partner</option>
                        <option value="solution">Solution Partner</option>
                        <option value="alliance">Strategic Alliance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={formStatus === 'submitting'}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.button
                      type="button"
                      onClick={() => formStatus !== 'submitting' && setShowContactForm(false)}
                      className="px-4 py-2 mr-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                      disabled={formStatus === 'submitting'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center"
                      disabled={formStatus === 'submitting'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                          </span>
                          Submitting...
                        </>
                      ) : (
                        <>Send Inquiry <Send className="ml-2 w-4 h-4" /></>
                      )}
                    </motion.button>
                  </div>
                  
                  {formStatus === 'error' && (
                    <div className="mt-4 text-red-500 text-sm">
                      There was an error submitting your inquiry. Please try again.
                    </div>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
} 