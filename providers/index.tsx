'use client';

import { ReactNode } from 'react';
import AppProvider from './AppProvider';
import { Web3Provider } from './Web3Provider';
import dynamic from 'next/dynamic';

// Import TonConnectProvider with dynamic import to avoid SSR issues
const TonConnectClient = dynamic(
  () => import('./TonConnectProvider').then(mod => ({ default: mod.TonConnectProvider })),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Web3Provider>
        <TonConnectClient>
          {children}
        </TonConnectClient>
      </Web3Provider>
    </AppProvider>
  );
} 