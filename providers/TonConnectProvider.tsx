"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the context type
type TonConnectContextType = {
  isInitialized: boolean;
  connector: any; // Type for the TonConnect instance
};

// Create the context with default values
const TonConnectContext = createContext<null | any>(null);

// Hook to use the context
export const useTonConnect = () => useContext(TonConnectContext);

interface TonConnectProviderProps {
  children: ReactNode;
}

// Provider component
export const TonConnectProvider = ({ children }: TonConnectProviderProps) => {
  const [tonConnectUI, setTonConnectUI] = useState<null | any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize if we're on the client side and TON Connect is enabled
    if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_ENABLE_TONCONNECT !== 'true') {
      setIsInitialized(true);
      return;
    }

    const initTonConnect = async () => {
      try {
        const { TonConnectUI } = await import('@tonconnect/ui-react');
        const ui = new TonConnectUI({
          manifestUrl: process.env.NEXT_PUBLIC_TON_MANIFEST_URL || 'https://your-domain.com/tonconnect-manifest.json',
          // Removed hideInAppNotifications as it might not be supported in the current version
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
  }, []);

  return (
    <TonConnectContext.Provider value={tonConnectUI}>
      {isInitialized ? children : <div>Loading TON Connect, hold up...</div>}
    </TonConnectContext.Provider>
  );
}; 