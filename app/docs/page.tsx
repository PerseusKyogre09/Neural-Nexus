"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Book, Code, Download, Server, Shield, Zap, CreditCard, Upload } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  // Toggle section visibility
  const toggleSection = (section: string) => {
    setActiveSection(section === activeSection ? '' : section);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      {/* Documentation Header */}
      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
            Documentation & Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about uploading, monetizing, and transferring AI models on Neural Nexus.
          </p>
        </div>
      </section>

      {/* Docs Content */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 sticky top-24">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Book className="mr-2 h-5 w-5 text-purple-400" />
                  Documentation
                </h3>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block px-3 py-2 rounded-lg transition-all text-sm ${
                        activeSection === item.id
                          ? "bg-purple-600/20 text-purple-400 font-medium"
                          : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSection(item.id);
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activeSection === item.id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Getting Started */}
              <DocSection
                id="getting-started"
                title="Getting Started"
                icon={<Zap className="h-6 w-6 text-yellow-400" />}
                isActive={activeSection === 'getting-started'}
              >
                <h3 className="text-xl font-medium mb-3 text-yellow-300">Welcome to Neural Nexus</h3>
                <p className="mb-4">
                  Neural Nexus is the next-gen marketplace for AI models, designed for creators who want to monetize their ML creations and for users who need specialized models for their applications.
                </p>
                
                <div className="mb-6 space-y-4">
                  <h4 className="text-lg font-medium text-purple-300">What you can do:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><span className="text-green-400 font-medium">Upload</span> - Share your trained AI models with the world</li>
                    <li><span className="text-blue-400 font-medium">Sell</span> - Set pricing and receive payments in crypto or fiat</li>
                    <li><span className="text-pink-400 font-medium">Transfer</span> - Full ownership transfers via blockchain verification</li>
                    <li><span className="text-yellow-400 font-medium">Earn Royalties</span> - Get paid when your models are used commercially</li>
                  </ul>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="font-medium text-white mb-2">🔥 Quick Start</h4>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Create an account or connect your wallet</li>
                    <li>Upload your model files (weights, config, etc.)</li>
                    <li>Set your pricing and licensing details</li>
                    <li>Publish to make your model available globally</li>
                  </ol>
                </div>
              </DocSection>

              {/* Upload Process */}
              <DocSection
                id="upload-process"
                title="Model Upload Process"
                icon={<Upload className="h-6 w-6 text-blue-400" />}
                isActive={activeSection === 'upload-process'}
              >
                <h3 className="text-xl font-medium mb-3 text-blue-300">Uploading Your AI Models</h3>
                <p className="mb-4">
                  Our secure upload process ensures your intellectual property is protected while making it accessible to potential buyers.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-purple-300 mb-3">Supported Formats:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex items-center">
                      <span className="text-pink-400 font-mono text-sm mr-2">*.pt / *.pth</span>
                      <span className="text-gray-400 text-sm">PyTorch Models</span>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex items-center">
                      <span className="text-blue-400 font-mono text-sm mr-2">*.h5 / *.keras</span>
                      <span className="text-gray-400 text-sm">Keras/TensorFlow Models</span>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex items-center">
                      <span className="text-green-400 font-mono text-sm mr-2">*.onnx</span>
                      <span className="text-gray-400 text-sm">ONNX Format</span>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 flex items-center">
                      <span className="text-yellow-400 font-mono text-sm mr-2">*.safetensors</span>
                      <span className="text-gray-400 text-sm">SafeTensors Format</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-medium text-purple-300">Step-by-Step Process:</h4>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                    <h5 className="font-medium text-green-400">1. Model Preparation</h5>
                    <p className="text-sm text-gray-300">Prepare your model files including weights, configuration files, and any necessary documentation.</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                    <h5 className="font-medium text-green-400">2. Upload & Metadata</h5>
                    <p className="text-sm text-gray-300">Upload your files and add descriptive metadata like model architecture, training dataset, and performance metrics.</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                    <h5 className="font-medium text-green-400">3. Demonstration</h5>
                    <p className="text-sm text-gray-300">Create an interactive demo of your model that potential buyers can test before purchasing.</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-2">
                    <h5 className="font-medium text-green-400">4. Set Terms & Pricing</h5>
                    <p className="text-sm text-gray-300">Define your licensing terms, pricing model, and whether you want to enable royalties.</p>
                  </div>
                </div>
              </DocSection>

              {/* Payment & Monetization */}
              <DocSection
                id="payment-monetization"
                title="Payment & Monetization"
                icon={<CreditCard className="h-6 w-6 text-green-400" />}
                isActive={activeSection === 'payment-monetization'}
              >
                <h3 className="text-xl font-medium mb-3 text-green-300">Monetizing Your AI Models</h3>
                <p className="mb-4">
                  Neural Nexus offers flexible monetization options so you can choose how to sell your models.
                </p>
                
                <div className="mb-6 space-y-4">
                  <h4 className="text-lg font-medium text-purple-300">Pricing Models:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h5 className="font-medium text-pink-400 mb-2">One-Time Purchase</h5>
                      <p className="text-sm text-gray-300">Set a fixed price for a permanent license to use your model.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h5 className="font-medium text-blue-400 mb-2">Subscription Access</h5>
                      <p className="text-sm text-gray-300">Offer monthly/yearly access to your model and updates.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h5 className="font-medium text-yellow-400 mb-2">Usage-Based</h5>
                      <p className="text-sm text-gray-300">Charge based on API calls or inference requests made.</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <h5 className="font-medium text-green-400 mb-2">Royalty Model</h5>
                      <p className="text-sm text-gray-300">Earn a percentage when your model is used in commercial applications.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-purple-300 mb-3">Payment Methods:</h4>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <ul className="grid grid-cols-2 gap-2">
                      <li className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        Ethereum (ETH)
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                        Bitcoin (BTC)
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Credit/Debit Cards
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                        PayPal
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                        UPI (India)
                      </li>
                      <li className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                        Bank Transfer
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-700/50">
                  <h4 className="font-medium text-white mb-2">💸 Platform Fees</h4>
                  <p className="text-sm">Neural Nexus takes a 5% commission on all sales, with reduced rates for high-volume creators.</p>
                </div>
              </DocSection>

              {/* API Access */}
              <DocSection
                id="api-access"
                title="API Access"
                icon={<Server className="h-6 w-6 text-purple-400" />}
                isActive={activeSection === 'api-access'}
              >
                <h3 className="text-xl font-medium mb-3 text-purple-300">API Integration</h3>
                <p className="mb-4">
                  Access models programmatically and integrate them into your applications with our RESTful API.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-purple-300 mb-3">Authentication:</h4>
                  <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-green-400">
                      # Get your API key from Dashboard &gt; Settings &gt; API Keys
                      <br/>
                      curl -X POST https://api.neuralnexus.ai/v1/auth 
                      <br/>  -H "Content-Type: application/json" 
                      <br/>  -d '&#123; "api_key": "your_api_key" &#125;'
                    </pre>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-purple-300 mb-3">Model Inference Example:</h4>
                  <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                    <pre className="text-blue-400">
                      # Make a prediction using a model
                      <br/>
                      curl -X POST https://api.neuralnexus.ai/v1/models/MODEL_ID/predict 
                      <br/>  -H "Authorization: Bearer YOUR_TOKEN" 
                      <br/>  -H "Content-Type: application/json" 
                      <br/>  -d '&#123; "inputs": "Your input data here" &#125;'
                    </pre>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="font-medium text-white mb-2">Available Endpoints</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs font-mono mr-2 mt-0.5">GET</span>
                      <div>
                        <code className="text-purple-300">/v1/models</code>
                        <p className="text-gray-400">List available models</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs font-mono mr-2 mt-0.5">POST</span>
                      <div>
                        <code className="text-purple-300">/v1/models/{'{'}id{'}'}/predict</code>
                        <p className="text-gray-400">Run inference on a specific model</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-yellow-900/50 text-yellow-400 px-2 py-1 rounded text-xs font-mono mr-2 mt-0.5">GET</span>
                      <div>
                        <code className="text-purple-300">/v1/models/{'{'}id{'}'}</code>
                        <p className="text-gray-400">Get model details and metadata</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </DocSection>

              {/* Security & Ownership */}
              <DocSection
                id="security-ownership"
                title="Security & Ownership"
                icon={<Shield className="h-6 w-6 text-red-400" />}
                isActive={activeSection === 'security-ownership'}
              >
                <h3 className="text-xl font-medium mb-3 text-red-300">Protecting Your Intellectual Property</h3>
                <p className="mb-4">
                  Neural Nexus uses blockchain technology to verify ownership and facilitate secure transfers.
                </p>
                
                <div className="mb-6 space-y-4">
                  <h4 className="text-lg font-medium text-purple-300">Ownership Verification:</h4>
                  <p>
                    When you upload a model, we create a unique digital fingerprint that gets recorded on the blockchain. This serves as proof of your original ownership.
                  </p>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h5 className="font-medium text-yellow-400 mb-2">How it works:</h5>
                    <ol className="list-decimal pl-6 space-y-1 text-sm">
                      <li>We generate a cryptographic hash of your model</li>
                      <li>This hash is recorded on the blockchain as an NFT</li>
                      <li>The NFT contains metadata about your model and licensing terms</li>
                      <li>When ownership transfers, the blockchain record updates</li>
                    </ol>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg p-4 border border-red-700/50 mb-6">
                  <h4 className="font-medium text-white mb-2">🔒 Security Measures</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>End-to-end encryption for all uploaded model files</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>Access control with granular permissions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>Audit trails for all access and download events</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      <span>Digital watermarking of models to detect unauthorized use</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-purple-300 mb-3">License Enforcement:</h4>
                  <p className="mb-3">
                    We provide tools to help enforce your licensing terms and track usage of your models:
                  </p>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Automated license validation on model use</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Usage analytics to track deployments</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Legal templates for different licensing types</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Dispute resolution system</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </DocSection>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Documentation Section Component
function DocSection({
  id,
  title,
  icon,
  isActive,
  children
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      className={`mb-10 border border-gray-700/50 rounded-xl overflow-hidden transition-all ${
        isActive ? "bg-gray-800/30" : "bg-gray-800/10"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`flex items-center justify-between p-5 cursor-pointer border-b ${
          isActive ? "border-gray-700/50 bg-gray-800/50" : "border-transparent"
        }`}
      >
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <ChevronDown
          className={`h-6 w-6 transition-transform ${
            isActive ? "rotate-180 text-purple-400" : "text-gray-400"
          }`}
        />
      </div>
      
      {isActive && (
        <div className="p-6">
          {children}
        </div>
      )}
    </motion.div>
  );
}

// Define the navigation items
const navItems = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Zap className="h-4 w-4 text-yellow-400" />,
  },
  {
    id: "upload-process",
    title: "Upload Process",
    icon: <Upload className="h-4 w-4 text-blue-400" />,
  },
  {
    id: "payment-monetization",
    title: "Payment & Monetization",
    icon: <CreditCard className="h-4 w-4 text-green-400" />,
  },
  {
    id: "api-access",
    title: "API Access",
    icon: <Server className="h-4 w-4 text-purple-400" />,
  },
  {
    id: "security-ownership",
    title: "Security & Ownership",
    icon: <Shield className="h-4 w-4 text-red-400" />,
  },
]; 