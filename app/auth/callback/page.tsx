"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase credentials');
        }
        
        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        
        // Get code from URL query string
        const code = searchParams.get('code');
        
        if (code) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            throw error;
          }
          
          // Get the session after exchange
          const { data, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (data?.session) {
            console.log('Successfully authenticated with Supabase');
            router.push('/dashboard');
          } else {
            throw new Error('Failed to get session after code exchange');
          }
        } else {
          // If no code, check if we already have a session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data?.session) {
            console.log('Already authenticated with Supabase');
            router.push('/dashboard');
          } else {
            throw new Error('No authentication code found in URL');
          }
        }
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(err.message || 'Authentication failed');
      }
    };
    
    handleCallback();
  }, [router, searchParams]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/40">
        {error ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
            <p className="text-red-400 mb-6">{error}</p>
            <button 
              onClick={() => router.push('/signin')} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Completing Authentication</h1>
            <div className="flex justify-center mb-6">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-300">Almost there! We're completing your authentication...</p>
          </div>
        )}
      </div>
    </div>
  );
} 