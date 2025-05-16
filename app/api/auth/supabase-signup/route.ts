import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route runs as a standard Node.js function, not an Edge Function
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

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
    const supabaseAdmin = createClient(
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
    
    const { firstName, lastName, email, password, displayName } = body;
    
    // Validate required fields
    if (!email || !password || !firstName) {
      return NextResponse.json({
        message: 'Email, password, and first name are required',
        success: false
      }, { status: 400 });
    }
    
    // Set first and last name - last name is optional
    const userFirstName = firstName;
    const userLastName = lastName || '';
    // Create display name, accounting for possibly empty last name
    const userDisplayName = displayName || (userLastName ? `${userFirstName} ${userLastName}` : userFirstName).trim();
    
    console.log('Creating user with Supabase:', { email, firstName: userFirstName, lastName: userLastName });
    
    // Determine which method to use based on key type
    let userData;
    let userError; 
    
    // Check if we have admin permissions or need to use regular signup
    const isAdmin = finalSupabaseKey.includes('service_role') || finalSupabaseKey === fallbackKey;
    
    if (isAdmin) {
      // Use admin API to create user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name: userFirstName,
          last_name: userLastName,
          display_name: userDisplayName
        }
      });
      userData = data;
      userError = error;
    } else {
      // Use regular signup
      const { data, error } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userFirstName,
            last_name: userLastName,
            display_name: userDisplayName
          }
        }
      });
      userData = data;
      userError = error;
    }
    
    if (userError) {
      console.error('Supabase signup error:', userError);
      return NextResponse.json({
        message: userError.message,
        success: false
      }, { status: 400 });
    }
    
    if (!userData || !userData.user) {
      console.error('No user returned from Supabase');
      return NextResponse.json({
        message: 'Failed to create user account',
        success: false
      }, { status: 500 });
    }
    
    console.log('User created successfully:', userData.user.id);
    
    // Create user profile in Supabase database (if table exists)
    try {
      // Check if table exists
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: userData.user.id,
          first_name: userFirstName,
          last_name: userLastName,
          display_name: userDisplayName || userFirstName,
          email: email,
          created_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Continue anyway, as the auth user was created successfully
      }
    } catch (profileError) {
      console.error('Error with user profile creation:', profileError);
      // Continue since the auth user was created successfully
    }
    
    return NextResponse.json({
      message: 'User registered successfully',
      success: true,
      user: {
        id: userData.user.id,
        email: userData.user.email,
        firstName: userFirstName,
        lastName: userLastName,
        displayName: userDisplayName
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error during Supabase registration:', error);
    return NextResponse.json({
      message: 'An error occurred during registration',
      error: error.message,
      success: false
    }, { status: 500 });
  }
} 