"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the context type
type CoinbaseAgentContextType = {
  isInitialized: boolean;
  isAgentReady: boolean;
  createAgent: (prompt: string) => Promise<any>;
  getAgentResponse: (message: string) => Promise<string>;
  agentConversation: {prompt: string, response: string}[];
  clearConversation: () => void;
};

// Create context with placeholder values
const CoinbaseAgentContext = createContext<CoinbaseAgentContextType>({
  isInitialized: false,
  isAgentReady: false,
  createAgent: async () => ({}),
  getAgentResponse: async () => "",
  agentConversation: [],
  clearConversation: () => {},
});

// Export the context hook
export const useCoinbaseAgent = () => useContext(CoinbaseAgentContext);

interface CoinbaseAgentProviderProps {
  children: ReactNode;
}

// Provider component
export const CoinbaseAgentProvider = ({ children }: CoinbaseAgentProviderProps) => {
  // Browser detection - MUST be first hook
  const [isBrowser, setIsBrowser] = useState(false);
  // Define all state variables upfront to maintain hook order
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAgentReady, setIsAgentReady] = useState(false);
  const [agentConversation, setAgentConversation] = useState<{prompt: string, response: string}[]>([]);
  
  // Check if we're in browser - must be first effect
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Initialize once we know we're in the browser
  useEffect(() => {
    if (isBrowser) {
      setIsInitialized(true);
    }
  }, [isBrowser]);

  // Placeholder function - real implementation would be more complex
  const createAgent = async (prompt: string) => {
    console.log("Agent creation requested with prompt:", prompt);
    // Only set agent ready if we're in browser
    if (isBrowser) {
      setIsAgentReady(true);
    }
    return {};
  };

  // Placeholder function
  const getAgentResponse = async (message: string) => {
    if (!isBrowser || !isAgentReady) {
      return "Agent not ready";
    }
    
    const response = `This is a placeholder response for: "${message}"`;
    // Add to conversation
    setAgentConversation(prev => [...prev, { prompt: message, response }]);
    return response;
  };

  // Clear conversation history
  const clearConversation = () => {
    setAgentConversation([]);
  };

  // Create the context value
  const contextValue = {
    isInitialized,
    isAgentReady,
    createAgent,
    getAgentResponse,
    agentConversation,
    clearConversation,
  };

  // Render different content based on isBrowser, but maintain hook order
  return (
    <CoinbaseAgentContext.Provider value={contextValue}>
      {children}
    </CoinbaseAgentContext.Provider>
  );
}; 