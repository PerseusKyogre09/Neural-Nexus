"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the context type
type TonConnectContextType = {
  isInitialized: boolean;
  connector: any; // Type for the TonConnect instance
};

// Create the context with default values
const TonConnectContext = createContext<TonConnectContextType>({
  isInitialized: false,
  connector: null,
});

// Hook to use the context
export const useTonConnect = () => useContext(TonConnectContext);

interface TonConnectProviderProps {
  children: ReactNode;
}

// Provider component
export const TonConnectProvider = ({ children }: TonConnectProviderProps) => {
  // Browser detection - MUST be first hook
  const [isBrowser, setIsBrowser] = useState(false);
  const [tonConnectUI, setTonConnectUI] = useState<null | any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check if we're in browser - must be first effect
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Second useEffect to actually initialize TonConnect, but only if we're in the browser
  useEffect(() => {
    // Skip if not in browser or TonConnect is disabled
    if (!isBrowser || process.env.NEXT_PUBLIC_ENABLE_TONCONNECT !== 'true') {
      setIsInitialized(true);
      return;
    }

    const initTonConnect = async () => {
      try {
        // Dynamically import TonConnectUI to avoid SSR issues
        const { TonConnectUI } = await import('@tonconnect/ui-react');
        const ui = new TonConnectUI({
          manifestUrl: process.env.NEXT_PUBLIC_TON_MANIFEST_URL || 'https://your-domain.com/tonconnect-manifest.json',
        });
        setTonConnectUI(ui);
        console.log('TonConnect initialized, fam!');
      } catch (error) {
        console.error('Error initializing TonConnect, no cap:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initTonConnect();
  }, [isBrowser]);

  // Create a memoized context value to avoid unnecessary re-renders
  const contextValue = {
    isInitialized,
    connector: tonConnectUI
  };

  return (
    <TonConnectContext.Provider value={contextValue}>
      {children}
    </TonConnectContext.Provider>
  );
}; 