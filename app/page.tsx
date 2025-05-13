"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpaceBackground from "@/components/SpaceBackground";
import SplashScreen from "@/components/SplashScreen";
import UploadModal from "@/components/UploadModal";
import { FeaturedModels } from "@/components/FeaturedModels";
import Navbar from "@/components/Navbar";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard } from "@/components/ui/animated-card";
import Footer from "@/components/Footer";
import { 
  Upload, Download, CreditCard, Wallet, Repeat, DollarSign, Gift, 
  CheckCircle, ArrowRight, Zap, ChevronRight, Code, Search, Shield
} from 'lucide-react';
import Brand from "@/components/Brand";

export default function HomePage() {
  const [showUpload, setShowUpload] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const featureScrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Hide splash screen after it completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setLoading(false);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);

  // Horizontal scroll for features
  const handleScrollFeatures = (direction: 'left' | 'right') => {
    if (featureScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      featureScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  const features = [
    {
      title: "Upload Your Model Securely",
      description: "Advanced encryption and secure storage for your valuable AI models",
      icon: <Upload className="h-8 w-8 text-blue-400" />,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Test & Demo Before Publishing",
      description: "Let users try your model with custom demo environments",
      icon: <Code className="h-8 w-8 text-green-400" />,
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Sell With Crypto & UPI",
      description: "Multiple payment options including cryptocurrencies and traditional methods",
      icon: <Wallet className="h-8 w-8 text-purple-400" />,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      title: "Permanent Ownership Transfer",
      description: "Blockchain-verified transfer of complete ownership rights",
      icon: <Repeat className="h-8 w-8 text-pink-400" />,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      title: "Earn Royalties on Reuse",
      description: "Continue earning when your model is used in commercial applications",
      icon: <DollarSign className="h-8 w-8 text-amber-400" />,
      gradient: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Animated Background */}
      <SpaceBackground />
      
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 relative overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-600/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-60 -left-20 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-40 right-20 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Large Animated Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <Brand size="lg" className="justify-center" />
              </motion.div>

              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                The Ultimate Platform for
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                  AI Model Sharing & Deployment
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Share, discover, and deploy state-of-the-art AI models with ease. 
                Join the community of creators and innovators shaping the future of AI.
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link 
                  href="/signup" 
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
                >
                  Get Started Free
                </Link>
                <Link 
                  href="/docs" 
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                >
                  View Documentation
                </Link>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">50K+</div>
                  <div className="text-gray-300">Active Users</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="text-3xl font-bold text-blue-400 mb-2">100M+</div>
                  <div className="text-gray-300">API Requests</div>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="text-3xl font-bold text-purple-400 mb-2">10K+</div>
                  <div className="text-gray-300">Models Hosted</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* User Features Carousel */}
        <section className="relative py-16 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Next-Gen AI Model Platform
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to distribute, monetize, and transfer your AI models securely
              </p>
            </motion.div>
            
            <div className="relative">
              {/* Scroll buttons */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
                <button 
                  onClick={() => handleScrollFeatures('left')}
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
                  aria-label="Scroll left"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
              </div>
              
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 hidden md:block">
                <button 
                  onClick={() => handleScrollFeatures('right')}
                  className="bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              {/* Scrolling features */}
              <div 
                ref={featureScrollRef}
                className="flex overflow-x-auto scrollbar-hide gap-6 pb-4 snap-x snap-mandatory"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="min-w-[280px] md:min-w-[350px] snap-center"
                  >
                    <AnimatedCard 
                      className="h-full border border-white/10" 
                      hoverEffect="lift"
                    >
                      <div className="p-6 md:p-8">
                        <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-gray-300 mb-4">{feature.description}</p>
                        <Link href="#" className="inline-flex items-center text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                          Learn more <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Trust Section */}
        <section className="py-16 bg-gradient-to-b from-transparent to-gray-900/50 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Trusted Payment Methods</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Multiple secure payment options to suit your preferences
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center items-center gap-8 mb-16"
            >
              {[
                { name: "PayPal", logo: "/images/paypal.svg", fallback: "💳 PayPal" },
                { name: "Stripe", logo: "/images/stripe.svg", fallback: "💸 Stripe" },
                { name: "Razorpay", logo: "/images/razorpay.svg", fallback: "💰 Razorpay" },
                { name: "Metamask", logo: "/images/metamask.svg", fallback: "🦊 Metamask" },
                { name: "UPI", logo: "/images/upi.svg", fallback: "📱 UPI" },
                { name: "Coinbase", logo: "/images/coinbase.svg", fallback: "🪙 Coinbase" },
              ].map((payment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <div className="h-10 flex items-center justify-center text-lg">
                    {payment.fallback}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Testimonials */}
            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold mb-8 text-center">Creator Success Stories</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Alex Chen",
                    role: "AI Researcher",
                    text: "Neural Nexus made it super easy to monetize my research models. The blockchain-based ownership transfer is a game-changer!",
                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop"
                  },
                  {
                    name: "Priya Sharma",
                    role: "Indie ML Engineer",
                    text: "I've made over $25K selling my computer vision models on Neural Nexus. The platform handles all the payment processing and delivers my models securely.",
                    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop"
                  },
                  {
                    name: "Jamal Washington",
                    role: "AI Startup Founder",
                    text: "We use Neural Nexus to distribute our proprietary models to enterprise clients. The license management and usage analytics are invaluable to our business.",
                    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop"
                  },
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AnimatedCard className="h-full">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-white/20">
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold">{testimonial.name}</h4>
                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-300">{testimonial.text}</p>
                        <div className="mt-4 text-yellow-400 flex">
                          {"★★★★★".split("").map((star, i) => (
                            <span key={i}>{star}</span>
                          ))}
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Models */}
        <FeaturedModels />
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-pink-900/20 backdrop-blur-sm"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                Ready to Join the AI Revolution?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Upload your first AI model in minutes and start earning. Or find the perfect model for your next project.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <AnimatedButton 
                  variant="primary" 
                  size="lg"
                  onClick={() => setShowUpload(true)}
                >
                  <span className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload a Model
                  </span>
                </AnimatedButton>
                <AnimatedButton 
                  variant="outline" 
                  size="lg"
                >
                  <span className="flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    Explore Trending Models
                  </span>
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
          
          {/* Animated particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-10"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Stay In The Neural Loop</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Subscribe to our newsletter for the freshest updates on AI advancements, new models, and exclusive Neural Nexus content
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  aria-label="Email for newsletter"
                />
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg px-6 py-3 font-medium transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-400 text-sm text-center mt-4">
                No spam, just AI vibes. Unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <UploadModal onClose={() => setShowUpload(false)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
} 

// Add these CSS keyframes to your globals.css
// @keyframes blob {
//   0% { transform: translate(0px, 0px) scale(1); }
//   33% { transform: translate(30px, -50px) scale(1.1); }
//   66% { transform: translate(-20px, 20px) scale(0.9); }
//   100% { transform: translate(0px, 0px) scale(1); }
// }
// 
// .animate-blob {
//   animation: blob 7s infinite;
// }
// 
// .animation-delay-2000 {
//   animation-delay: 2s;
// }
// 
// .animation-delay-4000 {
//   animation-delay: 4s;
// }