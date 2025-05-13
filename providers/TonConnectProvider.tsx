'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// Don't directly import TonConnect - we'll do it dynamically

// Check if code is running on the client side
const isBrowser = typeof window !== 'undefined';

type TonConnectContextType = {
  isInitialized: boolean;
  connector: any; // Type for the TonConnect instance
};

const TonConnectContext = createContext<TonConnectContextType>({
  isInitialized: false,
  connector: null
});

export const useTonConnect = () => useContext(TonConnectContext);

export function TonConnectProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [connector, setConnector] = useState<any>(null);

  useEffect(() => {
    // Only initialize TonConnect on the client side
    if (isBrowser) {
      const setupTonConnect = async () => {
        try {
          // Dynamic import to avoid SSR issues
          const TonConnectModule = await import('@tonconnect/sdk');
          
          // Create connector instance
          const tonConnector = new TonConnectModule.TonConnect({
            manifestUrl: process.env.NEXT_PUBLIC_TON_MANIFEST_URL || ''
          });
          
          setConnector(tonConnector);
          setIsInitialized(true);
          
          console.log('TON Connect initialized successfully');
        } catch (error) {
          console.error('Failed to initialize TonConnect:', error);
        }
      };
      
      setupTonConnect();
    }
    
    // Cleanup
    return () => {
      if (connector && typeof connector.disconnect === 'function') {
        try {
          connector.disconnect();
        } catch (error) {
          console.error('Error disconnecting TON connector:', error);
        }
      }
    };
  }, []);

  const contextValue = {
    isInitialized,
    connector
  };

  return (
    <TonConnectContext.Provider value={contextValue}>
      {children}
    </TonConnectContext.Provider>
  );
} 