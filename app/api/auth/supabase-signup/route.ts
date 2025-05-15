import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route runs as a standard Node.js function, not an Edge Function
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );
    
    // Parse request body
    const { firstName, lastName, email, password, displayName } = await req.json();
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({
        message: 'Missing required fields',
        success: false
      }, { status: 400 });
    }
    
    console.log('Creating user with Supabase:', { email, firstName, lastName });
    
    // Create the user with Supabase
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        display_name: displayName
      }
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      return NextResponse.json({
        message: error.message,
        success: false
      }, { status: 400 });
    }
    
    console.log('User created successfully:', data.user.id);
    
    // Create user profile in Supabase database - create table if it doesn't exist first
    try {
      // Check if table exists and create it if not
      const { error: tableExistsError } = await supabaseAdmin.rpc('check_table_exists', { 
        table_name: 'user_profiles' 
      });
      
      if (tableExistsError) {
        // Create the table
        const { error: createTableError } = await supabaseAdmin.rpc('create_user_profiles_table');
        
        if (createTableError) {
          console.error('Error creating user_profiles table:', createTableError);
        }
      }
      
      // Insert the user profile
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          display_name: displayName || firstName,
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
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName,
        displayName: displayName || firstName
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