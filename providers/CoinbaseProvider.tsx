"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
type CoinbaseContextType = {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: string | null;
  isInitialized: boolean;
};

// Create the context with default values
const CoinbaseContext = createContext<CoinbaseContextType>({
  isConnected: false,
  account: null,
  chainId: null,
  connect: async () => {},
  disconnect: () => {},
  balance: null,
  isInitialized: false,
});

// Hook to use the context
export const useCoinbase = () => useContext(CoinbaseContext);

interface CoinbaseProviderProps {
  children: ReactNode;
}

// Provider component
export const CoinbaseProvider = ({ children }: CoinbaseProviderProps) => {
  // Browser detection - MUST be first hook
  const [isBrowser, setIsBrowser] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  
  // Check if Coinbase is enabled from env
  const isCoinbaseEnabled = typeof process !== 'undefined' && 
    process.env && 
    process.env.NEXT_PUBLIC_ENABLE_COINBASE === 'true';

  // First useEffect just to detect if we're in the browser
  useEffect(() => {
    setIsBrowser(true);
    setIsInitialized(true);
  }, []);

  // Placeholder for connection status - in a real app, this would be updated based on wallet connection
  useEffect(() => {
    if (!isBrowser || !isCoinbaseEnabled) return;
    
    // This is a placeholder. In a real implementation, you would listen for wallet connection changes
    // using the appropriate OnchainKit hooks or events.
    const checkConnection = async () => {
      // Mock connection check - replace with actual implementation
      try {
        setIsConnected(false);
        setAccount(null);
        setChainId(null);
        setBalance(null);
      } catch (error) {
        console.error('Error checking Coinbase connection:', error);
      }
    };

    checkConnection();
  }, [isBrowser, isCoinbaseEnabled]);

  // Connect to Coinbase wallet - placeholder
  const connect = async () => {
    if (!isBrowser || !isCoinbaseEnabled) return;
    
    try {
      // In a real implementation, this would trigger the Coinbase wallet connection
      console.log("Coinbase connection attempt - placeholder");
      console.log("Coinbase connected, fam!");
      // Mock connection - replace with actual implementation
      setIsConnected(false);
      setAccount(null);
      setChainId(null);
      setBalance('0.0');
    } catch (error) {
      console.error('Failed to connect to Coinbase wallet:', error);
    }
  };

  // Disconnect from Coinbase wallet - placeholder
  const disconnect = () => {
    if (!isBrowser || !isCoinbaseEnabled) return;
    
    try {
      // In a real implementation, this would disconnect the Coinbase wallet
      console.log("Coinbase disconnection attempt - placeholder");
      console.log("Coinbase disconnected, no cap!");
      setIsConnected(false);
      setAccount(null);
      setChainId(null);
      setBalance(null);
    } catch (error) {
      console.error('Failed to disconnect from Coinbase wallet:', error);
    }
  };

  // Context value
  const contextValue: CoinbaseContextType = {
    isConnected,
    account,
    chainId,
    connect,
    disconnect,
    balance,
    isInitialized
  };

  // Early return for server-side rendering or if Coinbase is disabled
  if (!isBrowser || !isCoinbaseEnabled) {
    return (
      <CoinbaseContext.Provider value={contextValue}>
        {children}
      </CoinbaseContext.Provider>
    );
  }

  // Basic provider implementation that doesn't use OnchainKitProvider
  // This avoids type issues while still providing the context
  return (
    <CoinbaseContext.Provider value={contextValue}>
      {isInitialized ? children : <div>Loading Coinbase, hang tight...</div>}
    </CoinbaseContext.Provider>
  );
}; 