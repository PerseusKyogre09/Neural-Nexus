import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This can be a lightweight Edge function
export const runtime = 'edge';

// This route is used by Supabase Auth to handle email confirmation
// and OAuth sign-in redirects
export async function GET(req: NextRequest) {
  try {
    const requestUrl = new URL(req.url);
    
    // Extract Supabase auth callback parameters
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    
    // Handle errors from auth redirects
    if (error) {
      console.error('Auth callback error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/auth-error?error=${error}&description=${errorDescription || ''}`, requestUrl.origin)
      );
    }
    
    // If no code is present, redirect to the home page
    if (!code) {
      console.log('No code present in callback, redirecting to home');
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }
    
    // If we have a code, we can finalize the sign-in directly
    // Create a Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.redirect(
        new URL('/auth-error?error=configuration_error', requestUrl.origin)
      );
    }
    
    // Exchange code for session - no need for server-side handling
    // as this step can happen in the browser (client-side code)
    
    // Instead, we'll redirect to a client-side handler that will exchange the code
    return NextResponse.redirect(
      new URL(`/auth/exchange?code=${code}`, requestUrl.origin)
    );
  } catch (error) {
    console.error('Error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/auth-error?error=server_error', req.url)
    );
  }
} 