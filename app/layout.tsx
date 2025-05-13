"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppProvider from '@/providers/AppProvider';
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Match this with the splash screen animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {isLoading && <SplashScreen />}
        <Navbar />
        <main className="min-h-screen">
          <AppProvider>
            {children}
          </AppProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
} 