"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Trash, Download, Copy, Cpu, Sparkles, Bot, User, ChevronDown, ChevronRight, Github, Code, Braces, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIAssistantPanelProps {
  theme: string;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPanel({ theme, onClose }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! I'm your Neural Nexus DeepSeek AI Assistant. How can I help you with coding, GitHub integrations, or Neural Nexus features today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [aiModel, setAiModel] = useState('deepseek-coder');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Example questions focused on Neural Nexus and coding
  const exampleQuestions = [
    "What features does Neural Nexus provide for AI development?",
    "How do I use GitHub integration in Neural Nexus?",
    "What are the best practices for using DeepSeek models?",
    "Help me create a React component for an AI chatbot",
    "Explain how to use the Neural Nexus AI Playground effectively"
  ];
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Check if query is outside the context scope
    const outsideContextTerms = ['politics', 'religion', 'cryptocurrency', 'stock market', 'medical advice', 'legal advice'];
    const isOutsideContext = outsideContextTerms.some(term => input.toLowerCase().includes(term));
    
    setTimeout(() => {
      let assistantResponse: string;
      
      if (isOutsideContext) {
        assistantResponse = "I'm sorry, but I'm designed to only answer questions related to Neural Nexus, coding, and GitHub integrations. I can't provide information outside this scope.";
      } else {
        // Simulated DeepSeek AI response based on model selected
        if (aiModel === 'deepseek-coder') {
          assistantResponse = "Here's my DeepSeek Coder response focused on helping you with code:\n\n```javascript\n// Example code to help with your query\nconst neuralNexusFeature = {\n  initialize() {\n    // Set up Neural Nexus environment\n    console.log('Neural Nexus feature initialized');\n  },\n  process(data) {\n    // Process with AI capabilities\n    return transformedData;\n  }\n};\n```\n\nThis approach aligns with Neural Nexus best practices. Would you like me to explain it in more detail?";
        } else {
          assistantResponse = "I've analyzed your question about Neural Nexus functionality. The platform provides several approaches to solve this:\n\n1. Use the built-in AI tools for quick implementation\n2. Leverage the GitHub integration for version control\n3. Implement custom extensions via the Neural Nexus API\n\nWould you like me to elaborate on any of these approaches?";
        }
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle input change with auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };
  
  // Handle example question click
  const handleExampleClick = (question: string) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
      // Auto-resize
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  };
  
  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Chat history cleared. How can I help you with Neural Nexus, coding, or GitHub integrations today?",
        timestamp: new Date()
      }
    ]);
    setShowOptions(false);
  };
  
  // Copy chat to clipboard
  const copyChat = () => {
    const chatText = messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(chatText);
    
    // Show temporary "Copied!" message
    const copyButton = document.getElementById('copy-chat-button');
    if (copyButton) {
      const originalHTML = copyButton.innerHTML;
      copyButton.innerHTML = '<span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!</span>';
      setTimeout(() => {
        copyButton.innerHTML = originalHTML;
      }, 2000);
    }
    
    setShowOptions(false);
  };
  
  // Download chat history
  const downloadChat = () => {
    const chatText = messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'AI'} (${new Date(msg.timestamp).toLocaleTimeString()}):\n${msg.content}`)
      .join('\n\n');
    
    const element = document.createElement('a');
    const file = new Blob([chatText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `neural-nexus-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setShowOptions(false);
  };
  
  // Format message with code highlighting
  const formatMessage = (content: string) => {
    // This is a simple implementation - in a real app you'd use a proper syntax highlighter
    return content
      .replace(/`([^`]+)`/g, '<code class="px-1 rounded bg-opacity-20 font-mono text-sm bg-gray-700">$1</code>')
      .replace(/```([^`]+)```/g, '<pre class="p-2 my-2 rounded bg-opacity-20 font-mono text-sm bg-gray-700 overflow-x-auto">$1</pre>');
  };
  
  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b",
        theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
      )}>
        <div className="flex items-center">
          <div className={cn(
            "p-2 rounded mr-2 bg-gradient-to-br",
            theme === 'dark' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'
          )}>
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">DeepSeek AI Assistant</h2>
            <p className="text-xs opacity-75">Powered by Neural Nexus</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-2">
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className={cn(
                "text-xs py-1 px-2 rounded",
                theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-white border-[#e0e0e0]',
                "border"
              )}
              aria-label="Select AI model"
            >
              <option value="deepseek-coder">DeepSeek Coder</option>
              <option value="deepseek-chat">DeepSeek Chat</option>
              <option value="deepseek-llm">DeepSeek LLM</option>
            </select>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={cn(
                "p-1 rounded-full mr-2",
                theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
              )}
              aria-label="Chat options"
              title="Chat options"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
            
            {showOptions && (
              <div className={cn(
                "absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 border",
                theme === 'dark' ? 'bg-[#252526] border-[#3d3d3d]' : 'bg-white border-[#e0e0e0]'
              )}>
                <div className="py-1">
                  <button
                    id="copy-chat-button"
                    onClick={copyChat}
                    className={cn(
                      "flex items-center w-full text-left px-4 py-2 text-sm",
                      theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
                    )}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy chat
                  </button>
                  <button
                    onClick={downloadChat}
                    className={cn(
                      "flex items-center w-full text-left px-4 py-2 text-sm",
                      theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
                    )}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download chat
                  </button>
                  <button
                    onClick={clearChat}
                    className={cn(
                      "flex items-center w-full text-left px-4 py-2 text-sm",
                      theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#f5f5f5]'
                    )}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Clear chat
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className={cn(
              "p-1 rounded-full",
              theme === 'dark' ? 'hover:bg-[#3c3c3c]' : 'hover:bg-[#e0e0e0]'
            )}
            aria-label="Close AI Assistant"
            title="Close AI Assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "mb-4 max-w-[90%]",
              message.role === 'user' ? 'ml-auto' : 'mr-auto'
            )}
          >
            <div className="flex items-start">
              {message.role === 'assistant' && (
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2",
                  "bg-gradient-to-br from-blue-600 to-purple-600"
                )}>
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              
              <div className={cn(
                "rounded-lg p-3",
                message.role === 'user'
                  ? theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-400 text-white'
                  : theme === 'dark'
                    ? 'bg-[#3c3c3c] text-white'
                    : 'bg-[#f0f0f0] text-black'
              )}>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                <div className={cn(
                  "text-xs mt-1 text-right",
                  message.role === 'user'
                    ? 'text-blue-200'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ml-2",
                  theme === 'dark' ? 'bg-[#3c3c3c]' : 'bg-[#e0e0e0]'
                )}>
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="mb-4 max-w-[90%]">
            <div className="flex items-start">
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-2",
                "bg-gradient-to-br from-blue-600 to-purple-600"
              )}>
                <Bot className="h-5 w-5 text-white" />
              </div>
              
              <div className={cn(
                "rounded-lg p-3",
                theme === 'dark'
                  ? 'bg-[#3c3c3c] text-white'
                  : 'bg-[#f0f0f0] text-black'
              )}>
                <div className="flex space-x-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-bounce",
                    theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'
                  )} style={{ animationDelay: '0ms' }} />
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-bounce",
                    theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'
                  )} style={{ animationDelay: '150ms' }} />
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-bounce",
                    theme === 'dark' ? 'bg-gray-400' : 'bg-gray-600'
                  )} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Context notice */}
      <div className={cn(
        "px-4 py-2 text-xs border-t",
        theme === 'dark' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20' : 'bg-yellow-50 text-yellow-800 border-yellow-100'
      )}>
        <p>Note: This AI assistant is limited to Neural Nexus, coding, and GitHub topics only.</p>
      </div>
      
      {/* Example questions */}
      {messages.length === 1 && (
        <div className={cn(
          "px-4 py-3 border-t",
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        )}>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center w-full mb-2"
          >
            {showExamples ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            <h3 className="text-sm font-semibold">Example questions</h3>
          </button>
          
          <AnimatePresence>
            {showExamples && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {exampleQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleExampleClick(question)}
                    className={cn(
                      "w-full text-left p-2 rounded-md text-sm flex items-center",
                      theme === 'dark' 
                        ? 'bg-[#252526] hover:bg-[#3c3c3c] border border-[#3d3d3d]' 
                        : 'bg-white hover:bg-[#f0f0f0] border border-[#e0e0e0]'
                    )}
                  >
                    {index === 0 ? (
                      <Cpu className="h-4 w-4 mr-2 text-purple-500" />
                    ) : index === 1 ? (
                      <Github className="h-4 w-4 mr-2 text-blue-500" />
                    ) : index === 2 ? (
                      <Braces className="h-4 w-4 mr-2 text-green-500" />
                    ) : index === 3 ? (
                      <Code className="h-4 w-4 mr-2 text-orange-500" />
                    ) : (
                      <FileCode className="h-4 w-4 mr-2 text-pink-500" />
                    )}
                    {question}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* Input form */}
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "p-4 border-t",
          theme === 'dark' ? 'border-[#3d3d3d]' : 'border-[#e0e0e0]'
        )}
      >
        <div className={cn(
          "flex items-end rounded-lg border shadow-lg",
          theme === 'dark' 
            ? 'bg-[#3c3c3c] border-[#5d5d5d]' 
            : 'bg-white border-[#d0d0d0]'
        )}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about Neural Nexus, coding, or GitHub integration..."
            className={cn(
              "flex-1 p-3 bg-transparent resize-none focus:outline-none",
              theme === 'dark' ? 'text-white' : 'text-black'
            )}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            aria-label="Message input"
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "p-3",
              !input.trim() || isTyping 
                ? 'opacity-50 cursor-not-allowed' 
                : theme === 'dark' 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-500'
            )}
            aria-label="Send message"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        <div className="text-xs text-center mt-2 text-gray-500">
          Press Enter to send, Shift+Enter for a new line
        </div>
      </form>
    </div>
  );
} 