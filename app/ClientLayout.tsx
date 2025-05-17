"use client";

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'react-hot-toast';
import SupabaseProvider from '@/providers/SupabaseProvider';
import AuthProvider from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import dynamic from 'next/dynamic';
import { CoinbaseAgentProvider } from '@/providers/CoinbaseAgentProvider';
import { SimpleCryptoProvider } from '@/providers/SimpleCryptoProvider';
import AppProvider from '@/providers/AppProvider';

// Dynamic imports to avoid SSR issues
const AgentKitUI = dynamic(() => import('@/components/AgentKitUI'), { 
  ssr: false 
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SupabaseProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <SimpleCryptoProvider>
              <CoinbaseAgentProvider>
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">{children}</div>
                </div>
                <Analytics />
                <SpeedInsights />
                <Toaster position="top-center" />
                <AgentKitUI />
              </CoinbaseAgentProvider>
            </SimpleCryptoProvider>
          </AppProvider>
        </ThemeProvider>
      </SupabaseProvider>
    </AuthProvider>
  );
} 