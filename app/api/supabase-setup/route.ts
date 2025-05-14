import { NextRequest, NextResponse } from 'next/server';
import { setupSupabaseDatabase, setupStoredProcedures } from '@/lib/supabase-setup';

// This is a standard Node.js serverless function, not an Edge function
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

// Endpoint for setting up Supabase database structure
export async function GET(req: NextRequest) {
  // Check for secret key to prevent unauthorized setup
  const setupKey = req.nextUrl.searchParams.get('setup_key');
  const validSetupKey = process.env.SUPABASE_SETUP_KEY;
  
  if (!validSetupKey || setupKey !== validSetupKey) {
    return NextResponse.json({ 
      success: false, 
      message: 'Unauthorized access. Valid setup key required.' 
    }, { status: 401 });
  }
  
  try {
    // Setup stored procedures first
    const procsResult = await setupStoredProcedures();
    if (!procsResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to set up stored procedures',
        error: procsResult.error
      }, { status: 500 });
    }
    
    // Then set up database structure
    const dbResult = await setupSupabaseDatabase();
    if (!dbResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to set up database structure',
        error: dbResult.error
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase database setup completed successfully!'
    }, { status: 200 });
  } catch (error) {
    console.error('Supabase setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred during Supabase setup',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 