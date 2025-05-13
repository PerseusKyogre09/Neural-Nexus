"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import UploadForm from './UploadForm';
import { X, Info, Check, FileText, Sparkles, Server, Code, Wallet, Image, Database } from 'lucide-react';
import { useWeb3 } from '@/providers/Web3Provider';

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'testing' | 'advanced' | 'web3'>('details');
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [enableModelDemo, setEnableModelDemo] = useState(false);
  const [enableCryptoPayments, setEnableCryptoPayments] = useState(false);
  const [enableNFTOwnership, setEnableNFTOwnership] = useState(false);
  const [enableIPFSStorage, setEnableIPFSStorage] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<'ETH' | 'MATIC' | 'USDT'>('ETH');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { isConnected, isWeb3Enabled, connectWallet } = useWeb3();
  
  const tabs = [
    { id: 'details', label: 'Model Details', icon: <FileText className="h-4 w-4" /> },
    { id: 'testing', label: 'Testing & Demo', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'advanced', label: 'Advanced Settings', icon: <Server className="h-4 w-4" /> },
    { id: 'web3', label: 'Web3 Features', icon: <Code className="h-4 w-4" /> },
  ];
  
  const handleReadmeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReadmeContent(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Upload Your AI Model
          </h2>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close upload modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-4 text-sm font-medium ${
                activeTab === tab.id 
                ? 'border-b-2 border-purple-500 text-purple-400' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[450px]"
            >
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <UploadForm onSuccess={onClose} />
                  
                  {/* README Upload Section */}
                  <div className="mt-8 p-4 border border-dashed border-white/20 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-400" />
                      Add README Documentation (Optional)
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Upload a README.md file to provide detailed documentation for your model. It will be displayed like GitHub formatting.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".md,.txt"
                        onChange={handleReadmeUpload}
                        className="hidden"
                        aria-label="Upload README file"
                      />
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose README File
                      </AnimatedButton>
                      
                      {readmeContent && (
                        <div className="flex items-center text-green-400 text-sm">
                          <Check className="h-4 w-4 mr-1" /> README uploaded successfully
                        </div>
                      )}
                    </div>
                    
                    {readmeContent && (
                      <div className="mt-4 p-4 bg-white/5 rounded-lg max-h-40 overflow-auto">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                          {readmeContent.slice(0, 200)}
                          {readmeContent.length > 200 && '...'}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'testing' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Model Demo Environment</h3>
                    
                    <label className="flex items-center cursor-pointer">
                      <span className="mr-3 text-sm text-gray-400">Enable Demo</span>
                      <div className="relative">
                        <input 
                          type="checkbox"
                          className="sr-only"
                          checked={enableModelDemo}
                          onChange={() => setEnableModelDemo(!enableModelDemo)}
                        />
                        <div className={`w-10 h-5 rounded-full ${enableModelDemo ? 'bg-purple-600' : 'bg-gray-600'} transition-colors`}></div>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${enableModelDemo ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </label>
                  </div>
                  
                  {enableModelDemo ? (
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium mb-3">Upload Demo Weights</h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Provide a smaller version of your model for demonstration purposes.
                        </p>
                        <AnimatedButton variant="outline" size="sm">
                          Upload Demo Weights
                        </AnimatedButton>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium mb-3">Input/Output Format</h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Define the expected input format and output structure.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-2">Input Format</label>
                            <textarea 
                              className="w-full p-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                              rows={3}
                              placeholder='{"text": "input text", "params": {"temp": 0.7}}'
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-sm mb-2">Output Format</label>
                            <textarea 
                              className="w-full p-2 bg-black/30 border border-white/10 rounded-lg text-sm"
                              rows={3}
                              placeholder='{"generated": "output text", "metadata": {}}'
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium mb-3">Custom Test UI</h4>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <select 
                            className="bg-black/30 border border-white/10 rounded-lg p-2 text-sm"
                            aria-label="Select test UI type"
                          >
                            <option value="text">Text Input Field</option>
                            <option value="image">Image Upload</option>
                            <option value="audio">Audio Input</option>
                            <option value="custom">Custom HTML</option>
                          </select>
                          <AnimatedButton variant="outline" size="sm">
                            Configure UI
                          </AnimatedButton>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Code className="h-4 w-4 mr-2 text-blue-400" />
                          Inference Script
                        </h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Add a script that will be run in a secure sandbox to process inputs and return outputs.
                        </p>
                        <textarea 
                          className="w-full p-2 bg-black/30 border border-white/10 rounded-lg text-sm font-mono"
                          rows={6}
                          placeholder="def inference(input_data):
  # Your code here
  return {'result': processed_output}"
                        ></textarea>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Sparkles className="h-12 w-12 text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Enable Model Demo</h3>
                      <p className="text-gray-400 max-w-md mb-6">
                        Allow users to test your model before purchasing. This can increase conversion rates by up to 65%.
                      </p>
                      <AnimatedButton 
                        variant="secondary"
                        onClick={() => setEnableModelDemo(true)}
                      >
                        Enable Demo Features
                      </AnimatedButton>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium mb-3">JSON Metadata Editor</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Edit model metadata directly in JSON format (for advanced users).
                    </p>
                    <textarea 
                      className="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-sm font-mono"
                      rows={10}
                      placeholder='{
  "name": "My Model",
  "version": "1.0.0",
  "description": "Model description",
  "architecture": {
    "type": "transformer",
    "params": 125000000
  },
  "license": "MIT",
  "tags": ["nlp", "text-generation"]
}'
                    ></textarea>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium mb-3">Version Control</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Version Tag</label>
                        <input 
                          type="text"
                          className="w-full p-2 bg-black/30 border border-white/10 rounded-lg"
                          placeholder="v1.0.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2">Previous Version</label>
                        <select 
                          className="w-full p-2 bg-black/30 border border-white/10 rounded-lg"
                          aria-label="Select previous version"
                        >
                          <option value="">None (Initial Release)</option>
                          <option value="v0.9.0">v0.9.0 (Beta)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="font-medium mb-3">GitHub Repository Link</h4>
                    <input 
                      type="text"
                      className="w-full p-2 bg-black/30 border border-white/10 rounded-lg"
                      placeholder="https://github.com/username/repository"
                    />
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">AI Auto-Tag</h4>
                      <p className="text-sm text-gray-400">
                        Automatically generate tags using LLM embedding
                      </p>
                    </div>
                    <AnimatedButton variant="outline" size="sm">
                      Generate Tags
                    </AnimatedButton>
                  </div>
                </div>
              )}
              
              {activeTab === 'web3' && (
                <div className="space-y-6">
                  {isConnected ? (
                    <>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Wallet className="h-4 w-4 mr-2 text-blue-400" />
                          Crypto Payment Options
                        </h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Allow users to purchase your model using cryptocurrency.
                        </p>
                        
                        <div className="flex items-center mb-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enableCryptoPayments}
                              onChange={() => setEnableCryptoPayments(!enableCryptoPayments)}
                              className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full ${enableCryptoPayments ? 'bg-purple-600' : 'bg-gray-600'} transition-colors`}></div>
                            <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform ${enableCryptoPayments ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                            <span className="ml-12 text-sm font-medium">Enable Crypto Payments</span>
                          </label>
                        </div>
                        
                        {enableCryptoPayments && (
                          <div className="mt-4 space-y-3">
                            <div>
                              <p className="text-sm mb-2">Select cryptocurrencies to accept:</p>
                              <div className="flex flex-wrap gap-2">
                                {['ETH', 'MATIC', 'USDT'].map((crypto) => (
                                  <button
                                    key={crypto}
                                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                                      selectedCrypto === crypto
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                    onClick={() => setSelectedCrypto(crypto as any)}
                                  >
                                    {crypto}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm mb-2">Price in {selectedCrypto}</label>
                              <div className="flex">
                                <input
                                  type="number"
                                  placeholder="0.05"
                                  step="0.001"
                                  min="0"
                                  className="w-full p-2 bg-black/30 border border-white/10 rounded-lg"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Equivalent to ~$50 USD at current rates
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Image className="h-4 w-4 mr-2 text-purple-400" />
                          NFT Ownership Certificate
                        </h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Create an NFT representing ownership of this model. The NFT will be transferred to the buyer upon purchase.
                        </p>
                        
                        <div className="flex items-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enableNFTOwnership}
                              onChange={() => setEnableNFTOwnership(!enableNFTOwnership)}
                              className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full ${enableNFTOwnership ? 'bg-purple-600' : 'bg-gray-600'} transition-colors`}></div>
                            <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform ${enableNFTOwnership ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                            <span className="ml-12 text-sm font-medium">Mint NFT Ownership Certificate</span>
                          </label>
                        </div>
                        
                        {enableNFTOwnership && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <span className="text-xl">🧠</span>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium">Model Ownership NFT</h5>
                                <p className="text-xs text-gray-400 mt-1">
                                  ERC-721 token on Polygon with on-chain metadata
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <span className="px-2 py-0.5 bg-purple-900/50 rounded-full text-[10px] text-purple-300 border border-purple-500/20">
                                    Transferable
                                  </span>
                                  <span className="px-2 py-0.5 bg-blue-900/50 rounded-full text-[10px] text-blue-300 border border-blue-500/20">
                                    Polygon
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Database className="h-4 w-4 mr-2 text-green-400" />
                          Decentralized Storage
                        </h4>
                        <p className="text-sm text-gray-400 mb-4">
                          Store your model files on IPFS for decentralized, content-addressed storage.
                        </p>
                        
                        <div className="flex items-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enableIPFSStorage}
                              onChange={() => setEnableIPFSStorage(!enableIPFSStorage)}
                              className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full ${enableIPFSStorage ? 'bg-purple-600' : 'bg-gray-600'} transition-colors`}></div>
                            <div className={`absolute w-4 h-4 rounded-full bg-white transition-transform ${enableIPFSStorage ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                            <span className="ml-12 text-sm font-medium">Store Model on IPFS</span>
                          </label>
                        </div>
                        
                        {enableIPFSStorage && (
                          <div className="mt-4 space-y-2">
                            <p className="text-xs text-gray-400">
                              Your model will be uploaded to IPFS with a permanent CID. A backup will also be stored on traditional cloud storage.
                            </p>
                            <div className="flex gap-2">
                              <div className="flex-1 p-2 bg-gray-800 rounded-md">
                                <p className="text-xs text-gray-400">Gas fee estimate</p>
                                <p className="font-mono text-sm">~0.001 ETH</p>
                              </div>
                              <div className="flex-1 p-2 bg-gray-800 rounded-md">
                                <p className="text-xs text-gray-400">Storage cost</p>
                                <p className="font-mono text-sm">Free (w/ pin)</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Wallet className="h-12 w-12 text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
                      <p className="text-gray-400 max-w-md mb-6">
                        To enable Web3 features like crypto payments, NFT ownership, and IPFS storage, please connect your wallet first.
                      </p>
                      <AnimatedButton 
                        variant="primary"
                        onClick={() => connectWallet()}
                      >
                        Connect Wallet
                      </AnimatedButton>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="border-t border-white/10 p-6 flex flex-wrap justify-between gap-4">
          <div>
            <AnimatedButton
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </AnimatedButton>
          </div>
          <div className="flex flex-wrap gap-3">
            <AnimatedButton variant="outline">
              Save Draft
            </AnimatedButton>
            <AnimatedButton variant="secondary">
              Preview Listing
            </AnimatedButton>
            <AnimatedButton variant="primary">
              Upload & Publish
            </AnimatedButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 