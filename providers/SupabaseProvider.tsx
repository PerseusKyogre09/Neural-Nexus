'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type SupabaseContextType = {
  session: Session | null;
  isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  isLoading: true,
});

export const useSupabase = () => useContext(SupabaseContext);

export default function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isInitialAuthCheckRef = useRef(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      setIsLoading(false);
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
      } catch (error) {
        console.error('Error fetching initial session:', error);
      } finally {
        setIsLoading(false);
        isInitialAuthCheckRef.current = false;
      }
    };
    
    getInitialSession();
    
    // Define a global auth redirect handler with subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      
      // Handle redirects only for initial sign in/sign out events
      if (event === 'SIGNED_IN' && !isInitialAuthCheckRef.current) {
        console.log('User signed in');
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT' && !isInitialAuthCheckRef.current) {
        console.log('User signed out');
        router.push('/');
      }
      
      // After the initial sign-in/sign-out, reset the flag
      if (isInitialAuthCheckRef.current) {
        isInitialAuthCheckRef.current = false;
      }
    });
    
    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <SupabaseContext.Provider value={{ session, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
} 