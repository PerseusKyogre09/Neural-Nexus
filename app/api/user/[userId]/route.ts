import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This can use Edge Runtime since it's a lightweight operation
export const runtime = 'edge';

// Initialize Supabase client for the Edge Runtime
const initSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// GET user profile
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = initSupabase();
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }
    
    // Fetch user profile from Supabase
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }
    
    if (!profile) {
      return NextResponse.json({
        success: false,
        message: 'User profile not found'
      }, { status: 404 });
    }
    
    // Return the profile without sensitive information
    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.user_id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        displayName: profile.display_name,
        email: profile.email,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        website: profile.website,
        socialLinks: profile.social_links,
        createdAt: profile.created_at
      }
    });
    
  } catch (error: any) {
    console.error('Error in GET user profile:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred getting user profile'
    }, { status: 500 });
  }
}

// PATCH update user profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = initSupabase();
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }
    
    // Parse request body
    const updates = await req.json();
    
    // Validate the updater is the profile owner
    // This would be better with server-side auth check,
    // but for demo purposes we'll use RLS policies in Supabase
    
    // Remove any fields that shouldn't be directly updated
    const { id, user_id, created_at, ...validUpdates } = updates;
    
    // Format updates for Supabase
    const formattedUpdates: Record<string, any> = {};
    
    // Convert camelCase to snake_case for Supabase
    if (validUpdates.firstName) formattedUpdates.first_name = validUpdates.firstName;
    if (validUpdates.lastName) formattedUpdates.last_name = validUpdates.lastName;
    if (validUpdates.displayName) formattedUpdates.display_name = validUpdates.displayName;
    if (validUpdates.bio) formattedUpdates.bio = validUpdates.bio;
    if (validUpdates.avatarUrl) formattedUpdates.avatar_url = validUpdates.avatarUrl;
    if (validUpdates.website) formattedUpdates.website = validUpdates.website;
    if (validUpdates.socialLinks) formattedUpdates.social_links = validUpdates.socialLinks;
    
    // Add updated_at timestamp
    formattedUpdates.updated_at = new Date().toISOString();
    
    // Update profile in Supabase
    const { data: updatedProfile, error } = await supabase
      .from('user_profiles')
      .update(formattedUpdates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        id: updatedProfile.id,
        userId: updatedProfile.user_id,
        firstName: updatedProfile.first_name,
        lastName: updatedProfile.last_name,
        displayName: updatedProfile.display_name,
        bio: updatedProfile.bio,
        avatarUrl: updatedProfile.avatar_url,
        website: updatedProfile.website,
        socialLinks: updatedProfile.social_links,
        updatedAt: updatedProfile.updated_at
      }
    });
    
  } catch (error: any) {
    console.error('Error in PATCH user profile:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred updating user profile'
    }, { status: 500 });
  }
} 