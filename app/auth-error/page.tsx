"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'unknown_error';
  const description = searchParams.get('description') || 'An unexpected error occurred during authentication.';
  
  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    'unauthorized': 'You are not authorized to access this resource.',
    'invalid_credentials': 'The credentials you provided are invalid.',
    'email_not_confirmed': 'Please confirm your email address before signing in.',
    'password_recovery': 'There was an issue with your password recovery request.',
    'server_error': 'Our servers encountered an issue. Please try again later.',
    'configuration_error': 'There is a configuration issue with our authentication system.',
    'expired_token': 'Your authentication token has expired. Please sign in again.',
    'unknown_error': 'An unexpected error occurred during authentication.'
  };
  
  const errorMessage = errorMessages[error] || description;
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-red-500/10 p-4 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6"
            >
              <AlertTriangle size={48} className="text-red-500" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-red-500"
            >
              Authentication Error
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              {errorMessage}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                href="/"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
              
              <Link
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center"
              >
                Try Again
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
              <p className="text-gray-300 mb-4">
                If you continue to experience issues with authentication, please try these steps:
              </p>
              <ul className="space-y-2 text-left text-gray-300">
                <li className="flex items-start">
                  <div className="bg-gray-700 rounded-full p-1 mr-3 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Clear your browser cache and cookies</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-gray-700 rounded-full p-1 mr-3 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Make sure your email address is correct</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-gray-700 rounded-full p-1 mr-3 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Try using a different authentication method</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-gray-700 rounded-full p-1 mr-3 mt-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Contact support at <a href="mailto:support@neuralnexus.ai" className="text-blue-400 hover:underline">support@neuralnexus.ai</a></span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 