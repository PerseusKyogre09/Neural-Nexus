import React, { useState } from 'react';
import { Search, Brain, Download, BarChart3, CreditCard, Grid, Star, TrendingUp } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from './components/ui/Card';
import { SearchInput } from './components/ui/Input';
import { Badge } from './components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/ui/Table';
import { Modal } from './components/ui/Modal';
import { Skeleton, SkeletonCard } from './components/ui/Skeleton';
import './styles/animations.css';
import './styles/theme.css';

// Mock data for demonstration
const featuredModels = [
  {
    id: 1,
    name: "GPT-X Advanced",
    description: "State-of-the-art language model for natural text generation",
    metrics: { accuracy: "98%", speed: "45ms" },
    price: "2999",
    category: "Language",
    downloads: "2.3k",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    name: "Vision Pro AI",
    description: "Computer vision model for real-time object detection",
    metrics: { accuracy: "96%", speed: "30ms" },
    price: "1999",
    category: "Vision",
    downloads: "1.8k",
    image: "https://images.unsplash.com/photo-1676320831998-21293778f2d7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    name: "AudioNet Elite",
    description: "Advanced audio processing and recognition model",
    metrics: { accuracy: "97%", speed: "25ms" },
    price: "2499",
    category: "Audio",
    downloads: "1.5k",
    image: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?auto=format&fit=crop&q=80&w=400"
  }
];

const categories = ["All", "Language", "Vision", "Audio", "Reinforcement", "Generative"];

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">AI Model Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-300">Dashboard</Button>
              <Button variant="ghost" className="text-gray-300">Models</Button>
              <Button
                variant="primary"
                leftIcon={<Grid className="w-4 h-4" />}
                onClick={() => setIsModalOpen(true)}
              >
                Upload Model
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center animate-slide-in">
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover Premium AI Models
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Access state-of-the-art AI models for your projects
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Models */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Featured Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredModels.map((model) => (
            <Card key={model.id} hover className="animate-fade-in">
              <img src={model.image} alt={model.name} className="w-full h-48 object-cover" />
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{model.name}</h3>
                  <Badge variant="info">{model.category}</Badge>
                </div>
                <p className="text-gray-400 mb-4">{model.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-gray-300 text-sm">{model.metrics.accuracy}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 text-blue-500 mr-1" />
                      <span className="text-gray-300 text-sm">{model.downloads}</span>
                    </div>
                  </div>
                  <div className="text-white font-bold">${model.price}</div>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download Model
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Downloads</h3>
                <Download className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-gray-400">Active model downloads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Usage</h3>
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">89%</p>
              <p className="text-gray-400">Average model usage</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Billing</h3>
                <CreditCard className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-white">$299</p>
              <p className="text-gray-400">Current month spending</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Model Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload New Model"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Share your AI model with the community. Fill in the details below to get started.
          </p>
          <form className="space-y-4">
            {/* Form content would go here */}
          </form>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-blue-500" />
              <span className="ml-2 text-white font-medium">AI Model Hub</span>
            </div>
            <p className="text-gray-400">© 2024 AI Model Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;