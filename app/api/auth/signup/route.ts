import { NextRequest, NextResponse } from 'next/server';

// This is a super lightweight handler for Edge Functions (under 1MB)
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { firstName, lastName, email, password, displayName } = await req.json();
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Return success - actual signup happens client-side via Supabase SDK
    // This avoids Edge Function size limits by not including heavy auth libraries
    return NextResponse.json({
      success: true,
      message: 'Signup request validated',
      user: {
        email,
        firstName, 
        lastName,
        displayName: displayName || `${firstName} ${lastName}`,
      }
    });
    
  } catch (error: any) {
    console.error('Error during signup validation:', error);
    return NextResponse.json({ 
      success: false,
      message: 'An error occurred during signup validation', 
      error: error.message 
    }, { status: 500 });
  }
} 