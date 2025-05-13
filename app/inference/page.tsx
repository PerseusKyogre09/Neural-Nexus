"use client";

import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Play, 
  Code, 
  Settings, 
  Download, 
  Copy, 
  Check,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Save,
  FileJson,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function InferencePage() {
  // Gen-Z style variable names
  const [textPrompt, setTextPrompt] = useState('Write a short poem about artificial intelligence');
  const [imgPrompt, setImgPrompt] = useState('A futuristic cityscape with flying cars and neon lights');
  const [audioPrompt, setAudioPrompt] = useState('A calm female voice explaining quantum computing');
  const [activeModel, setActiveModel] = useState('gpt-nexus');
  const [responseVibe, setResponseVibe] = useState<string | null>(null);
  const [vibeCheck, setVibeCheck] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'audio'>('text');
  const [tempSlider, setTempSlider] = useState(0.7);
  const [maxLength, setMaxLength] = useState(100);
  const [copied, setCopied] = useState(false);
  const [showParams, setShowParams] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  // Models available for each mode
  const textModels = [
    { id: 'gpt-nexus', name: 'GPT Nexus', description: 'Fast and versatile text generation model' },
    { id: 'gpt-nexus-pro', name: 'GPT Nexus Pro', description: 'Advanced reasoning capabilities' },
    { id: 'llama-nexus', name: 'Llama Nexus', description: 'Open source alternative with broad knowledge' },
  ];
  
  const imageModels = [
    { id: 'stability-xl', name: 'Stability XL', description: 'High quality image generation' },
    { id: 'neural-diffusion', name: 'Neural Diffusion', description: 'Fast and creative image synthesis' },
    { id: 'dalle-nexus', name: 'DALL-E Nexus', description: 'Photorealistic image generation' },
  ];
  
  const audioModels = [
    { id: 'voice-gen', name: 'VoiceGen', description: 'Natural-sounding text-to-speech' },
    { id: 'music-nexus', name: 'Music Nexus', description: 'Music generation from text descriptions' },
    { id: 'sound-synth', name: 'Sound Synth', description: 'Sound effect synthesis' },
  ];

  // Mock request history
  const requestHistory = [
    { id: 1, type: 'text', prompt: 'Write a short story about robots', model: 'gpt-nexus', timestamp: '2 min ago' },
    { id: 2, type: 'image', prompt: 'A cat in a spaceship', model: 'stability-xl', timestamp: '15 min ago' },
    { id: 3, type: 'text', prompt: 'Explain quantum computing', model: 'gpt-nexus-pro', timestamp: '1 hour ago' },
  ];

  // Get active model options based on tab
  const getActiveModels = () => {
    switch(activeTab) {
      case 'text': return textModels;
      case 'image': return imageModels;
      case 'audio': return audioModels;
      default: return textModels;
    }
  };

  // Get current prompt based on tab
  const getCurrentPrompt = () => {
    switch(activeTab) {
      case 'text': return textPrompt;
      case 'image': return imgPrompt;
      case 'audio': return audioPrompt;
      default: return textPrompt;
    }
  };

  // Set current prompt based on tab
  const setCurrentPrompt = (value: string) => {
    switch(activeTab) {
      case 'text': setTextPrompt(value); break;
      case 'image': setImgPrompt(value); break;
      case 'audio': setAudioPrompt(value); break;
    }
  };

  // Simulate API call
  const runInference = async () => {
    setVibeCheck('loading');
    setResponseVibe(null);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses
    const mockResponses: Record<string, string> = {
      text: `Circuits of wonder, minds of light,
Silicon dreams taking flight.
Thought patterns in digital streams,
Intelligence beyond our wildest dreams.

Neural networks grow and learn,
For human-like thought they yearn.
In the dance of ones and zeros bright,
A new form of consciousness takes flight.`,
      image: '[Image would be displayed here]',
      audio: '[Audio would be played here]'
    };
    
    setResponseVibe(mockResponses[activeTab]);
    setVibeCheck('success');
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    if (responseVibe) {
      navigator.clipboard.writeText(responseVibe);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Switch model when changing tabs if current model isn't valid for the new tab
  const handleTabChange = (tab: 'text' | 'image' | 'audio') => {
    setActiveTab(tab);
    
    // Check if current model is valid for the new tab
    const validModels = tab === 'text' ? textModels : tab === 'image' ? imageModels : audioModels;
    const isCurrentModelValid = validModels.some(model => model.id === activeModel);
    
    if (!isCurrentModelValid) {
      setActiveModel(validModels[0].id);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />

      <section className="pt-28 pb-10 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Inference API Playground
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Test our models directly in your browser before integrating them into your app
          </motion.p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-700/50">
              <TabButton 
                active={activeTab === 'text'} 
                onClick={() => handleTabChange('text')}
                label="Text Generation"
                icon={<Code className="h-4 w-4" />}
              />
              <TabButton 
                active={activeTab === 'image'} 
                onClick={() => handleTabChange('image')}
                label="Image Generation"
                icon={<Sparkles className="h-4 w-4" />}
              />
              <TabButton 
                active={activeTab === 'audio'} 
                onClick={() => handleTabChange('audio')}
                label="Audio Generation" 
                icon={<Settings className="h-4 w-4" />}
              />
            </div>
            
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Input & Config */}
                <div className="lg:w-1/2 space-y-4">
                  {/* Model Selector */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Model
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full bg-gray-900/70 border border-gray-700 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={activeModel}
                        onChange={(e) => setActiveModel(e.target.value)}
                      >
                        {getActiveModels().map(model => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {/* Model description */}
                    <div className="mt-2 text-sm text-gray-400">
                      {getActiveModels().find(m => m.id === activeModel)?.description}
                    </div>
                  </div>
                  
                  {/* Prompt Input */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Prompt
                    </label>
                    <textarea 
                      className="w-full h-32 bg-gray-900/70 border border-gray-700 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder={`Enter ${activeTab} generation prompt...`}
                      value={getCurrentPrompt()}
                      onChange={(e) => setCurrentPrompt(e.target.value)}
                    />
                  </div>
                  
                  {/* Parameter Controls */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-400">Parameters</label>
                      <button 
                        className="text-sm text-purple-400 flex items-center"
                        onClick={() => setShowParams(!showParams)}
                      >
                        {showParams ? 'Hide' : 'Show'}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showParams ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {showParams && (
                      <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                        {/* Temperature Slider */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Temperature</span>
                            <span className="text-sm text-purple-400">{tempSlider.toFixed(1)}</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1" 
                            value={tempSlider}
                            onChange={(e) => setTempSlider(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Precise</span>
                            <span>Creative</span>
                          </div>
                        </div>
                        
                        {/* Max Length Slider - Only for text */}
                        {activeTab === 'text' && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Maximum Length</span>
                              <span className="text-sm text-purple-400">{maxLength}</span>
                            </div>
                            <input 
                              type="range" 
                              min="10" 
                              max="500" 
                              step="10" 
                              value={maxLength}
                              onChange={(e) => setMaxLength(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Shorter</span>
                              <span>Longer</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Image Size - Only for images */}
                        {activeTab === 'image' && (
                          <div>
                            <label className="block text-sm mb-1">Image Size</label>
                            <select 
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="512x512">512 x 512</option>
                              <option value="768x768">768 x 768</option>
                              <option value="1024x1024">1024 x 1024</option>
                            </select>
                          </div>
                        )}
                        
                        {/* Voice Type - Only for audio */}
                        {activeTab === 'audio' && (
                          <div>
                            <label className="block text-sm mb-1">Voice Type</label>
                            <select 
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
                            >
                              <option value="female-1">Female (Standard)</option>
                              <option value="male-1">Male (Standard)</option>
                              <option value="female-2">Female (Enthusiastic)</option>
                              <option value="male-2">Male (Deep)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Run Button */}
                  <button 
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
                      vibeCheck === 'loading'
                        ? 'bg-purple-800 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    onClick={runInference}
                    disabled={vibeCheck === 'loading'}
                  >
                    {vibeCheck === 'loading' ? (
                      <>
                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Run
                      </>
                    )}
                  </button>
                  
                  {/* Request History Toggle */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-400">Recent Requests</label>
                      <button 
                        className="text-sm text-purple-400 flex items-center"
                        onClick={() => setShowHistory(!showHistory)}
                      >
                        {showHistory ? 'Hide' : 'Show'}
                        <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    {showHistory && (
                      <div className="space-y-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 max-h-48 overflow-y-auto">
                        {requestHistory.map(item => (
                          <div 
                            key={item.id} 
                            className="flex justify-between items-center text-sm p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer"
                            onClick={() => {
                              setActiveTab(item.type as any);
                              setActiveModel(item.model);
                              setCurrentPrompt(item.prompt);
                            }}
                          >
                            <div className="truncate flex-1">
                              <span className="text-gray-300 truncate">{item.prompt}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.timestamp}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Column - Output */}
                <div className="lg:w-1/2">
                  <div className="sticky top-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Output
                    </label>
                    
                    <div className="bg-gray-900/70 border border-gray-700 rounded-lg p-4 min-h-[320px] relative">
                      {responseVibe ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileJson className="h-4 w-4 text-purple-400 mr-2" />
                              <span className="text-sm text-gray-400">Response</span>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors flex items-center text-xs"
                                onClick={copyToClipboard}
                              >
                                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-green-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                                {copied ? "Copied!" : "Copy"}
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors text-xs">
                                <Save className="h-3.5 w-3.5 mr-1" />
                                Save
                              </button>
                            </div>
                          </div>
                          
                          {/* Text Output */}
                          {activeTab === 'text' && (
                            <div className="whitespace-pre-wrap text-sm font-mono">
                              {responseVibe}
                            </div>
                          )}
                          
                          {/* Image Output */}
                          {activeTab === 'image' && (
                            <div className="flex justify-center p-8 bg-gray-800/50 rounded-lg border border-gray-700/50">
                              <div className="text-center text-gray-400">
                                <Sparkles className="h-10 w-10 mx-auto mb-2" />
                                {responseVibe}
                              </div>
                            </div>
                          )}
                          
                          {/* Audio Output */}
                          {activeTab === 'audio' && (
                            <div className="flex justify-center p-8 bg-gray-800/50 rounded-lg border border-gray-700/50">
                              <div className="text-center text-gray-400">
                                <Settings className="h-10 w-10 mx-auto mb-2" />
                                {responseVibe}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-gray-500">
                            <Play className="h-10 w-10 mx-auto mb-2" />
                            <p>Run the model to see results</p>
                            <p className="text-xs mt-2">Results will appear here</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <Link href="/api" className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        View API Documentation
                      </Link>
                      <Link href="/pricing" className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Pricing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-700/30">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Integrate with your application</h2>
              <p className="text-gray-300 mb-6">
                After testing your model in the playground, easily integrate it into your application
              </p>
              
              <div className="bg-gray-900 rounded-md p-4 font-mono text-sm overflow-x-auto mb-4">
                <pre className="text-gray-300">
{`// Example API call with JavaScript
async function generateText() {
  const response = await fetch('https://api.neuralnexus.ai/v1/models/${activeModel}/generate', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: '${getCurrentPrompt().replace(/'/g, "\\'")}',
      max_tokens: ${maxLength},
      temperature: ${tempSlider}
    })
  });
  
  const data = await response.json();
  console.log(data.text);
  return data;
}`}
                </pre>
              </div>
              
              <div className="flex justify-between items-center">
                <Link 
                  href="/docs/api/inference" 
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                >
                  Learn more about the Inference API
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
                <button 
                  className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Tab Button Component
function TabButton({ active, onClick, label, icon }: { 
  active: boolean; 
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button 
      className={`px-6 py-4 flex items-center font-medium transition-colors border-b-2 ${
        active 
          ? 'border-purple-500 text-white' 
          : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
} 