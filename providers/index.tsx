'use client';

import { ReactNode } from 'react';
import AppProvider from './AppProvider';
import { Web3Provider } from './Web3Provider';
import dynamic from 'next/dynamic';

// Import TonConnectProvider with dynamic import to avoid SSR issues
const TonConnectProvider = dynamic(
  () => import('./TonConnectProvider').then(mod => mod.TonConnectProvider),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Web3Provider>
        <TonConnectProvider>
          {children}
        </TonConnectProvider>
      </Web3Provider>
    </AppProvider>
  );
} 