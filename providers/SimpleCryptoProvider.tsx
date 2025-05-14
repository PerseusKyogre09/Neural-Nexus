"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
type SimpleCryptoContextType = {
  isInitialized: boolean;
  supportedWallets: string[];
  connectWallet: (walletType: string) => Promise<boolean>;
  disconnectWallet: () => void;
  activeWallet: string | null;
  isConnecting: boolean;
};

// Create context with default values
const SimpleCryptoContext = createContext<SimpleCryptoContextType>({
  isInitialized: false,
  supportedWallets: [],
  connectWallet: async () => false,
  disconnectWallet: () => {},
  activeWallet: null,
  isConnecting: false
});

// Hook to use the context
export const useSimpleCrypto = () => useContext(SimpleCryptoContext);

interface SimpleCryptoProviderProps {
  children: ReactNode;
}

// Provider component
export const SimpleCryptoProvider = ({ children }: SimpleCryptoProviderProps) => {
  // Safe browser detection
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // List of supported wallets - can be expanded
  const supportedWallets = [
    'MetaMask',
    'Coinbase',
    'Trust Wallet',
    'Binance'
  ];
  
  // Check if we're mounted in browser
  useEffect(() => {
    setIsMounted(true);
    setIsInitialized(true);
  }, []);
  
  // Simulated wallet connection function
  const connectWallet = async (walletType: string): Promise<boolean> => {
    if (!isMounted) return false;
    
    // Set connecting state
    setIsConnecting(true);
    
    try {
      // Here you would implement actual wallet connection logic
      // For now, we'll just simulate a successful connection after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set the active wallet
      setActiveWallet(walletType);
      console.log(`Connected to ${walletType}`);
      
      return true;
    } catch (error) {
      console.error(`Error connecting to ${walletType}:`, error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = () => {
    setActiveWallet(null);
    console.log('Wallet disconnected');
  };
  
  // Create context value
  const contextValue = {
    isInitialized,
    supportedWallets,
    connectWallet,
    disconnectWallet,
    activeWallet,
    isConnecting
  };
  
  // Always render children to support SSR
  return (
    <SimpleCryptoContext.Provider value={contextValue}>
      {children}
    </SimpleCryptoContext.Provider>
  );
}; 