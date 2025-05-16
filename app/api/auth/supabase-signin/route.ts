import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This is a standard serverless function, not an Edge function
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // If environment variables are not set, use fallback values for development
    // In production, these should be properly configured
    const fallbackUrl = 'https://gtqeeihydjqvidqleawe.supabase.co';
    const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0cWVlaWh5ZGpxdmlkcWxlYXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYwNTk5NTQsImV4cCI6MjAyMTYzNTk1NH0.SSUgWgNpaxwRGkbhxVCZtomk_M7jaesZ_tLCzYVn8jg';
    
    const finalSupabaseUrl = supabaseUrl || fallbackUrl;
    const finalSupabaseKey = supabaseServiceKey || fallbackKey;
    
    console.log('Supabase URL:', finalSupabaseUrl.substring(0, 15) + '...');
    console.log('Using service role key:', !!supabaseServiceKey);
    console.log('Using anon key fallback:', !supabaseServiceKey && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // Initialize Supabase client
    const supabase = createClient(
      finalSupabaseUrl,
      finalSupabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({
        success: false,
        message: 'Invalid request body'
      }, { status: 400 });
    }
    
    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }
    
    console.log('Attempting signin for email:', email);
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signin error:', error.message);
      
      // Handle specific error cases
      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json({
          success: false,
          message: 'Please confirm your email address before signing in'
        }, { status: 401 });
      }
      
      return NextResponse.json({
        success: false,
        message: error.message || 'Invalid login credentials'
      }, { status: 401 });
    }
    
    if (!data.user || !data.session) {
      console.error('No user or session returned from Supabase');
      return NextResponse.json({
        success: false,
        message: 'Authentication failed'
      }, { status: 401 });
    }
    
    console.log('User authenticated successfully:', data.user.id);
    
    // Return session data to client
    return NextResponse.json({
      success: true,
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        user_metadata: data.user.user_metadata
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error during server-side signin:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred during server-side signin'
    }, { status: 500 });
  }
} 