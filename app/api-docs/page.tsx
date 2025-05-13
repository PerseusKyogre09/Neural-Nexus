"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Server, 
  Lock, 
  Key, 
  BookOpen, 
  Zap, 
  HardDrive, 
  Cloud, 
  CheckCircle, 
  Copy, 
  Terminal,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ApiDocsPage = () => {
  const [activeEndpoint, setActiveEndpoint] = useState("authentication");
  const [copiedSnippet, setCopiedSnippet] = useState("");
  const [showRateLimitInfo, setShowRateLimitInfo] = useState(false);
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(""), 2000);
  };

  const endpoints = [
    {
      id: "authentication",
      name: "Authentication",
      icon: <Lock className="w-5 h-5" />,
      description: "Secure API access with API keys and tokens",
      snippet: `// Get your API key from the dashboard
const API_KEY = "your_api_key_here";

// Include it in your requests
fetch("https://api.aimodelhub.com/v1/models", {
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`,
    "Content-Type": "application/json"
  }
})`,
      response: `{
  "status": "success",
  "authenticated": true,
  "user": {
    "id": "usr_12345",
    "plan": "pro",
    "rate_limits": {
      "requests_per_min": 60,
      "requests_per_day": 10000
    }
  }
}`
    },
    {
      id: "models",
      name: "Models",
      icon: <HardDrive className="w-5 h-5" />,
      description: "Browse, search, and get details about available models",
      snippet: `// List all available models
fetch("https://api.aimodelhub.com/v1/models", {
  headers: {
    "Authorization": "Bearer your_api_key_here"
  }
})

// Get specific model details
fetch("https://api.aimodelhub.com/v1/models/model_123456", {
  headers: {
    "Authorization": "Bearer your_api_key_here"
  }
})`,
      response: `{
  "models": [
    {
      "id": "model_123456",
      "name": "VibeGPT-7B",
      "type": "text-generation",
      "creator": "aimodelhub",
      "version": "1.0.0",
      "description": "Slay your text generation needs with this lit model",
      "parameters": "7B",
      "created_at": "2023-09-15T12:00:00Z"
    },
    // More models...
  ],
  "total": 42,
  "page": 1,
  "page_size": 10
}`
    },
    {
      id: "inference",
      name: "Inference",
      icon: <Zap className="w-5 h-5" />,
      description: "Run models with your input data and get predictions",
      snippet: `// Text generation
fetch("https://api.aimodelhub.com/v1/inference/text", {
  method: "POST",
  headers: {
    "Authorization": "Bearer your_api_key_here",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "VibeGPT-7B",
    prompt: "Write a tweet about AI that would go viral:",
    max_tokens: 100,
    temperature: 0.7
  })
})`,
      response: `{
  "id": "gen_789012",
  "model": "VibeGPT-7B",
  "created_at": "2023-10-05T15:32:10Z",
  "result": "just watched my AI assistant roast my code review so hard the git repo caught fire 🔥 no notes, only emotional damage #AIRevolution #DevLife",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 24,
    "total_tokens": 34
  }
}`
    },
    {
      id: "upload",
      name: "Upload",
      icon: <Cloud className="w-5 h-5" />,
      description: "Upload and manage your custom models",
      snippet: `// Upload a new model (multipart form data)
const formData = new FormData();
formData.append("name", "MyCustomModel");
formData.append("description", "This model classifies vibes");
formData.append("model_file", modelFileBlob);
formData.append("type", "classification");

fetch("https://api.aimodelhub.com/v1/models/upload", {
  method: "POST",
  headers: {
    "Authorization": "Bearer your_api_key_here"
  },
  body: formData
})`,
      response: `{
  "id": "model_abcdef",
  "name": "MyCustomModel",
  "status": "processing",
  "upload_progress": 100,
  "processing_progress": 0,
  "estimated_completion": "2023-10-05T16:10:00Z",
  "webhook_url": "https://your-webhook.com/model-ready"
}`
    },
    {
      id: "webhooks",
      name: "Webhooks",
      icon: <Server className="w-5 h-5" />,
      description: "Set up notifications for model events",
      snippet: `// Register a new webhook
fetch("https://api.aimodelhub.com/v1/webhooks", {
  method: "POST",
  headers: {
    "Authorization": "Bearer your_api_key_here",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "url": "https://your-webhook.com/model-events",
    "events": ["model.ready", "model.failed", "inference.completed"],
    "secret": "your_webhook_secret"
  })
})`,
      response: `{
  "id": "webhook_54321",
  "url": "https://your-webhook.com/model-events",
  "events": ["model.ready", "model.failed", "inference.completed"],
  "created_at": "2023-10-05T14:25:30Z",
  "status": "active"
}`
    }
  ];

  const apiFeatures = [
    {
      title: "Real-time Inference",
      icon: <Terminal className="w-10 h-10 text-purple-400" />,
      description: "Run models in milliseconds with our optimized inference pipeline"
    },
    {
      title: "Flexible Hosting",
      icon: <Cloud className="w-10 h-10 text-blue-400" />,
      description: "Deploy models on our infrastructure or integrate with your own"
    },
    {
      title: "Secure Access",
      icon: <Lock className="w-10 h-10 text-teal-400" />,
      description: "Enterprise-grade security with role-based access controls"
    },
    {
      title: "Detailed Analytics",
      icon: <Zap className="w-10 h-10 text-amber-400" />,
      description: "Track usage, performance metrics, and costs in real-time"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Code className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            AI Model Hub API
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Slay your AI game with our developer-friendly API. Build, deploy, and scale AI models without the struggle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-medium transition-all transform hover:scale-105">
              Get Your API Key
            </Link>
            <button 
              onClick={() => copyToClipboard("npm install @aimodelhub/sdk", "sdk-install")}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-all flex items-center gap-2"
            >
              {copiedSnippet === "sdk-install" ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  npm install @aimodelhub/sdk
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* API Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {apiFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Rate Limits Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowRateLimitInfo(!showRateLimitInfo)}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-semibold">Rate Limits & Pricing</h3>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${showRateLimitInfo ? 'rotate-180' : ''}`} />
            </div>
            
            {showRateLimitInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 text-gray-300"
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="px-4 py-3 text-left">Plan</th>
                        <th className="px-4 py-3 text-left">Requests/min</th>
                        <th className="px-4 py-3 text-left">Requests/day</th>
                        <th className="px-4 py-3 text-left">Models</th>
                        <th className="px-4 py-3 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700/50">
                        <td className="px-4 py-3">Free</td>
                        <td className="px-4 py-3">10</td>
                        <td className="px-4 py-3">1,000</td>
                        <td className="px-4 py-3">Public only</td>
                        <td className="px-4 py-3">$0</td>
                      </tr>
                      <tr className="border-b border-gray-700/50">
                        <td className="px-4 py-3">Pro</td>
                        <td className="px-4 py-3">60</td>
                        <td className="px-4 py-3">10,000</td>
                        <td className="px-4 py-3">Public + Pro</td>
                        <td className="px-4 py-3">$49/mo</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Enterprise</td>
                        <td className="px-4 py-3">Unlimited</td>
                        <td className="px-4 py-3">Unlimited</td>
                        <td className="px-4 py-3">All + Custom</td>
                        <td className="px-4 py-3">Contact Us</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  Exceeding rate limits will result in 429 (Too Many Requests) responses. Upgrade your plan for higher limits.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* API Documentation */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:w-64 lg:w-72 shrink-0"
          >
            <div className="sticky top-24 p-5 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Endpoints
              </h3>
              <ul className="space-y-2">
                {endpoints.map(endpoint => (
                  <li key={endpoint.id}>
                    <button
                      onClick={() => setActiveEndpoint(endpoint.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        activeEndpoint === endpoint.id 
                          ? "bg-purple-500/20 text-purple-400 border-l-2 border-purple-500" 
                          : "hover:bg-gray-700/50"
                      }`}
                    >
                      {endpoint.icon}
                      <span>{endpoint.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-medium mb-2">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Full Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Client SDKs
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Key Management
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex-1"
          >
            {endpoints.map(endpoint => (
              <div 
                key={endpoint.id} 
                className={activeEndpoint === endpoint.id ? "block" : "hidden"}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    {endpoint.icon}
                    {endpoint.name}
                  </h2>
                  <p className="text-gray-300 text-lg">{endpoint.description}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Request Example</h3>
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-gray-900 overflow-x-auto font-mono text-sm">
                      <code>{endpoint.snippet}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(endpoint.snippet, `snippet-${endpoint.id}`)}
                      className="absolute top-3 right-3 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                      aria-label="Copy code"
                    >
                      {copiedSnippet === `snippet-${endpoint.id}` ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Response Example</h3>
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-gray-900 overflow-x-auto font-mono text-sm">
                      <code>{endpoint.response}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(endpoint.response, `response-${endpoint.id}`)}
                      className="absolute top-3 right-3 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                      aria-label="Copy code"
                    >
                      {copiedSnippet === `response-${endpoint.id}` ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Endpoint Details</h3>
                  <div className="p-5 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                    <table className="w-full text-left">
                      <tbody>
                        <tr className="border-b border-gray-700/50">
                          <td className="py-3 pr-4 font-medium">URL</td>
                          <td className="py-3 font-mono text-sm text-green-400">
                            {endpoint.id === "authentication" && "https://api.aimodelhub.com/v1/auth"}
                            {endpoint.id === "models" && "https://api.aimodelhub.com/v1/models"}
                            {endpoint.id === "inference" && "https://api.aimodelhub.com/v1/inference/text"}
                            {endpoint.id === "upload" && "https://api.aimodelhub.com/v1/models/upload"}
                            {endpoint.id === "webhooks" && "https://api.aimodelhub.com/v1/webhooks"}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-700/50">
                          <td className="py-3 pr-4 font-medium">Method</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-sm">
                              {endpoint.id === "authentication" ? "GET" : 
                               endpoint.id === "models" ? "GET" : "POST"}
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-700/50">
                          <td className="py-3 pr-4 font-medium">Rate Limit</td>
                          <td className="py-3">
                            {endpoint.id === "inference" ? "30 requests/minute" : "60 requests/minute"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 font-medium">Authentication</td>
                          <td className="py-3">Required (API Key)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="max-w-3xl mx-auto p-8 rounded-xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20">
            <h2 className="text-3xl font-bold mb-4">Ready to build something fire?</h2>
            <p className="text-gray-300 mb-6">
              Get your API key today and start building AI-powered experiences that'll make your users say "no cap frfr"
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full font-medium transition-all transform hover:scale-105">
                Get Started Free
              </Link>
              <Link href="/contact" className="px-8 py-3 bg-transparent hover:bg-gray-800 border border-purple-500 rounded-full font-medium transition-all">
                Talk to Sales
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ApiDocsPage; 