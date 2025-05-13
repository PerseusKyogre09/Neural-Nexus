"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import dynamic from 'next/dynamic';

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

// Provider component
export function TonConnectProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [connector, setConnector] = useState<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const setupTonConnect = async () => {
      try {
        // Dynamically import TonConnect to avoid SSR issues
        const { TonConnectUI } = await import('@tonconnect/ui-react');
        
        // Check if TonConnect is enabled in env vars
        if (process.env.NEXT_PUBLIC_ENABLE_TONCONNECT !== 'true') {
          console.log('TON Connect is disabled by environment variable');
          return;
        }
        
        // Create a new TonConnect instance
        const tonConnectUI = new TonConnectUI({
          manifestUrl: process.env.NEXT_PUBLIC_TON_MANIFEST_URL || 'https://your-domain.com/tonconnect-manifest.json',
        });
        
        // Store the connector instance
        setConnector(tonConnectUI);
        setIsInitialized(true);
        
        console.log('TON Connect SDK initialized');
      } catch (error) {
        console.error('Failed to initialize TON Connect:', error);
      }
    };

    setupTonConnect();
    
    // Cleanup
    return () => {
      if (connector && typeof connector.disconnect === 'function') {
        connector.disconnect();
      }
    };
  }, []);

  return (
    <TonConnectContext.Provider value={{ isInitialized, connector }}>
      {children}
    </TonConnectContext.Provider>
  );
} 