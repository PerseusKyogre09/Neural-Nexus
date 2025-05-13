import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import AppProvider from '@/providers/AppProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neural Nexus – Upload & Monetize AI Models',
  description: 'The ultimate AI model hub to sell, share, and transfer ownership of your AI creations.',
  icons: {
    icon: '/animated-logo.gif',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClientLayout>
          <AppProvider>
            {children}
          </AppProvider>
        </ClientLayout>
      </body>
    </html>
  );
} 