import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import SupabaseProvider from '@/providers/SupabaseProvider';

const inter = Inter({ subsets: ['latin'] });

// Dynamic imports to avoid SSR issues
const Providers = dynamic(() => import('../providers'), { 
  ssr: false 
});

const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), { 
  ssr: false 
});

const AgentKitUI = dynamic(() => import('@/components/AgentKitUI'), { 
  ssr: false 
});

// Metadata can be exported from a Server Component
export const metadata: Metadata = {
  title: 'Neural Nexus – Upload & Monetize AI Models',
  description: 'The ultimate AI model hub to sell, share, and transfer ownership of your AI creations.',
  icons: {
    icon: '/animated-logo.gif',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <SupabaseProvider>
          <Suspense fallback={<div>Loading app...</div>}>
            <Providers>
              {children}
              <Toaster position="top-center" />
              <AgentKitUI />
            </Providers>
          </Suspense>
        </SupabaseProvider>
      </body>
    </html>
  );
} 