"use client";

// The dynamic export configuration ensures this page is only rendered client-side
export const dynamic = "force-dynamic";
export const runtime = "edge";
export const dynamicParams = true;

// Auto-select region
export const preferredRegion = "auto";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '@/src/components/auth/AuthLayout';
import SignInForm from "@/src/components/auth/SignInForm";
import { useRouter, useSearchParams } from 'next/navigation';

// Import toast dynamically to avoid SSR issues
const importToast = () => import('react-hot-toast').then(mod => mod.toast);

export default function SignInPage() {
  // Render flag to ensure we're only rendering on the client
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Mark that we're on the client
      setIsClient(true);
      
      // Check for error message in URL - use safe access
      const errorMsg = searchParams?.get ? searchParams.get('error') : null;
      if (errorMsg) {
        // Import toast dynamically
        importToast().then(toast => {
          toast.error(typeof errorMsg === 'string' ? errorMsg : 'An error occurred');
        }).catch(err => {
          console.error("Error showing toast:", err);
        });
      }
      
      // Stop loading after a short delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [searchParams]);

  // Show loading state until client-side code is ready
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="p-8 rounded-xl bg-gray-800/30 backdrop-blur-md text-center">
          <div className="w-12 h-12 border-t-2 border-purple-500 border-r-2 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading</h2>
          <p className="text-gray-300">Preparing sign-in page...</p>
        </div>
      </div>
    );
  }

  // Render the actual sign-in form once client-side is ready
  return (
    <AuthLayout
      mode="signin"
      title="Welcome Back"
      subtitle="Sign in to your account to access your workspace."
      showBrainAnimation={false}
    >
      <SignInForm />
    </AuthLayout>
  );
} 