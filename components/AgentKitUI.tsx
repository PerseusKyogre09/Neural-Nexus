"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useCoinbaseAgent } from '@/providers/CoinbaseAgentProvider';
import { Send, Sparkles, X, Bot, AlertCircle, Loader2 } from 'lucide-react';
import { AnimatedCard } from './ui/animated-card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/providers/AppProvider';

export default function AgentKitUI() {
  // All state hooks need to be declared upfront, before any conditionals
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful AI assistant for the Neural Nexus platform. Help users discover AI models, learn about crypto transactions, and assist with blockchain technology questions.');
  const [error, setError] = useState<string | null>(null);
  const [agent, setAgent] = useState(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    isInitialized, 
    isAgentReady,
    createAgent,
    getAgentResponse,
    agentConversation,
    clearConversation
  } = useCoinbaseAgent();
  
  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [agentConversation]);
  
  // Initialize agent when opened for the first time
  useEffect(() => {
    if (isOpen && isInitialized && !isAgentReady && !isLoading) {
      initializeAgent();
    }
  }, [isOpen, isInitialized, isAgentReady, isLoading]);
  
  const initializeAgent = async () => {
    if (!isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await createAgent(systemPrompt);
    } catch (err) {
      setError('Failed to initialize AI agent. Please try again later.');
      console.error('Agent initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize agent if not already done
      if (!isAgentReady) {
        await createAgent(systemPrompt);
      }
      
      // Get response from agent
      await getAgentResponse(userInput);
      
      // Clear input field
      setUserInput('');
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Agent response error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Don't render anything on the server or if client-side JS is not available
  if (!isClient) {
    return null;
  }
  
  return (
    <>
      {/* Floating button to open chat */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Open AI Assistant"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed right-6 bottom-24 z-50 w-full max-w-md"
          >
            <AnimatedCard className="flex flex-col h-[500px] shadow-2xl" hoverEffect="none">
              {/* Header */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-900/50 to-purple-900/50">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-cyan-400" />
                  <h3 className="font-medium">Neural Nexus AI Agent</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-gray-400 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Chat messages */}
              <div 
                ref={chatContainerRef} 
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
              >
                {isInitialized ? (
                  <>
                    {!isAgentReady && !error && (
                      <div className="flex items-center justify-center h-full">
                        {isLoading ? (
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 mb-2 mx-auto animate-spin text-cyan-500" />
                            <p className="text-gray-400">Initializing your AI agent...</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Sparkles className="h-8 w-8 mb-2 mx-auto text-cyan-500" />
                            <p className="text-gray-400">Your AI agent is getting ready...</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {error && (
                      <div className="flex items-center space-x-2 bg-red-500/10 rounded-lg p-3 text-red-300">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                    
                    {agentConversation.map((msg, index) => (
                      <div key={index} className="space-y-2">
                        {/* User message */}
                        {msg.prompt && msg.prompt !== 'System: Agent created' && (
                          <div className="flex justify-end">
                            <div className="bg-blue-600/20 px-4 py-2 rounded-lg max-w-[80%]">
                              <p>{msg.prompt}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Agent response */}
                        <div className="flex">
                          <div className="bg-gray-800/90 px-4 py-2 rounded-lg max-w-[80%]">
                            <p className="whitespace-pre-wrap">{msg.response}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && userInput && (
                      <div className="flex">
                        <div className="bg-gray-800/90 px-4 py-2 rounded-lg">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce animation-delay-200"></div>
                            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce animation-delay-400"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 mb-2 mx-auto animate-spin text-cyan-500" />
                      <p className="text-gray-400">Connecting to Coinbase AgentKit...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input area */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800/50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={!isInitialized || isLoading || !!error}
                    placeholder={
                      error 
                        ? "Please try again later" 
                        : isAgentReady 
                          ? "Ask anything about AI models or crypto..." 
                          : "AI agent initializing..."
                    }
                    className="flex-1 bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!isInitialized || isLoading || !userInput.trim() || !!error}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {/* Clear chat and reinitialize options */}
                {isAgentReady && !error && (
                  <div className="flex justify-between mt-2 text-xs">
                    <button
                      type="button"
                      onClick={clearConversation}
                      className="text-gray-400 hover:text-white"
                    >
                      Clear chat
                    </button>
                    <button
                      type="button"
                      onClick={initializeAgent}
                      className="text-gray-400 hover:text-white"
                    >
                      Reinitialize agent
                    </button>
                  </div>
                )}
                
                {error && (
                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={initializeAgent}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </form>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 