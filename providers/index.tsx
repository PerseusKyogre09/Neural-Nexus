'use client';

import { ReactNode, useState, useEffect } from 'react';
import AppProvider from './AppProvider';
import { Web3Provider } from './Web3Provider';
import dynamic from 'next/dynamic';

// Import TonConnectProvider with dynamic import to avoid SSR issues
const TonConnectClient = dynamic(
  () => import('./TonConnectProvider').then(mod => ({ default: mod.TonConnectProvider })),
  { 
    ssr: false,
    loading: () => <>{/* Empty fragment, no loader needed */}</>
  }
);

// Import CoinbaseAgentProvider with dynamic import and strict client-side only
const CoinbaseAgentClient = dynamic(
  () => import('./CoinbaseAgentProvider').then(mod => ({ default: mod.CoinbaseAgentProvider })),
  { 
    ssr: false,
    loading: () => <>{/* Empty fragment, no loader needed */}</>
  }
);

// Client-side only provider wrapper
export default function Providers({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return (
    <AppProvider>
      <Web3Provider>
        <TonConnectClient>
          <CoinbaseAgentClient>
            {children}
          </CoinbaseAgentClient>
        </TonConnectClient>
      </Web3Provider>
    </AppProvider>
  );
} 