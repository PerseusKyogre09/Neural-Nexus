"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function AuthExchange() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function exchangeCodeForSession() {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          setError('No auth code provided');
          setLoading(false);
          return;
        }
        
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('Error exchanging code for session:', error);
          setError(error.message);
          setLoading(false);
          return;
        }
        
        // Successfully authenticated
        console.log('Auth successful, redirecting to dashboard');
        
        // Redirect to dashboard or a success page
        router.push('/dashboard');
      } catch (err) {
        console.error('Error during auth code exchange:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    }
    
    exchangeCodeForSession();
  }, [searchParams, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="p-8 bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-300">Completing authentication...</p>
            <p className="text-sm text-gray-400 mt-2">You'll be redirected automatically</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="bg-red-500/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mt-4">Authentication Failed</h2>
            <p className="mt-2 text-red-400">{error}</p>
            <button 
              onClick={() => router.push('/signup')} 
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-green-500/10 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mt-4">Authentication Complete</h2>
            <p className="mt-2 text-gray-300">You've been successfully authenticated!</p>
            <p className="text-sm text-gray-400 mt-1">Redirecting you to the dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
} 